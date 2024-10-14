import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';

import { ButtonLarge } from '@components/ButtonLarge';
import { Gutter } from '@components/Gutter';
import { PageLayout } from '@components/PageLayout';
import { Typography } from '@components/Typography';
import { AuthPlatformRole, useUserSettingsViewQuery } from '@gen/graphql';
import { useAuth } from '@hooks/useAuth.hook';
import { AuthenticatedScreenProps } from '@navigators/routes';

gql`
  query UserSettingsView($userId: ID!) {
    profile(userId: $userId) {
      userId
      account {
        roles
      }
    }
  }
`;

export const UserSettingsView = ({
  navigation,
}: AuthenticatedScreenProps<'userSettings'>) => {
  const { userId } = useAuth();

  const { data } = useUserSettingsViewQuery({
    ...variablesOrSkip({ userId }),
  });

  const isAdmin = !!data?.profile?.account?.roles.find(
    (role) => role === AuthPlatformRole.PlatformRoleAdmin,
  );

  const openProfileInfo = () => {
    navigation.navigate('userProfileInfo');
  };

  const openAccount = () => {
    navigation.navigate('userAccount');
  };

  const openPrivacy = () => {
    navigation.navigate('userPrivacy');
  };

  const openConnections = () => {
    navigation.navigate('userConnections');
  };

  const openDeveloper = () => {
    navigation.navigate('userDeveloper');
  };

  const openSubscriptions = () => {
    navigation.push('subscriptions');
  };

  const openHelpAndLegal = () => {
    navigation.push('helpAndLegal');
  };

  const openAboutApp = () => {
    navigation.push('aboutApp');
  };

  return (
    <PageLayout title="Settings">
      <Gutter height={16} />

      <Gutter height={24} />
      <ButtonLarge.List>
        <ButtonLarge
          backgroundColor="violet600"
          onPress={openProfileInfo}
        >
          Profile info
        </ButtonLarge>
        <ButtonLarge
          backgroundColor="violet600"
          onPress={openAccount}
        >
          Account
        </ButtonLarge>
        <ButtonLarge
          backgroundColor="violet600"
          onPress={openPrivacy}
        >
          Privacy
        </ButtonLarge>
        <ButtonLarge
          backgroundColor="violet600"
          onPress={openConnections}
        >
          Connections
        </ButtonLarge>
        <ButtonLarge
          backgroundColor="violet600"
          onPress={openSubscriptions}
        >
          Subscriptions
        </ButtonLarge>
      </ButtonLarge.List>

      {isAdmin && (
        <>
          <Gutter height={16} />
          <ButtonLarge
            backgroundColor="violet600"
            rounded={false}
            textAlign="left"
            onPress={openDeveloper}
          >
            Developer
          </ButtonLarge>
        </>
      )}

      <Gutter height={24} />

      <ButtonLarge.List>
        <ButtonLarge
          backgroundColor="violet600"
          onPress={openHelpAndLegal}
        >
          Help and legal
        </ButtonLarge>
        <ButtonLarge
          backgroundColor="violet600"
          onPress={openAboutApp}
        >
          About app
        </ButtonLarge>
      </ButtonLarge.List>

      <Gutter height={24} />
      <Typography
        color="textLightSecondary"
        fontSize="sm"
        textAlign="center"
      >
        © 2024 by Noice, Inc. and its subsidiaries. Noice® and Play The Stream® are
        registered trademarks of Noice, Inc. US patent no 12015806.
      </Typography>
    </PageLayout>
  );
};
