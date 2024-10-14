import { gql } from '@apollo/client';
import { ChannelLogo } from '@noice-com/common-ui';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import styles from './ForceChannelOfflineModal.module.css';

import { ModalDialog } from '@common/dialog';
import { MutationForm } from '@common/form';
import { UseFormTextarea } from '@common/input';
import {
  ModerationModalFooter,
  ModerationModalHeader,
} from '@common/modal/ModerationModal/ModerationModal';
import {
  ForceChannelOfflineModalChannelFragment,
  ForceChannelOfflineMutation,
  ForceChannelOfflineMutationVariables,
  useForceChannelOfflineMutation,
} from '@gen';

gql`
  mutation ForceChannelOffline($channelId: ID!, $description: String) {
    suspendChannelFeature(
      channelId: $channelId
      description: $description
      feature: CHANNEL_FEATURE_STREAMING
      duration: "86400s"
    ) {
      emptyTypeWorkaround
    }
  }
`;
export interface Props {
  channel: ForceChannelOfflineModalChannelFragment;
  open: boolean;
  onClose(): void;
  onSubmit(): void;
}

export function ForceChannelOfflineModal({ open, onClose, channel, onSubmit }: Props) {
  const [forceChannelOffline, { loading }] = useForceChannelOfflineMutation({
    onCompleted() {
      onSubmit();
    },
  });

  const methods = useForm<ForceChannelOfflineMutationVariables>({
    shouldUseNativeValidation: true,
    defaultValues: {
      channelId: channel.id,
      description: undefined,
    },
  });

  const { register, formState, reset } = methods;

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  return (
    <ModalDialog
      isOpen={open}
      title="Force Channel Offline"
      onClose={onClose}
    >
      <FormProvider {...methods}>
        <MutationForm<ForceChannelOfflineMutation, ForceChannelOfflineMutationVariables>
          mutationFn={forceChannelOffline}
          useCustomSubmitButton
        >
          <ModerationModalHeader
            imageElement={
              <ChannelLogo
                channel={channel}
                showLiveStatus={false}
              />
            }
            subtitleData={[
              { label: 'Followers', value: channel.followerCount },
              { label: 'Subscribers', value: channel.subscriberCount },
            ]}
            title={channel.name}
          />

          <UseFormTextarea
            formState={formState}
            label="Enforcement note"
            maxLength={500}
            minLength={10}
            name="description"
            placeholder="Input text"
            register={register}
            disableChangeStyles
          />

          <ul className={styles.feats}>
            <li>Forces channel offline immediately</li>
            <li>Prevents streaming for 24 hours</li>
          </ul>

          <ModerationModalFooter
            loading={loading}
            submitButtonLabel="Force Channel Offline"
            onClose={onClose}
          />
        </MutationForm>
      </FormProvider>
    </ModalDialog>
  );
}

ForceChannelOfflineModal.fragments = {
  entry: gql`
    fragment ForceChannelOfflineModalChannel on ChannelChannel {
      id
      name
      followerCount
      subscriberCount
      liveStatus
      logo
    }
  `,
};
