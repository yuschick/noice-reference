import { gql } from '@apollo/client';
import { ProfileImage } from '@noice-com/common-ui';

import styles from './ActiveFriendsList.module.css';

import { ActiveFriendsListProfileFragment } from '@social-gen';

interface Props {
  friends: ActiveFriendsListProfileFragment[];
  max?: number;
  totalAmount: number;
}

export function ActiveFriendsList({ friends, max = 3, totalAmount }: Props) {
  if (!friends.length) {
    return null;
  }

  const manyFriends = totalAmount > max;

  const shownFriends = manyFriends ? friends.slice(0, max) : friends;
  const hiddenFriendsAmount = manyFriends ? totalAmount - max : 0;

  return (
    <div className={styles.activeFriendsWrapper}>
      <ul className={styles.activeFriendsList}>
        {shownFriends.map((friend) => (
          <li
            className={styles.activeFriendsItem}
            key={friend.userTag}
            title={friend.userTag}
          >
            <ProfileImage
              profile={friend}
              size="xs"
            />
          </li>
        ))}
        {!!hiddenFriendsAmount && (
          <li className={styles.activeRemainingFriends}>+{hiddenFriendsAmount}</li>
        )}
      </ul>
    </div>
  );
}

ActiveFriendsList.fragments = {
  entry: gql`
    fragment ActiveFriendsListProfile on ProfileProfile {
      userTag
      avatars {
        avatar2D
      }
      ...ProfileImageProfile
    }
  `,
};
