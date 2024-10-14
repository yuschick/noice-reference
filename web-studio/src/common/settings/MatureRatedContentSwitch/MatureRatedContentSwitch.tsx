import { gql } from '@apollo/client';
import { Anchor, NoiceSupportLinks, Switch } from '@noice-com/common-ui';
import { DeepPartial } from '@noice-com/utils';
import toast from 'react-hot-toast';

import styles from './MatureRatedContentSwitch.module.css';

import { useChannelContext } from '@common/channel';
import {
  ChannelChannel,
  MatureRatedContentUpdatedChannelFragmentDoc,
  useMatureRatedContentChannelQuery,
  useUpdateChannelMatureRatedContentMutation,
} from '@gen';

gql`
  query MatureRatedContentChannel($channelId: ID!) {
    channel(id: $channelId) {
      id
      matureRatedContent
    }
  }

  mutation UpdateChannelMatureRatedContent(
    $channelId: ID!
    $matureRatedContent: Boolean!
  ) {
    updateChannelDetails(
      body: { id: $channelId, matureRatedContent: $matureRatedContent }
    ) {
      id
      ...MatureRatedContentUpdatedChannel
    }
  }

  fragment MatureRatedContentUpdatedChannel on ChannelChannel {
    matureRatedContent
  }
`;

export function MatureRatedContentSwitch() {
  const { channelId } = useChannelContext();

  const { data, loading: loadingData } = useMatureRatedContentChannelQuery({
    variables: {
      channelId,
    },
  });

  const matureRatedContent = data?.channel?.matureRatedContent ?? false;

  const [updateMatureRatedContent, { loading: updateLoading }] =
    useUpdateChannelMatureRatedContentMutation({
      onCompleted: () => {
        toast.success('Successfully updated mature-rated content');
      },
      onError(error) {
        toast.error(`Something went wrong: ${error.message}`);
      },
      update(cache, { data }) {
        const updatedChannel = data?.updateChannelDetails;

        if (!updatedChannel) {
          return;
        }

        cache.updateFragment<DeepPartial<ChannelChannel>>(
          {
            id: cache.identify(updatedChannel),
            fragment: MatureRatedContentUpdatedChannelFragmentDoc,
          },
          (existing) => ({
            ...existing,
            matureRatedContent: updatedChannel.matureRatedContent,
          }),
        );
      },
    });

  const onMatureRatedContentChange = (value: boolean) => {
    updateMatureRatedContent({
      variables: {
        channelId,
        matureRatedContent: value,
      },
    });
  };

  return (
    <div className={styles.matureRatedContentSwitchWrapper}>
      <Switch
        checked={matureRatedContent}
        description="Enable this if your channel contains content or discussion that may be inappropriate for younger audiences. For more detail on when we may require you to enable this flag, please refer to our Community Guidelines."
        isLoading={loadingData || updateLoading}
        label="Mature-rated content"
        onChange={(event) => onMatureRatedContentChange(event.target.checked)}
      />

      <p className={styles.hyperlinks}>
        <Anchor href={NoiceSupportLinks.CommunityGuidelines}>Community Guidelines</Anchor>
      </p>
    </div>
  );
}
