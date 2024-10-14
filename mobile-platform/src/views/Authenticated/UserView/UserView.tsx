import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import { useClient } from '@noice-com/common-react-core';

import { Avatar } from '@components/Avatar';
import { ButtonLarge } from '@components/ButtonLarge';
import { CurrencyInfoRow } from '@components/CurrencyInfoRow';
import { Gutter } from '@components/Gutter';
import { PageLayout } from '@components/PageLayout';
import { ToggleButtonRow } from '@components/Toggle/ToggleRow';
import { UserHeaderRow } from '@components/UserHeaderRow';
import { ProfilePresenceStatus, useUserViewQuery } from '@gen/graphql';
import { useOnlineStatus } from '@hooks/privacy/useOnlineStatus.hook';
import { useAuth } from '@hooks/useAuth.hook';
import { AuthenticatedScreenProps } from '@navigators/routes';

gql`
  query UserView($userId: ID!) {
    profile(userId: $userId) {
      userId
      userTag
      onlineStatus
      ...UserHeaderRow
      ...AvatarView
    }
  }

  ${UserHeaderRow.fragment}
  ${Avatar.fragments.profile}
`;

export const UserView = ({ navigation }: AuthenticatedScreenProps<'user'>) => {
  const { userId } = useAuth();
  const client = useClient();
  const { data } = useUserViewQuery({
    ...variablesOrSkip({ userId: userId }),
  });

  const { toggleHideOnlineStatus, hideOnlineStatus } = useOnlineStatus();
  const profile = data?.profile;

  const logOut = () => {
    client.clearSession();
  };

  const openProfile = () => {
    if (userId) {
      navigation.push('profile', {
        userId: userId,
      });
    }
  };

  const openSettings = () => {
    navigation.push('userSettings');
  };

  const username = profile?.userTag;

  return (
    <PageLayout
      headerBottomRowElement={
        <Avatar
          isOnline={profile?.onlineStatus === ProfilePresenceStatus.PresenceStatusOnline}
          profile={data?.profile}
          size="small"
          isOwnProfile
        />
      }
      title={username}
    >
      <Gutter height={32} />
      <CurrencyInfoRow />
      <Gutter height={24} />
      <ToggleButtonRow
        enabled={!hideOnlineStatus}
        text="Show online status"
        onToggle={toggleHideOnlineStatus}
      />
      <Gutter height={24} />
      <ButtonLarge.List>
        <ButtonLarge
          backgroundColor="violet600"
          onPress={openProfile}
        >
          Profile Page
        </ButtonLarge>
        <ButtonLarge
          backgroundColor="violet600"
          onPress={openSettings}
        >
          Settings
        </ButtonLarge>
      </ButtonLarge.List>
      <Gutter height={24} />
      <ButtonLarge
        backgroundColor="violet600"
        rounded={false}
        textAlign="left"
        onPress={logOut}
      >
        Log out
      </ButtonLarge>
    </PageLayout>
  );
};
