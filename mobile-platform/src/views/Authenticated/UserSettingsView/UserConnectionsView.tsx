import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import { useClient } from '@noice-com/common-react-core';
import { getErrorMessage, makeLoggers } from '@noice-com/utils';
import { useState } from 'react';
import { Alert, StyleSheet, TouchableOpacity } from 'react-native';

import { UserSettingsModalSectionText } from './UserSettingsModalSectionText';

import { Gutter } from '@components/Gutter';
import { PageLayout } from '@components/PageLayout';
import { HStack } from '@components/Stack/HStack';
import { Typography } from '@components/Typography';
import { colors } from '@constants/styles';
import { AuthIdentityType, useUserConnectionsViewQuery } from '@gen/graphql';
import { useAuth } from '@hooks/useAuth.hook';
import { useUserExternalAccountDisconnect } from '@hooks/user/useUserExternalAccountDisconnect.hook';
import { AppAuth } from '@lib/AppAuth';
import { IconAssets } from '@utils/icons';

const { logError } = makeLoggers('User settings connections');

gql`
  query userConnectionsView($userId: ID!) {
    profile(userId: $userId) {
      userId
      account {
        uid
        externalIds {
          type
        }
      }
    }
  }
`;

const ACCOUNT_IS_ALREADY_CONNECTED_ERROR =
  'This account is already connected, to another Noice account.';

type ConnectionError = {
  code: number;
};

export const UserConnectionsView = () => {
  const client = useClient();
  const { userId } = useAuth();
  const [disconnectMutation] = useUserExternalAccountDisconnect({});
  const { data, refetch } = useUserConnectionsViewQuery({
    ...variablesOrSkip({
      userId,
    }),
  });
  const [errorMessage, setErrorMessage] = useState<string>();

  const isDiscordConnected = data?.profile?.account?.externalIds?.find(
    ({ type }) => type === AuthIdentityType.IdentityTypeDiscord,
  );
  const isAppleConnected = data?.profile?.account?.externalIds?.find(
    ({ type }) => type === AuthIdentityType.IdentityTypeApple,
  );

  const onConnectDiscord = async () => {
    try {
      const authResult = await AppAuth.authWithDiscord();

      if (!authResult?.accessToken) {
        throw new Error('Failed to authenticate with Discord.');
      }

      await client.AuthService.addDiscordAccount(authResult?.accessToken);
      refetch();
    } catch (err) {
      const errStr = getErrorMessage(err);
      logError(errStr);

      if ((err as ConnectionError)?.code === 2) {
        setErrorMessage(ACCOUNT_IS_ALREADY_CONNECTED_ERROR);
      }
    }
  };

  const onConnectApple = async () => {
    try {
      const authResult = await AppAuth.authWithApple();

      if (!authResult?.identityToken) {
        throw new Error('Failed to authenticate with Apple.');
      }

      await client.AuthService.addAppleAccount(authResult?.identityToken);
      refetch();
    } catch (err) {
      const errStr = getErrorMessage(err);
      logError(errStr);

      if ((err as ConnectionError)?.code === 2) {
        setErrorMessage(ACCOUNT_IS_ALREADY_CONNECTED_ERROR);
      }
    }
  };

  const onDisconnect = async (type: AuthIdentityType) => {
    try {
      await disconnectMutation({
        variables: {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          userId: userId!,
          type,
        },
      });
    } catch (err) {
      const errStr = getErrorMessage(err);
      logError(errStr);
    }
  };

  const getUserConfirmation = (callback: () => void) => {
    Alert.alert(
      'Disconnect account',
      'Are you sure you want to disconnect your account',
      [
        {
          text: 'Yes, Disconnect',
          onPress: callback,
          style: 'destructive',
        },
        {
          text: 'Cancel',
        },
      ],
    );
  };

  const onDisconnectDiscord = () =>
    getUserConfirmation(() => onDisconnect(AuthIdentityType.IdentityTypeDiscord));
  const onDisconnectApple = () =>
    getUserConfirmation(() => onDisconnect(AuthIdentityType.IdentityTypeApple));

  return (
    <PageLayout title="Connections">
      <UserSettingsModalSectionText
        subtitle="Connect your account to Noice"
        title="Accounts"
      />
      <TouchableOpacity
        onPress={isDiscordConnected ? onDisconnectDiscord : onConnectDiscord}
      >
        <HStack
          alignItems="center"
          justifyContent="space-between"
          style={s.row}
        >
          <HStack>
            <IconAssets.Discord
              color="white"
              height={24}
              width={24}
            />
            <Gutter width={12} />
            <Typography
              fontSize="lg"
              fontWeight="bold"
            >
              Discord
            </Typography>
          </HStack>
          {isDiscordConnected ? (
            <Typography color="textSecondary">Disconnect</Typography>
          ) : (
            <Typography color="textSecondary">Connect</Typography>
          )}
        </HStack>
      </TouchableOpacity>
      <Gutter height={8} />
      <TouchableOpacity onPress={isAppleConnected ? onDisconnectApple : onConnectApple}>
        <HStack
          alignItems="center"
          justifyContent="space-between"
          style={s.row}
        >
          <HStack>
            <IconAssets.AppleLogo
              color="white"
              height={24}
              width={24}
            />
            <Gutter width={12} />
            <Typography
              fontSize="lg"
              fontWeight="bold"
            >
              Apple
            </Typography>
          </HStack>
          {isAppleConnected ? (
            <Typography color="textSecondary">Disconnect</Typography>
          ) : (
            <Typography color="textSecondary">Connect</Typography>
          )}
        </HStack>
      </TouchableOpacity>
      <Gutter height={16} />
      {!!errorMessage && (
        <Typography
          color="redMain"
          fontWeight="medium"
          textAlign="center"
        >
          {errorMessage}
        </Typography>
      )}
    </PageLayout>
  );
};

const s = StyleSheet.create({
  row: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: colors.whiteTransparent05,
  },
});
