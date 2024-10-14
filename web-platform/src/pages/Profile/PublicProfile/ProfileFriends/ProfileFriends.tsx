import { gql } from '@apollo/client';
import { CoreAssets } from '@noice-com/assets-core';
import { Icon, LoadingSkeleton, ProfileImage } from '@noice-com/common-ui';
import { Link } from 'react-router-dom';

import styles from './ProfileFriends.module.css';

import { generateProfileLink } from '@common/profile';
import { ProfileFriendsProfileFragment } from '@gen';

interface Props {
  friends: ProfileFriendsProfileFragment[];
  isOwnProfile: boolean;
}

export function ProfileFriends({ friends, isOwnProfile }: Props) {
  return (
    <div className={styles.profileSectionWrapper}>
      <h3 className={styles.titleWrapper}>
        <Icon
          className={styles.icon}
          icon={CoreAssets.Icons.Friends}
        />
        <span>Friends</span>
      </h3>

      {friends.length ? (
        <ul className={styles.list}>
          {friends.map((friend) => (
            <li key={friend.userId}>
              <Link
                className={styles.link}
                to={generateProfileLink(friend.userTag)}
              >
                <ProfileImage
                  profile={friend}
                  size="lg"
                  showOnlineStatus
                />

                <span className={styles.name}>{friend.userTag}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div>
          <span>
            {isOwnProfile
              ? 'You have no added any friends yet.'
              : 'This user has not added any friends yet.'}
          </span>
        </div>
      )}
    </div>
  );
}

ProfileFriends.Loading = () => {
  return (
    <div>
      <h2 className={styles.titleWrapper}>
        <Icon
          className={styles.icon}
          icon={CoreAssets.Icons.Friends}
        />
        <span>Friends</span>
      </h2>

      <ul className={styles.list}>
        {Array(4)
          .fill(null)
          .map((_, index) => (
            <li key={index}>
              <div className={styles.link}>
                <ProfileImage.Loading size="lg" />
                <LoadingSkeleton className={styles.loadingName} />
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
};

ProfileFriends.fragments = {
  entry: gql`
    fragment ProfileFriendsProfile on ProfileProfile {
      userId
      userTag
      ...ProfileImageShowOnlineStatusProfile
    }
  `,
};
