import { gql } from '@apollo/client';
import { ProfileImage, Button } from '@noice-com/common-ui';
import {
  useAcceptFriendRequestMutation,
  useRemoveReceivedFriendRequestMutation,
} from '@noice-com/social';
import classNames from 'classnames';

import styles from './FriendRequestNotificationContent.module.css';

import { NotificationComponentBaseProps } from '@common/notification/types';
import { FriendRequestNotificationContentProfileFragment } from '@gen';

gql`
  fragment FriendRequestNotificationContentProfile on ProfileProfile {
    userId
    userTag
    avatars {
      avatar2D
    }

    ...ProfileImageProfile
  }
`;

interface Props extends NotificationComponentBaseProps {
  senderProfile: FriendRequestNotificationContentProfileFragment;
  onMutationCompleted?(notificationId: string): void;
}

export function FriendRequestNotificationContent({
  theme = 'light',
  senderProfile,
  onMutationCompleted,
  notificationId,
}: Props) {
  const { userTag, userId: profileUserId } = senderProfile;

  const [acceptRequest] = useAcceptFriendRequestMutation({
    profileUserId,
    onCompleted() {
      onMutationCompleted?.(notificationId);
    },
  });
  const [declineRequest] = useRemoveReceivedFriendRequestMutation({
    profileUserId,
    onCompleted() {
      onMutationCompleted?.(notificationId);
    },
  });

  return (
    <div className={classNames(styles.wrapper, styles[theme])}>
      <ProfileImage profile={senderProfile} />

      <div className={styles.content}>
        <div className={styles.textContent}>
          <span className={styles.actorName}>{userTag}</span> sent you a friend request!
        </div>

        <div className={styles.buttons}>
          <Button
            level="primary"
            size="sm"
            theme={theme === 'light' ? 'dark' : 'light'}
            onClick={() => acceptRequest()}
          >
            Accept
          </Button>

          <Button
            level="secondary"
            size="sm"
            theme={theme === 'light' ? 'dark' : 'light'}
            onClick={() => declineRequest()}
          >
            Decline
          </Button>
        </div>
      </div>
    </div>
  );
}
