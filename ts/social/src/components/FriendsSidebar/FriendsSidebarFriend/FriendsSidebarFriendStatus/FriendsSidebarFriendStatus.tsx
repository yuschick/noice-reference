import { gql } from '@apollo/client';

import styles from './FriendsSidebarFriendStatus.module.css';

import {
  FriendsSidebarFriendStatusFriendsUserFragment,
  ProfilePresenceStatus,
} from '@social-gen';

interface Props {
  friendsUser: FriendsSidebarFriendStatusFriendsUserFragment;
}

const getOnlineStatus = (friendsUser: FriendsSidebarFriendStatusFriendsUserFragment) => {
  if (friendsUser.profile.onlineStatus !== ProfilePresenceStatus.PresenceStatusOnline) {
    return 'Offline';
  }

  if (!friendsUser.activity?.isOnline || !friendsUser.activity?.channel) {
    return 'Browsing';
  }

  const { channel } = friendsUser.activity;

  return (
    <>
      <span className={styles.channel}>{channel.name}</span> - {channel.game.name}
    </>
  );
};

export function FriendsSidebarFriendStatus({ friendsUser }: Props) {
  return <span className={styles.onlineStatus}>{getOnlineStatus(friendsUser)}</span>;
}

FriendsSidebarFriendStatus.fragment = {
  friendUser: gql`
    fragment FriendsSidebarFriendStatusFriendsUser on FriendsUser {
      activity {
        isOnline
        channel {
          id
          name
          game {
            id
            name
          }
        }
      }
      profile {
        userId
        onlineStatus
      }
    }
  `,
};
