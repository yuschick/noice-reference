import { appleAuth } from '@invertase/react-native-apple-authentication';
import { getErrorMessage, makeLoggers } from '@noice-com/utils';
import { AuthConfiguration, authorize } from 'react-native-app-auth';
import Config from 'react-native-config';
import { isEmulator } from 'react-native-device-info';

import { InstrumentationAnalytics } from './InstrumentationAnalytics';

type SignupDiscordProfile = {
  email: string;
};

const discordConfig: AuthConfiguration = {
  clientId: Config.DISCORD_CLIENT_ID,
  redirectUrl: 'com.noice.MobilePlatform://oauth',
  scopes: ['email', 'identify'],
  serviceConfiguration: {
    authorizationEndpoint: 'https://discordapp.com/api/oauth2/authorize',
    tokenEndpoint: 'https://discordapp.com/api/oauth2/token',
    revocationEndpoint: 'https://discordapp.com/api/oauth2/token/revoke',
  },
};

const { logError } = makeLoggers('AppAuth');

// eslint-disable-next-line @typescript-eslint/naming-convention
class _AppAuth {
  public async fetchDiscordProfile(discordToken: string) {
    try {
      return (await (
        await fetch('https://discord.com/api/users/@me', {
          headers: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            Authorization: `Bearer ${discordToken}`,
          },
        })
      ).json()) as SignupDiscordProfile;
    } catch (e) {
      return null;
    }
  }

  public async authWithDiscord() {
    try {
      const authResult = await authorize(discordConfig);

      return authResult;
    } catch (err) {
      const errStr = getErrorMessage(err);
      logError(errStr);
      InstrumentationAnalytics.captureException(new Error(errStr));
    }
  }

  public async authWithApple() {
    try {
      const authResult = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL],
      });

      const updatedAuthResult = { ...authResult };

      // Just return the result if on a simulator, the device check below
      // is only available on real devices
      if (await isEmulator()) {
        return updatedAuthResult;
      }

      const credState = await appleAuth.getCredentialStateForUser(authResult.user);

      if (credState !== appleAuth.State.AUTHORIZED) {
        throw new Error('User is not authenticated.');
      }

      return updatedAuthResult;
    } catch (err) {
      const errStr = getErrorMessage(err);
      logError(errStr);
      InstrumentationAnalytics.captureException(new Error(errStr));
    }
  }
}

export const AppAuth = new _AppAuth();
