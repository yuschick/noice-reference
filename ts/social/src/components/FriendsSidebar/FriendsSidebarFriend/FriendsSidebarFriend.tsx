import { gql } from '@apollo/client';
import { ConfirmDialog, ProfileImage, usePopoverMenu } from '@noice-com/common-ui';

import styles from './FriendsSidebarFriend.module.css';
import { FriendsSidebarFriendPanel } from './FriendsSidebarFriendPanel/FriendsSidebarFriendPanel';
import { FriendsSidebarItemExpanded } from './FriendsSidebarItem';
import { FriendsSidebarItemCollapsed } from './FriendsSidebarItem/FriendsSidebarItemCollapsed';
import { useFriendsSidebarFriendActions } from './hooks';

import { FriendsSidebarFriendFragment } from '@social-gen';

interface Props {
  friend: FriendsSidebarFriendFragment;
  minimized?: boolean;
  isInStream: boolean;
  isPartyLeader?: boolean;
  onBlockUser(): void;
}

export function FriendsSidebarFriend({
  friend,
  minimized,
  isInStream,
  isPartyLeader,
  onBlockUser,
}: Props) {
  const popover = usePopoverMenu({ placement: 'left-start' });

  const {
    primaryActions,
    secondaryActions,
    leavePartyDialog,
    inviteToPartyDialog,
    removeFriendDialog,
  } = useFriendsSidebarFriendActions({
    friend,
    isInStream,
    onBlockUser,
  });

  return (
    <>
      <ConfirmDialog store={leavePartyDialog} />
      <ConfirmDialog store={inviteToPartyDialog} />
      <ConfirmDialog store={removeFriendDialog} />

      <div>
        <div className={styles.buttons}>
          {minimized ? (
            <FriendsSidebarItemCollapsed
              friend={friend}
              ref={popover.state.popoverMenuTriggerRef}
              onClick={popover.actions.toggle}
            />
          ) : (
            <FriendsSidebarItemExpanded
              friend={friend}
              isPartyLeader={isPartyLeader}
              ref={popover.state.popoverMenuTriggerRef}
              onClick={popover.actions.toggle}
            />
          )}
        </div>

        <FriendsSidebarFriendPanel
          friend={friend}
          popover={popover}
          primaryActions={primaryActions}
          secondaryActions={secondaryActions}
          onActionClick={popover.actions.toggle}
        />
      </div>
    </>
  );
}

FriendsSidebarFriend.Loading = () => {
  return (
    <div className={styles.button}>
      <ProfileImage.Loading />
    </div>
  );
};

FriendsSidebarFriend.fragments = {
  entry: gql`
    fragment FriendsSidebarFriend on FriendsUser {
      userId
      profile {
        ...FriendsSidebarFriendProfile
        ...ProfileImageShowOnlineStatusProfile
      }
      ...FriendsSidebarFriendPanelFriend
      ...FriendsSidebarFriendStatusFriendsUser
      ...FriendsSidebarItemExpandedFriend
      ...FriendsSidebarFriendActionsFriendsUser
    }
  `,
  profile: gql`
    fragment FriendsSidebarFriendProfile on ProfileProfile {
      userId
      userTag
      avatars {
        avatar2D
      }
      onlineStatus
      ...FriendsSidebarFriendButtonsProfile
      ...ProfileImageProfile
      ...FriendsSidebarItemExpandedProfile
    }
  `,
};
