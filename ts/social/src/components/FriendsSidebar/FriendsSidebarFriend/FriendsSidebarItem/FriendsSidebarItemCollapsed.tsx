import { ProfileImage, Tooltip } from '@noice-com/common-ui';
import { ButtonHTMLAttributes, forwardRef } from 'react';

import { FriendsSidebarFriendStatus } from '../FriendsSidebarFriendStatus/FriendsSidebarFriendStatus';

import styles from './FriendsSidebarItemCollapsed.module.css';

import { FriendsSidebarFriendFragment } from '@social-gen';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  disableTooltip?: boolean;
  friend: FriendsSidebarFriendFragment;
}

export const FriendsSidebarItemCollapsed = forwardRef<HTMLButtonElement, Props>(
  function FriendsSidebarItemCollapsed(
    { disableTooltip, friend, ...htmlAttributes },
    externalRef,
  ) {
    return (
      <Tooltip
        content={
          <>
            <span className={styles.friendTooltipName}>{friend.profile.userTag}</span>
            <FriendsSidebarFriendStatus friendsUser={friend} />
          </>
        }
        forceState={disableTooltip ? 'hide' : undefined}
        placement="left"
        triggerRef={externalRef ?? undefined}
      >
        <button
          aria-label={friend.profile.userTag}
          className={styles.friendsSidebarItemCollapsed}
          ref={externalRef}
          {...htmlAttributes}
        >
          <ProfileImage
            profile={friend.profile}
            showOnlineStatus
          />
        </button>
      </Tooltip>
    );
  },
);
