import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import {
  ConfirmDialog,
  Select,
  SelectOption,
  useAnalytics,
  useConfirmDialog,
} from '@noice-com/common-ui';
import {
  AnalyticsEventStudioSettingsChannelVisibilityAction,
  AnalyticsEventStudioSettingsChannelVisibilityVisibility,
} from '@noice-com/schemas/analytics/analytics.pb';
import toast from 'react-hot-toast';

import styles from './ChannelVisibility.module.css';

import {
  useStudioChannelVisibilityChannelQuery,
  useStudioUpdateChannelVisibilityMutation,
} from '@gen';

gql`
  query StudioChannelVisibilityChannel($channelId: ID!) {
    channel(id: $channelId) {
      id
      isPublic
    }
  }

  mutation StudioUpdateChannelVisibility($channelId: ID!, $isPublic: Boolean) {
    updateChannelDetails(body: { id: $channelId, isPublic: $isPublic }) {
      id
      isPublic
    }
  }
`;

interface Props {
  channelId: string;
}

export function ChannelVisibility({ channelId }: Props) {
  const { trackEvent } = useAnalytics();
  const { data, loading } = useStudioChannelVisibilityChannelQuery({
    ...variablesOrSkip({ channelId }),
  });

  const isPublic = !!data?.channel?.isPublic;

  const [updateChannelVisibility] = useStudioUpdateChannelVisibilityMutation({
    ...variablesOrSkip({ channelId, isPublic: !data?.channel?.isPublic }),
    update(cache, _result, { variables }) {
      cache.updateFragment(
        {
          id: cache.identify({ id: channelId, __typename: 'ChannelChannel' }),
          fragment: gql`
            fragment PrivacyUpdateChannel on ChannelChannel {
              id
              isPublic
            }
          `,
        },
        (existingChannel) => ({
          ...existingChannel,
          isPublic: variables?.isPublic,
        }),
      );
    },
    onCompleted() {
      dialog.actions.close();
      toast.success('Channel visibility updated successfully!');
    },
    onError(error) {
      toast.error(
        `There was an error updating your channel visibility. Please try again.
        ${error.message}`,
      );
    },
  });

  const dialog = useConfirmDialog({
    title: 'Update channel visibility',
    description: 'Are you sure you want to change the channel visibility?',
    onCancel: [
      () => {
        trackEvent({
          studioSettingsChannelVisibility: {
            action:
              AnalyticsEventStudioSettingsChannelVisibilityAction.ACTION_CANCEL_CHANGE_DIALOG,
            channelId: channelId,
            visibility: isPublic
              ? AnalyticsEventStudioSettingsChannelVisibilityVisibility.VISIBILITY_PUBLIC
              : AnalyticsEventStudioSettingsChannelVisibilityVisibility.VISIBILITY_UNLISTED,
          },
        });
      },
      { label: 'No, cancel' },
    ],
    onConfirm: [
      () => {
        updateChannelVisibility();
        trackEvent({
          studioSettingsChannelVisibility: {
            action:
              AnalyticsEventStudioSettingsChannelVisibilityAction.ACTION_CONFIRM_CHANGE_DIALOG,
            channelId: channelId,
            visibility: isPublic
              ? AnalyticsEventStudioSettingsChannelVisibilityVisibility.VISIBILITY_PUBLIC
              : AnalyticsEventStudioSettingsChannelVisibilityVisibility.VISIBILITY_UNLISTED,
          },
        });
      },
      { label: 'Yes, update' },
    ],
    onOpen: () => {
      trackEvent({
        studioSettingsChannelVisibility: {
          action:
            AnalyticsEventStudioSettingsChannelVisibilityAction.ACTION_OPEN_CHANGE_DIALOG,
          channelId: channelId,
          visibility: isPublic
            ? AnalyticsEventStudioSettingsChannelVisibilityVisibility.VISIBILITY_PUBLIC
            : AnalyticsEventStudioSettingsChannelVisibilityVisibility.VISIBILITY_UNLISTED,
        },
      });
    },
  });

  const options: SelectOption[] = [
    {
      label: 'Public',
      type: 'option',
      value: 'true',
    },
    {
      label: 'Unlisted',
      type: 'option',
      value: 'false',
    },
  ];

  return (
    <>
      <ConfirmDialog store={dialog} />

      <div className={styles.channelVisibilityWrapper}>
        <div>
          <h3 className={styles.title}>Channel visibility</h3>
          {isPublic ? (
            <span>Everyone can view your channel.</span>
          ) : (
            <span>Only people with the URL can access your channel.</span>
          )}
        </div>

        <Select
          color="gray"
          isDisabled={loading}
          label="Channel visibility"
          labelType="hidden"
          options={options}
          value={isPublic.toString()}
          onChange={() => dialog.actions.open()}
        />
      </div>
    </>
  );
}
