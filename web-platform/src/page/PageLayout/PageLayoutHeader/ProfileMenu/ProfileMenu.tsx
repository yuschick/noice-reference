import { gql } from '@apollo/client';
import {
  AuthenticatedUserProvider,
  Breakpoint,
  CommonUtils,
  FTUEActionType,
  PopoverMenu,
  ProfileImage,
  useAuthentication,
  useDialog,
  usePopoverMenu,
  useTriggerFTUEAction,
} from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';

import { DebugMenu } from '../DebugMenu';
import { HelpMenuItems } from '../HelpMenu/HelpMenuItems';
import { Notifications } from '../Notifications/Notifications';

import { ChannelButtonSection } from './ChannelButtonSection';
import { HideOnlineStatusSettingSection } from './HideOnlineStatusSettingSection';
import styles from './ProfileMenu.module.css';
import { ProfileMenuLinksSection } from './ProfileMenuLinksSection';
import { ProfileMenuProfileSection } from './ProfileMenuProfileSection';

import { ImplicitAccountSignupButtons } from '@common/implicit-account';
import { Routes } from '@common/route';
import { usePlaySound, AppSoundKeys } from '@common/sound';
import { UserWalletDisplay } from '@common/wallet';
import {
  ChannelChannelRole,
  ProfileMenuProfileFragment,
  useProfileMenuQueryLazyQuery,
} from '@gen';

gql`
  query ProfileMenuQuery($userId: ID!, $isImplicitAccount: Boolean!) {
    profile(userId: $userId) {
      userId
      ...ProfileMenuProfileSectionProfile @skip(if: $isImplicitAccount)
      ...HideOnlineStatusSettingSectionProfile @skip(if: $isImplicitAccount)
      ...ProfileMenuImplicitAccountProfileSectionProfile @include(if: $isImplicitAccount)
      ...ProfileMenuLinksSectionProfile
      ...DebugMenuProfile
      ...ChannelButtonProfile
    }

    userPrivilegedChannels(userId: $userId) @skip(if: $isImplicitAccount) {
      channels {
        channelId
        roles
        channel {
          id
          ...ChannelButtonOwnChannel
        }
      }
    }
  }

  fragment ProfileMenuProfile on ProfileProfile {
    ...ProfileImageShowOnlineStatusProfile
    ...NotificationProfile
  }
`;

interface Props {
  profile: Nullable<ProfileMenuProfileFragment>;
  createChannelDialogStore: ReturnType<typeof useDialog>;
}

export function ProfileMenu({ profile, createChannelDialogStore }: Props) {
  const popover = usePopoverMenu({ placement: 'bottom' });
  const { toggle } = popover.actions;

  const { userId, isImplicitAccount, isFullAccount } = useAuthentication();
  const [playButtonClickConfirmSound] = usePlaySound(AppSoundKeys.ButtonClickConfirm);
  const [playGenericHoverSound] = usePlaySound(AppSoundKeys.GenericHover);
  const triggerFTUEAction = useTriggerFTUEAction();

  // Close panel when link is clicked
  const onLinkClick = toggle;

  const [fetchProfile, { data }] = useProfileMenuQueryLazyQuery();

  const onButtonClick = () => {
    if (userId) {
      fetchProfile({ variables: { userId, isImplicitAccount } });
    }
    playButtonClickConfirmSound();
    toggle();
    triggerFTUEAction(FTUEActionType.PlayerMenuClicked);
  };

  const menuProfile = data?.profile;
  const ownChannel = data?.userPrivilegedChannels?.channels?.find((channel) =>
    channel.roles.includes(ChannelChannelRole.ChannelRoleStreamer),
  )?.channel;

  return (
    <>
      <button
        aria-label="Profile Menu"
        className={styles.profileImageButton}
        data-ftue-anchor="profile-menu"
        ref={popover.state.popoverMenuTriggerRef}
        type="button"
        onClick={onButtonClick}
        onMouseEnter={() => playGenericHoverSound()}
      >
        {!profile || isImplicitAccount ? (
          <ProfileImage.Empty />
        ) : (
          <ProfileImage
            profile={profile}
            showOnlineStatus
          />
        )}
      </button>

      <PopoverMenu store={popover}>
        {!!userId && (
          <PopoverMenu.Section>
            {menuProfile ? (
              <ProfileMenuProfileSection
                isImplicitAccount={isImplicitAccount}
                profile={menuProfile}
              />
            ) : (
              <ProfileMenuProfileSection.Loading />
            )}
          </PopoverMenu.Section>
        )}

        <Breakpoint query={`(max-width: ${CommonUtils.getRem(599)})`}>
          {!isFullAccount && <ImplicitAccountSignupButtons section="profile-menu" />}
        </Breakpoint>

        {isFullAccount && !!userId && (
          <PopoverMenu.Section>
            {menuProfile ? (
              <AuthenticatedUserProvider userId={userId}>
                <HideOnlineStatusSettingSection profile={menuProfile} />
              </AuthenticatedUserProvider>
            ) : (
              <HideOnlineStatusSettingSection.Loading />
            )}
          </PopoverMenu.Section>
        )}

        <Breakpoint query={`(max-width: ${CommonUtils.getRem(1099)})`}>
          <PopoverMenu.Section>
            <UserWalletDisplay />
          </PopoverMenu.Section>
          <PopoverMenu.Divider />
        </Breakpoint>

        <PopoverMenu.Section>
          <ProfileMenuLinksSection
            profile={menuProfile ?? null}
            onLinkClick={onLinkClick}
          />
        </PopoverMenu.Section>

        {isFullAccount && (
          <Breakpoint query={`(max-width: ${CommonUtils.getRem(389)})`}>
            <PopoverMenu.Divider />

            <PopoverMenu.Section>
              <Notifications
                profile={profile}
                renderAsPopoverButton
              />
            </PopoverMenu.Section>
          </Breakpoint>
        )}

        <Breakpoint
          query={`(max-width: ${CommonUtils.getRem(isFullAccount ? 599 : 1099)})`}
        >
          <PopoverMenu.Divider />

          <PopoverMenu.Section>
            <HelpMenuItems />
          </PopoverMenu.Section>
        </Breakpoint>

        <PopoverMenu.Divider />

        <ChannelButtonSection
          createChannelDialogStore={createChannelDialogStore}
          ownChannel={ownChannel ?? null}
          profile={menuProfile ?? null}
          onLinkClick={onLinkClick}
        />

        <Breakpoint
          query={`(max-width: ${CommonUtils.getRem(isFullAccount ? 599 : 1099)})`}
        >
          <PopoverMenu.Divider />

          <PopoverMenu.Section>
            <DebugMenu
              profile={menuProfile ?? null}
              renderAsPopoverButton
            />
          </PopoverMenu.Section>
        </Breakpoint>

        {isFullAccount ? (
          <>
            <PopoverMenu.Divider />

            <PopoverMenu.Section>
              <PopoverMenu.Link
                to={Routes.Logout}
                onClick={onLinkClick}
              >
                Log Out
              </PopoverMenu.Link>
            </PopoverMenu.Section>
          </>
        ) : (
          <PopoverMenu.Section>
            <PopoverMenu.Link
              to="https://legal.noice.com/hc/en-us/articles/14879808972445-Noice-Third-Party-Licenses-Web-Client"
              onClick={onLinkClick}
            >
              Open Source Licenses
            </PopoverMenu.Link>
          </PopoverMenu.Section>
        )}
      </PopoverMenu>
    </>
  );
}
