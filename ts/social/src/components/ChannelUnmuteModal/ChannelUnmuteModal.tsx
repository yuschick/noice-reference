import { gql } from '@apollo/client';
import { Button, Countdown, Dialog, useDialog } from '@noice-com/common-ui';
import { useId } from 'react';

import { useMiniProfileContext } from '../MiniProfilePortal/context';

import styles from './ChannelUnmuteModal.module.css';

import { ChannelUnmuteModalProfileFragment, useUnmuteUserMutation } from '@social-gen';
import { getMuteDurationTimestamp } from '@social-utils';

gql`
  mutation UnmuteUser($chatId: ID!, $userId: ID!) {
    unmuteChatUser(chatId: $chatId, userId: $userId) {
      emptyTypeWorkaround
    }
  }

  fragment ChannelUnmuteModalProfile on ProfileProfile {
    userTag
    userId
  }

  fragment ChannelUnmuteModalChatStatus on ChatGetChatUserStatusResponse {
    muteDuration
  }
`;

export interface Props {
  profile: ChannelUnmuteModalProfileFragment;
  chatId: string;
  onModerationAction?(
    message: string,
    username: string,
    state: 'success' | 'error',
  ): void;
  onClose(): void;
}

export function ChannelUnmuteModal({
  profile,
  chatId,
  onClose,
  onModerationAction,
}: Props) {
  const { chatStatus } = useMiniProfileContext();

  const id = useId();

  const store = useDialog({
    title: `Unmute ${profile.userTag}`,
    onClose,
    initialState: 'open',
  });

  const [unmuteUser, { loading }] = useUnmuteUserMutation({
    onError() {
      onModerationAction?.('Unmuting USERNAME failed', profile.userTag, 'error');
      onClose?.();
    },
    onCompleted() {
      onModerationAction?.('USERNAME is unmuted', profile.userTag, 'success');
      onClose?.();
    },
  });

  const onUnmuteClick = () => {
    unmuteUser({
      variables: {
        userId: profile.userId,
        chatId,
      },
    });
  };

  return (
    <Dialog store={store}>
      <Dialog.Header />
      <Dialog.Content>
        <div className={styles.fields}>
          <div className={styles.fieldWrapper}>
            <span className={styles.fieldWrapperLabel}>Duration of mute</span>

            {!!chatStatus?.muteDuration && (
              <Countdown
                className={styles.moderationStateContent}
                secondsSuffix="s"
                target={getMuteDurationTimestamp(chatStatus.muteDuration)}
              />
            )}
          </div>
        </div>
      </Dialog.Content>

      <Dialog.Actions>
        <Button
          level="secondary"
          theme="dark"
          onClick={store.actions.close}
        >
          Cancel
        </Button>

        <Button
          form={id}
          isLoading={loading}
          size="md"
          theme="dark"
          onClick={onUnmuteClick}
        >
          Unmute user
        </Button>
      </Dialog.Actions>
    </Dialog>
  );
}
