import { gql } from '@apollo/client';
import { CoreAssets } from '@noice-com/assets-core';
import { useClient } from '@noice-com/common-react-core';
import {
  appleAuthOptions,
  useAuthenticatedUser,
  useConfirmDialog,
  ConfirmDialog,
  Icon,
  getDiscordAuthorizeUrl,
  encodeDiscordState,
} from '@noice-com/common-ui';
import { Nullable, makeLoggers } from '@noice-com/utils';
import { useMemo, useState } from 'react';
import { useScript, appleAuthHelpers } from 'react-apple-signin-auth';
import { FaApple, FaDiscord } from 'react-icons/fa';
import { useLocation } from 'react-router';

import { SettingsGroup } from '../SettingsGroup';

import styles from './Connections.module.css';
import { ConnectionSettingItem } from './ConnectionSettingItem/ConnectionSettingItem';
import { useDeleteOAuth2ConsentMutation, useExternalDisconnectMutation } from './hooks';
import { AccountConnection, DialogConnection, ExternalAccountLabel } from './types';

import { Routes, SignupSubRoutes } from '@common/route';
import { useFeatureFlag } from '@context';
import { AuthIdentityType, useSettingsConnectionsDataQuery } from '@gen';

gql`
  query SettingsConnectionsData($userId: ID!) {
    profile(userId: $userId) {
      userId
      discordUsername
      account {
        externalIds {
          type
        }
      }
    }

    oauth2Consent(clientId: "nightbot", userId: $userId) {
      clientId
      scopes
    }
  }
`;

const { logError } = makeLoggers('Settings - Connections');

const getDiscordConnectionErrorMessage = (error: unknown & { code?: number }) => {
  if (error?.code === 6) {
    return 'The Discord account is already connected to another Noice account';
  }

  return 'Connection failed';
};

export function Connections() {
  useScript(appleAuthHelpers.APPLE_SCRIPT_SRC);

  const [oAuthAppleEnabled] = useFeatureFlag('oAuthApple');
  const location = useLocation();
  const { userId } = useAuthenticatedUser();
  const client = useClient();

  const [dialogConnection, setDialogConnection] =
    useState<Nullable<DialogConnection>>(null);

  const { data, refetch: refetchConnectionsData } = useSettingsConnectionsDataQuery({
    variables: { userId },
  });

  const [disconnect] = useExternalDisconnectMutation({});

  const [disconnectOauth2Consent] = useDeleteOAuth2ConsentMutation({});

  const onDiscordConnect = () => {
    const state = encodeDiscordState({
      check: 'noice',
      action: 'connect',
    });

    if (!state) {
      return;
    }

    const { location } = window;
    const redirectUrl = `${location.protocol}//${location.host}${Routes.Signup}/${SignupSubRoutes.Discord}`;

    const discordAuthorizeUrl = getDiscordAuthorizeUrl(
      window.NOICE.DISCORD_CLIENT_ID,
      redirectUrl,
      state,
    );

    window.location.href = discordAuthorizeUrl;
  };

  const handleDisconnect = async (type: AuthIdentityType) => {
    await disconnect({
      variables: { userId, type },
    });
  };

  const handleAppleConnect = async () => {
    const response = await appleAuthHelpers.signIn({
      authOptions: {
        ...appleAuthOptions.authOptions,
        redirectURI: NOICE.APPLE_REDIRECT_URI,
      },
    });

    const appleIdToken = response?.authorization.id_token;

    if (appleIdToken) {
      try {
        await client.AuthService.addAppleAccount(appleIdToken);
        await refetchConnectionsData();
      } catch (error) {
        logError('AuthService.addAppleAccount failed');
      }
    } else {
      logError('Apple account connection failed');
    }

    connectionStore.actions.close();
  };

  const handleConfirm = ({ account, action }: DialogConnection) => {
    if (account === ExternalAccountLabel.Apple && action === 'connect') {
      return handleAppleConnect();
    }

    if (account === ExternalAccountLabel.Discord && action === 'connect') {
      return onDiscordConnect();
    }

    if (account === ExternalAccountLabel.NightBot && action === 'disconnect') {
      return disconnectOauth2Consent({
        variables: {
          userId,
          clientId: 'nightbot',
        },
      });
    }

    if (account === ExternalAccountLabel.Apple && action === 'disconnect') {
      return handleDisconnect(AuthIdentityType.IdentityTypeApple);
    }

    if (account === ExternalAccountLabel.Discord && action === 'disconnect') {
      return handleDisconnect(AuthIdentityType.IdentityTypeDiscord);
    }
  };

  const connectionStore = useConfirmDialog({
    description:
      dialogConnection?.action === 'connect'
        ? `Are you sure you want to connect your ${dialogConnection.account} account?`
        : `Are you sure you want to disconnect your ${dialogConnection?.account} account?`,
    title:
      dialogConnection?.action === 'connect' ? 'Connect Account' : 'Disconnect Account',
    onCancel: () => false,
    onConfirm: dialogConnection ? () => handleConfirm(dialogConnection) : () => false,
    onClose: () => setDialogConnection(null),
  });

  const connectionsData: AccountConnection[] = [
    {
      label: ExternalAccountLabel.Apple,
      icon: FaApple,
      color: '#000000',
      connected: !!data?.profile?.account?.externalIds.some(
        ({ type }) => type === AuthIdentityType.IdentityTypeApple,
      ),
    },
    {
      label: ExternalAccountLabel.Discord,
      icon: FaDiscord,
      color: '#7289DA',
      connected: !!data?.profile?.account?.externalIds.some(
        ({ type }) => type === AuthIdentityType.IdentityTypeDiscord,
      ),
    },
  ];

  const otherConnectionsData: AccountConnection[] = useMemo(() => {
    const connections: AccountConnection[] = [];

    if (data?.oauth2Consent?.scopes.length) {
      connections.push({
        label: ExternalAccountLabel.NightBot,
        connected: true,
      });
    }

    return connections;
  }, [data?.oauth2Consent?.scopes.length]);

  if (!oAuthAppleEnabled) {
    connectionsData.shift();
  }

  return (
    <>
      <SettingsGroup
        description="Connect your accounts to Noice"
        title="Accounts"
      >
        {connectionsData.map((connection) => (
          <ConnectionSettingItem
            connection={connection}
            key={connection.label}
            onClick={(dialogConnection) => {
              setDialogConnection(dialogConnection);
              connectionStore.actions.open();
            }}
          />
        ))}
      </SettingsGroup>

      <div>
        {location.state?.discordConnectError && (
          <div className={styles.connectionError}>
            <Icon
              icon={CoreAssets.Icons.SignupError}
              size={20}
            />
            <span>
              {getDiscordConnectionErrorMessage(location.state.discordConnectError)}
            </span>
          </div>
        )}
      </div>

      {!!otherConnectionsData.length && (
        <SettingsGroup
          description="You have granted permission for these apps to use your Noice account"
          title="Other connections"
        >
          {otherConnectionsData.map((connection) => (
            <ConnectionSettingItem
              connection={connection}
              key={connection.label}
              onClick={(dialogConnection) => {
                setDialogConnection(dialogConnection);
                connectionStore.actions.open();
              }}
            />
          ))}
        </SettingsGroup>
      )}

      <ConfirmDialog store={connectionStore} />
    </>
  );
}
