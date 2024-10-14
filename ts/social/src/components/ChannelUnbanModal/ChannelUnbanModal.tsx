import { gql } from '@apollo/client';
import { Button, CommonUtils, Dialog, useDialog } from '@noice-com/common-ui';
import { useChannelUnbanMutation } from '@noice-com/social-react-core';

import { useMiniProfileContext } from '../MiniProfilePortal/context';

import styles from './ChannelUnbanModal.module.css';

import { ChannelBanModalProfileFragment } from '@social-gen';

gql`
  fragment ChannelUnbanModalProfile on ProfileProfile {
    userTag
    userId
  }

  fragment ChannelUnbanModalChannelUserBanStatus on ChannelUserBanStatus {
    bannedAt
    violation
    description
    moderator {
      userId
      userTag
    }
  }
`;

export interface Props {
  profile: ChannelBanModalProfileFragment;
  channelId: string;
  onClose(): void;

  onModerationAction?(
    message: string,
    username: string,
    state: 'success' | 'error',
  ): void;
}

export function ChannelUnbanModal({
  profile,
  channelId,
  onClose,
  onModerationAction,
}: Props) {
  const { channelBan } = useMiniProfileContext();

  const store = useDialog({
    title: `Unban ${profile.userTag}`,
    onClose,
    initialState: 'open',
  });

  const [unbanUser, { loading }] = useChannelUnbanMutation({
    onError() {
      onModerationAction?.('Unbanning USERNAME failed', profile.userTag, 'error');
      onClose?.();
    },
    onCompleted() {
      onModerationAction?.('USERNAME is unbanned', profile.userTag, 'success');
      onClose?.();
    },
  });

  const onUnbanClick = () => {
    unbanUser({
      variables: {
        userId: profile.userId,
        channelId,
      },
    });
  };

  if (!channelBan) {
    return null;
  }

  return (
    <Dialog store={store}>
      <Dialog.Header />
      <Dialog.Content>
        <div className={styles.fields}>
          <div className={styles.fieldWrapper}>
            <span className={styles.fieldWrapperLabel}>Reason for ban</span>

            <span>{CommonUtils.getChannelViolationText(channelBan.violation)}</span>
          </div>

          <div className={styles.fieldWrapper}>
            <span className={styles.fieldWrapperLabel}>Ban given by</span>

            <span>{channelBan.moderator?.userTag}</span>
          </div>

          <div className={styles.fieldWrapper}>
            <span className={styles.fieldWrapperLabel}>Moderator note</span>

            <span>{channelBan.description ? channelBan.description : '-'}</span>
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
          isLoading={loading}
          size="md"
          theme="dark"
          onClick={onUnbanClick}
        >
          Unban user
        </Button>
      </Dialog.Actions>
    </Dialog>
  );
}
