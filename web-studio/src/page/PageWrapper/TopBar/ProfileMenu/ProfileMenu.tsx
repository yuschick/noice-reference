import { gql } from '@apollo/client';
import {
  PopoverMenu,
  ProfileImage,
  useAuthenticatedUser,
  usePlaySound,
  usePopoverMenu,
} from '@noice-com/common-ui';
import { SocialSoundKeys } from '@noice-com/social';
import { useCallback } from 'react';

import { DebugMenu } from '../DebugMenu';
import { HelpMenuItems } from '../HelpMenu/HelpMenuItems';

import styles from './ProfileMenu.module.css';

import { Routes } from '@common/route';
import { useProfileMenuQueryQuery } from '@gen';

gql`
  query ProfileMenuQuery($userId: ID!) {
    profile(userId: $userId) {
      userId
      lastSeen
      userTag
      avatars {
        avatar2D
      }
      ...ProfileImageShowOnlineStatusProfile
    }

    userPrivilegedChannels(userId: $userId) {
      channels {
        channelId
        roles
        channel {
          id
          name
        }
      }
    }
  }
`;

export function ProfileMenu() {
  const popover = usePopoverMenu({ placement: 'bottom' });
  const { toggle } = popover.actions;

  const { userId } = useAuthenticatedUser();
  const [playButtonClickConfirmSound] = usePlaySound(SocialSoundKeys.ButtonClickConfirm);
  const [playGenericHoverSound] = usePlaySound(SocialSoundKeys.GenericHover);

  const onButtonClick = useCallback(() => {
    playButtonClickConfirmSound();
    toggle();
  }, [playButtonClickConfirmSound, toggle]);

  const onMouseEnter = useCallback(() => {
    playGenericHoverSound();
  }, [playGenericHoverSound]);

  // Close panel when link is clicked
  const onLinkClick = toggle;

  const { data } = useProfileMenuQueryQuery({
    variables: {
      userId,
    },
  });

  const profile = data?.profile;

  if (!profile) {
    return null;
  }

  return (
    <>
      <button
        aria-label="Profile Menu"
        className={styles.profileImageButton}
        data-ftue-anchor="profile-menu"
        ref={popover.state.popoverMenuTriggerRef}
        type="button"
        onClick={onButtonClick}
        onMouseEnter={onMouseEnter}
      >
        <ProfileImage
          profile={profile}
          showOnlineStatus
        />
      </button>

      <PopoverMenu store={popover}>
        <PopoverMenu.Section>
          <section className={styles.popoverMenuHeaderWrapper}>
            <ProfileImage
              profile={profile}
              showOnlineStatus
            />
            <span className={styles.name}>{profile.userTag}</span>
          </section>
        </PopoverMenu.Section>

        <PopoverMenu.Section>
          <PopoverMenu.Link to={NOICE.PLATFORM_URL}>Noice Platform</PopoverMenu.Link>
        </PopoverMenu.Section>

        <PopoverMenu.Divider />

        <div className={styles.responsiveTopBarMenuOption}>
          <PopoverMenu.Section>
            <HelpMenuItems />
          </PopoverMenu.Section>
        </div>

        <PopoverMenu.Section>
          <PopoverMenu.Link to="https://legal.noice.com/hc/en-us/articles/14879887930525-Noice-Third-Party-Licenses-Studio">
            Open Source Licenses
          </PopoverMenu.Link>

          <div className={styles.responsiveTopBarMenuOption}>
            <DebugMenu
              popoverAnchorRef={popover.state.popoverMenuTriggerRef}
              renderAsPopoverButton
            />
          </div>
        </PopoverMenu.Section>

        <PopoverMenu.Divider />

        <PopoverMenu.Section>
          <PopoverMenu.Link
            to={Routes.LogOut}
            onClick={onLinkClick}
          >
            Log Out
          </PopoverMenu.Link>
        </PopoverMenu.Section>
      </PopoverMenu>
    </>
  );
}
