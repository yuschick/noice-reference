import { gql } from '@apollo/client';
import { PopoverMenu, ProfileImage, UsePopoverMenuResult } from '@noice-com/common-ui';

import { FriendsSidebarFriendPanelAction } from '../../types';
import { FriendsSidebarFriendStatus } from '../FriendsSidebarFriendStatus/FriendsSidebarFriendStatus';

import styles from './FriendsSidebarFriendPanel.module.css';

import { FriendsSidebarFriendPanelFriendFragment } from '@social-gen';

gql`
  fragment FriendsSidebarFriendPanelFriend on FriendsUser {
    lastStatusChange
    profile {
      userId
      userTag
      avatars {
        avatar2D
      }
      onlineStatus
      userTag
      isNewUsername
      ...ProfileImageShowOnlineStatusProfile
    }
    ...FriendsSidebarFriendStatusFriendsUser
  }
`;

interface Props {
  popover: UsePopoverMenuResult;
  friend: FriendsSidebarFriendPanelFriendFragment;
  primaryActions: FriendsSidebarFriendPanelAction[];
  secondaryActions: FriendsSidebarFriendPanelAction[];
  onActionClick(): void;
}

export function FriendsSidebarFriendPanel({
  friend,
  popover,
  primaryActions,
  secondaryActions,
  onActionClick,
}: Props) {
  const { profile } = friend;
  const { userTag, isNewUsername } = profile;

  return (
    <PopoverMenu store={popover}>
      <PopoverMenu.Section>
        <div className={styles.top}>
          <ProfileImage
            profile={profile}
            showOnlineStatus
          />

          <div className={styles.friendInfo}>
            <span className={styles.displayName}>{userTag}</span>

            {isNewUsername && (
              <span className={styles.newUsernameIndicator}>
                Username changed recently
              </span>
            )}

            <FriendsSidebarFriendStatus friendsUser={friend} />
          </div>
        </div>
      </PopoverMenu.Section>

      {!!primaryActions.length && (
        <PopoverMenu.Section>
          {primaryActions.map((action) => {
            if (action.type === 'buttonLink') {
              return (
                <PopoverMenu.Link
                  key={action.text}
                  to={action.to}
                  onClick={onActionClick}
                >
                  {action.text}
                </PopoverMenu.Link>
              );
            }

            if (action.type === 'button') {
              return (
                <PopoverMenu.Button
                  isDisabled={action.disabled}
                  key={action.text}
                  onClick={() => {
                    action.onClick();
                    onActionClick();
                  }}
                >
                  {action.text}
                </PopoverMenu.Button>
              );
            }
          })}
        </PopoverMenu.Section>
      )}

      {!!secondaryActions.length && (
        <>
          <PopoverMenu.Divider />

          <PopoverMenu.Section>
            {secondaryActions.map((action) => {
              if (action.type === 'buttonLink') {
                return (
                  <PopoverMenu.Link
                    key={action.text}
                    to={action.to}
                    onClick={onActionClick}
                  >
                    {action.text}
                  </PopoverMenu.Link>
                );
              }

              if (action.type === 'button') {
                return (
                  <PopoverMenu.Button
                    isDisabled={action.disabled}
                    key={action.text}
                    onClick={() => {
                      action.onClick();
                      onActionClick();
                    }}
                  >
                    {action.text}
                  </PopoverMenu.Button>
                );
              }
            })}
          </PopoverMenu.Section>
        </>
      )}
    </PopoverMenu>
  );
}
