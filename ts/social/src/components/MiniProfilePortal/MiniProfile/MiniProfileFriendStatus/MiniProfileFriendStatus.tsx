import { gql } from '@apollo/client';
import { CoreAssets } from '@noice-com/assets-core';
import { Button, ConfirmDialog, Icon, useConfirmDialog } from '@noice-com/common-ui';
import { DateAndTimeUtils } from '@noice-com/utils';
import classNames from 'classnames';

import styles from './MiniProfileFriendStatus.module.css';

import {
  FriendsFriendshipStatusStatus,
  MiniProfileFriendStatusProfileFragment,
} from '@social-gen';
import {
  useAcceptFriendRequestMutation,
  useRemoveReceivedFriendRequestMutation,
  useRemoveSentFriendRequestMutation,
} from '@social-hooks';

gql`
  fragment MiniProfileFriendStatusProfile on ProfileProfile {
    userId
    userTag
    friendshipStatus {
      status
      lastStatusChange
    }
  }
`;

interface Props {
  profile: MiniProfileFriendStatusProfileFragment;
}

const renderedFriendshipStatuses = [
  FriendsFriendshipStatusStatus.StatusFriend,
  FriendsFriendshipStatusStatus.StatusFriendRequestSent,
  FriendsFriendshipStatusStatus.StatusFriendRequestReceived,
];

export function MiniProfileFriendStatus({ profile }: Props) {
  const { userId: profileUserId, userTag, friendshipStatus } = profile;

  const [onRemoveSentRequest] = useRemoveSentFriendRequestMutation({
    profileUserId,
  });
  const [onRemoveReceivedRequest] = useRemoveReceivedFriendRequestMutation({
    profileUserId,
  });
  const [onAcceptFriend, { loading: accepting }] = useAcceptFriendRequestMutation({
    profileUserId,
  });

  const confirmDialog = useConfirmDialog({
    title:
      friendshipStatus.status ===
      FriendsFriendshipStatusStatus.StatusFriendRequestReceived
        ? 'Decline Friend Request'
        : 'Cancel Friend Request',
    description:
      friendshipStatus.status ===
      FriendsFriendshipStatusStatus.StatusFriendRequestReceived
        ? 'Are you sure you want to decline this friend request?'
        : `Are you sure you want to cancel friend request for ${userTag}?`,
    onCancel: () => true,
    onConfirm: async () => {
      if (
        friendshipStatus.status ===
        FriendsFriendshipStatusStatus.StatusFriendRequestReceived
      ) {
        await onRemoveReceivedRequest();
        return;
      }

      await onRemoveSentRequest();
    },
  });

  if (!renderedFriendshipStatuses.includes(friendshipStatus.status)) {
    return null;
  }

  if (friendshipStatus.status === FriendsFriendshipStatusStatus.StatusFriend) {
    return (
      <div className={classNames(styles.friendStatusFriends, styles.friendStatusWrapper)}>
        <Icon icon={CoreAssets.Icons.Friends} />

        <span>
          Friends since{' '}
          <span className={styles.friendStatusFriendsSince}>
            {DateAndTimeUtils.getShortDate(friendshipStatus.lastStatusChange)}
          </span>
        </span>
      </div>
    );
  }

  return (
    <>
      <div
        className={classNames(styles.friendStatusPending, styles.friendStatusWrapper, {
          [styles.friendStatusSent]:
            friendshipStatus.status ===
            FriendsFriendshipStatusStatus.StatusFriendRequestSent,
          [styles.friendStatusReceived]:
            friendshipStatus.status ===
            FriendsFriendshipStatusStatus.StatusFriendRequestReceived,
        })}
      >
        <div className={styles.friendStatusPendingTextContent}>
          <Icon icon={CoreAssets.Icons.Friends} />

          <span>
            {friendshipStatus.status ===
            FriendsFriendshipStatusStatus.StatusFriendRequestReceived ? (
              <>
                <span className={styles.friendUsername}>{userTag}</span> sent you a friend
                request!
              </>
            ) : (
              'Friend request sent'
            )}
          </span>
        </div>

        {friendshipStatus.status ===
        FriendsFriendshipStatusStatus.StatusFriendRequestSent ? (
          <Button
            fit="content"
            level="secondary"
            size="xs"
            onClick={confirmDialog.actions.open}
          >
            Cancel
          </Button>
        ) : (
          <>
            <Button
              isLoading={accepting}
              size="sm"
              onClick={() => onAcceptFriend()}
            >
              Accept
            </Button>

            <Button
              level="secondary"
              size="sm"
              onClick={confirmDialog.actions.open}
            >
              Decline
            </Button>
          </>
        )}
      </div>

      <ConfirmDialog store={confirmDialog} />
    </>
  );
}
