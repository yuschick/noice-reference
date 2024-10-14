import { useClient } from '@noice-com/common-react-core';
import { CommonUtils, SignupDiscord as SignupDiscordForm } from '@noice-com/common-ui';
import { useCallback } from 'react';
import { useNavigate } from 'react-router';

import { Routes, SettingsRoutes } from '@common/route';

export function SignupDiscord() {
  const client = useClient();
  const navigate = useNavigate();

  const onConnectDiscordToExistingAccount = useCallback(
    async (discordToken: string) => {
      try {
        await CommonUtils.restoreSession(client, '/signup');
        await client.AuthService.addDiscordAccount(discordToken);
        navigate(`${Routes.Settings}/${SettingsRoutes.Connections}`);
      } catch (e) {
        navigate(`${Routes.Settings}/${SettingsRoutes.Connections}`, {
          state: { discordConnectError: e },
        });
      }
    },
    [client, navigate],
  );

  return (
    <SignupDiscordForm
      onConnectDiscordToExistingAccount={onConnectDiscordToExistingAccount}
    />
  );
}
