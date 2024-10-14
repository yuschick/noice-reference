import { gql } from '@apollo/client';
import { CoreAssets } from '@noice-com/assets-core';
import { Icon, ProfileImage, useMergeRefs } from '@noice-com/common-ui';
import { ButtonHTMLAttributes, forwardRef, useRef } from 'react';

import { FriendsSidebarFriendButtons } from '../FriendsSidebarFriendButtons/FriendsSidebarFriendButtons';
import { FriendsSidebarFriendStatus } from '../FriendsSidebarFriendStatus/FriendsSidebarFriendStatus';

import styles from './FriendsSidebarItemExpanded.module.css';

import { FriendsSidebarItemExpandedFriendFragment } from '@social-gen';

gql`
  fragment FriendsSidebarItemExpandedFriend on FriendsUser {
    profile {
      userId
      ...FriendsSidebarItemExpandedProfile
    }
    ...FriendsSidebarFriendStatusFriendsUser
  }

  fragment FriendsSidebarItemExpandedProfile on ProfileProfile {
    userTag
    isNewUsername
    ...ProfileImageShowOnlineStatusProfile
    ...FriendsSidebarFriendButtonsProfile
  }
`;

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  friend: FriendsSidebarItemExpandedFriendFragment;
  isPartyLeader?: boolean;
}

export const FriendsSidebarItemExpanded = forwardRef<HTMLButtonElement, Props>(
  function FriendsSidebarItemExpanded(
    { friend, isPartyLeader, ...htmlAttributes },
    externalRef,
  ) {
    const internalRef = useRef<HTMLButtonElement>(null);
    const ref = useMergeRefs([internalRef, externalRef]);
    const { profile } = friend;
    const { userTag, isNewUsername } = profile;

    return (
      <>
        <button
          {...htmlAttributes}
          aria-label={userTag}
          className={styles.friendsSidebarItemExpanded}
          ref={ref}
        >
          <ProfileImage
            profile={profile}
            showOnlineStatus
          />

          <div className={styles.friendDetailsWrapper}>
            <div className={styles.friendNameWrapper}>
              <span className={styles.friendName}>
                <span>{userTag}</span>

                {isNewUsername && (
                  <Icon
                    className={styles.friendNameIcon}
                    color="status-alert-main"
                    icon={CoreAssets.Icons.History}
                    size={16}
                    title="Username changed recently"
                  />
                )}
              </span>

              {isPartyLeader && (
                <Icon
                  className={styles.friendNameIcon}
                  color="teal-main"
                  icon={CoreAssets.Icons.Crown}
                  size={16}
                  title="Party leader"
                />
              )}
            </div>
            <FriendsSidebarFriendStatus friendsUser={friend} />
          </div>
        </button>

        <div className={styles.requestButtonsWrapper}>
          <FriendsSidebarFriendButtons profile={profile} />
        </div>
      </>
    );
  },
);
