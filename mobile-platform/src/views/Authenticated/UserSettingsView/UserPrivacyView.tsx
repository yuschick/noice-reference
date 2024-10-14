import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';

import { UserSettingsModalSectionText } from './UserSettingsModalSectionText';

import { ButtonLarge } from '@components/ButtonLarge';
import { Gutter } from '@components/Gutter';
import { ListButton } from '@components/ListButton';
import { PageLayout } from '@components/PageLayout';
import { ToggleButtonRow } from '@components/Toggle/ToggleRow';
import { ProfilePrivacySettingsVisibility, useUserBlockedViewQuery } from '@gen/graphql';
import { useAllowFriendRequests } from '@hooks/privacy/useAllowFriendRequests.hook';
import { useOnlineStatus } from '@hooks/privacy/useOnlineStatus.hook';
import { usePrivacyVisibility } from '@hooks/privacy/usePrivacyVisibility';
import { useShowContentWarning } from '@hooks/privacy/useShowMatureContentWarning.hook';
import { useAuth } from '@hooks/useAuth.hook';
import { AdNetwork } from '@lib/AdNetwork';
import { MarketingTracking } from '@lib/MarketingTracking';
import { UserConsent } from '@lib/UserConsent';
import { AuthenticatedScreenProps } from '@navigators/routes';
import { pluralize } from '@utils/strings';

gql`
  query UserPrivacyView($userId: ID!) {
    profile(userId: $userId) {
      userId
      account {
        externalIds {
          id
          type
        }
      }
    }

    blockedUsers(userId: $userId) {
      users {
        userId
      }
    }
  }
`;

gql`
  query ProfilePrivacySettings($userId: ID) {
    profile(userId: $userId) {
      userId
      account {
        matureRatedContentAllowed
      }
      settings {
        privacy {
          hideOnlineStatus
          visibility
          discordUsernameVisibility
          showMatureContentWarning
        }
        friends {
          disableFriendRequests
        }
      }
    }
  }
`;

export const UserPrivacyView = ({
  navigation,
}: AuthenticatedScreenProps<'userPrivacy'>) => {
  const { userId } = useAuth();
  const { toggleHideOnlineStatus, hideOnlineStatus } = useOnlineStatus();
  const { toggleAllowFriendRequest, isFriendRequestsDisabled } = useAllowFriendRequests();
  const { toggleShowContentWarning, showMatureContentWarning } = useShowContentWarning();
  const {
    changeVisibility,
    discordIsVisibleToEveryone,
    discordIsVisibleToFriends,
    isDiscordConnected,
    profileIsVisibleToEveryone,
    profileIsVisibleToFriends,
  } = usePrivacyVisibility();

  const navigateToBlocked = () => {
    navigation.navigate('userBlocked');
  };

  const openConsentPreferences = async () => {
    const state = await UserConsent.showUserConsentView();

    await AdNetwork.setNetworkConsent(state?.ironSource ?? false);
    MarketingTracking.enable(state?.singular ?? false, userId ?? 'unknown_user');

    // @todo ... handle other consent statuses here in the future if needed.
  };

  const { data: { blockedUsers } = {} } = useUserBlockedViewQuery({
    ...variablesOrSkip({ userId }),
  });
  const blockedUsersLength = blockedUsers?.users?.length ?? 0;

  return (
    <PageLayout title="Privacy">
      <Gutter height={16} />
      {/* Online status */}
      <UserSettingsModalSectionText
        subtitle="Online status"
        title="Who can see if you're online?"
      />
      <ToggleButtonRow
        enabled={!hideOnlineStatus}
        text="Everyone"
        onToggle={toggleHideOnlineStatus}
      />
      <Gutter height={32} />

      {/* Friend requests */}
      <UserSettingsModalSectionText
        subtitle="Can others send you a friend request?"
        title="Friend requests"
      />
      <ToggleButtonRow
        enabled={!isFriendRequestsDisabled}
        text="Allow friend requests"
        onToggle={toggleAllowFriendRequest}
      />
      <Gutter height={32} />

      {/* Profile page visibility */}
      <UserSettingsModalSectionText
        subtitle="Who can see your profile page?"
        title="Profile page"
      />
      <ToggleButtonRow
        enabled={profileIsVisibleToEveryone}
        text="Everyone"
        onToggle={() => {
          changeVisibility(ProfilePrivacySettingsVisibility.VisibilityAll, 'profile');
        }}
      />
      <Gutter height={8} />
      <ToggleButtonRow
        enabled={profileIsVisibleToFriends}
        text="Friends"
        onToggle={() => {
          changeVisibility(ProfilePrivacySettingsVisibility.VisibilityFriends, 'profile');
        }}
      />
      <Gutter height={32} />

      {/* Discord visiblity */}
      {isDiscordConnected && (
        <>
          <UserSettingsModalSectionText
            subtitle="Who can see your Discord username?"
            title="Discord username"
          />
          <ToggleButtonRow
            enabled={discordIsVisibleToEveryone}
            text="Everyone"
            onToggle={() => {
              changeVisibility(
                ProfilePrivacySettingsVisibility.VisibilityAll,
                'discord-id',
              );
            }}
          />
          <Gutter height={8} />
          <ToggleButtonRow
            enabled={discordIsVisibleToFriends}
            text="Friends"
            onToggle={() => {
              changeVisibility(
                ProfilePrivacySettingsVisibility.VisibilityFriends,
                'discord-id',
              );
            }}
          />
          <Gutter height={32} />
        </>
      )}

      {/* Content warning */}
      <UserSettingsModalSectionText
        subtitle="Do you want to receive a warning message before entering a channel with mature or positively sensitive content?"
        title="Content Warnings"
      />
      <ToggleButtonRow
        enabled={showMatureContentWarning}
        text="Always shows warning message"
        onToggle={toggleShowContentWarning}
      />
      <Gutter height={32} />

      {/* Cookies preferences */}
      <UserSettingsModalSectionText
        subtitle="Manage and control your consent "
        title="Cookies Preferences"
      />
      <ListButton
        label="Manage consent preferences"
        onPress={openConsentPreferences}
      />
      <Gutter height={32} />

      {/* Blocked users */}
      <UserSettingsModalSectionText
        subtitle={`Blocking a user will:

• Prevent them from seeing your profile
• Prevent both of you from seeing each other in chat or leaderboard
• Prevent them from being in the same team or party as you`}
        title="Blocked users"
      />
      <Gutter height={16} />
      <ButtonLarge
        rounded={false}
        textAlign="left"
        onPress={navigateToBlocked}
      >
        {blockedUsersLength > 0
          ? `${blockedUsersLength} blocked ${pluralize(
              blockedUsersLength,
              'user',
              'users',
            )}`
          : '0 users currently blocked'}
      </ButtonLarge>
    </PageLayout>
  );
};
