import { gql } from '@apollo/client';
import { ProfileImage } from '@noice-com/common-ui';
import classNames from 'classnames';

import styles from './FriendRequestAcceptedNotificationContent.module.css';

import { NotificationComponentBaseProps } from '@common/notification/types';
import { FriendRequestAcceptedNotificationContentProfileFragment } from '@gen';

gql`
  fragment FriendRequestAcceptedNotificationContentProfile on ProfileProfile {
    userId
    userTag
    avatars {
      avatar2D
    }
    ...ProfileImageProfile
  }
`;

interface Props extends NotificationComponentBaseProps {
  senderProfile: FriendRequestAcceptedNotificationContentProfileFragment;
}

export function FriendRequestAcceptedNotificationContent({
  theme = 'light',
  senderProfile,
}: Props) {
  const { userTag } = senderProfile;

  return (
    <div className={classNames(styles.wrapper, styles[theme])}>
      <ProfileImage profile={senderProfile} />

      <div className={styles.content}>
        <div className={styles.textContent}>
          <span className={styles.actorName}>{userTag}</span> accepted your friend
          request!
        </div>
      </div>
    </div>
  );
}
