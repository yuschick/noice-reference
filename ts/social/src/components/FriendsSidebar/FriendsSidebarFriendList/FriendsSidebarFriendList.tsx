import { gql } from '@apollo/client';
import { Button } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import classNames from 'classnames';
import { useId, useState } from 'react';

import { BlockUserModal } from '../../BlockUserModal';
import { FriendsSidebarFriend } from '../FriendsSidebarFriend/FriendsSidebarFriend';

import styles from './FriendsSidebarFriendList.module.css';

import { FriendsSidebarFriendListFriendFragment } from '@social-gen';

interface Props {
  friends: FriendsSidebarFriendListFriendFragment[];
  minimized?: boolean;
  isInStream?: boolean;
  partyLeaderId?: string;
  onLoadMoreClick?(): void;
}

export function FriendsSidebarFriendList({
  friends,
  minimized,
  isInStream,
  partyLeaderId,
  onLoadMoreClick,
}: Props) {
  const [confirmBlockedUserId, setConfirmBlockedUserId] =
    useState<Nullable<string>>(null);
  const id = useId();

  return (
    <div className={styles.friendsWrapper}>
      <ul
        aria-labelledby={id}
        className={styles.list}
      >
        {friends.map((friend) => (
          <li key={friend.profile.userId}>
            <FriendsSidebarFriend
              friend={friend}
              isInStream={!!isInStream}
              isPartyLeader={friend.profile.userId === partyLeaderId}
              minimized={minimized}
              onBlockUser={() => setConfirmBlockedUserId(friend.profile.userId)}
            />
          </li>
        ))}
      </ul>

      {!!onLoadMoreClick && !minimized && (
        <Button
          level="secondary"
          size="sm"
          onClick={onLoadMoreClick}
        >
          Show more friends
        </Button>
      )}

      {!!confirmBlockedUserId && (
        <BlockUserModal
          blockedUserId={confirmBlockedUserId}
          onDismiss={() => setConfirmBlockedUserId(null)}
        />
      )}
    </div>
  );
}

FriendsSidebarFriendList.Loading = () => {
  return (
    <div className={styles.wrapper}>
      <div
        className={classNames(styles.titleRow, {
          [styles.hideTitle]: true,
        })}
      />

      <ul className={styles.list}>
        {new Array(5).fill(null).map((_, index) => (
          <li key={index}>
            <FriendsSidebarFriend.Loading />
          </li>
        ))}
      </ul>
    </div>
  );
};

FriendsSidebarFriendList.fragments = {
  friend: gql`
    fragment FriendsSidebarFriendListFriend on FriendsUser {
      ...FriendsSidebarFriend
    }
  `,
  profile: gql`
    fragment FriendsSidebarFriendListProfile on ProfileProfile {
      ...FriendsSidebarFriendProfile
    }
  `,
};
