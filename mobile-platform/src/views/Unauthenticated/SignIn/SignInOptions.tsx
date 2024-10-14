import { useClient } from '@noice-com/common-react-core';
import { AnalyticsEventClientSignupStepSignupStep } from '@noice-com/schemas/analytics/analytics.pb';
import { SessionTokenMode } from '@noice-com/schemas/auth/auth.pb';
import { getErrorMessage, makeLoggers } from '@noice-com/utils';
import { jwtDecode } from 'jwt-decode';
import { useCallback, useState } from 'react';

import { AuthV4Error, AuthV4ErrorCode } from '../errors';
import { PendingSignInData, useAuthFlowState } from '../hooks/useAuthFlowState.hook';

import { ButtonLarge } from '@components/ButtonLarge';
import { Divider } from '@components/Divider';
import { Gutter } from '@components/Gutter';
import { VStack } from '@components/Stack/VStack';
import { Typography } from '@components/Typography';
import { Analytics } from '@lib/Analytics';
import { AppAuth } from '@lib/AppAuth';
import { InstrumentationAnalytics } from '@lib/InstrumentationAnalytics';
import { IconAssets } from '@utils/icons';

const { logError } = makeLoggers('SignInWithOptions');

const FAILED_TO_AUTHENTICATE_ERROR = 'Failed to authenticate.';

type Props = {
  navigateToSignup: (skipCaptcha?: boolean) => void;
  navigateToConnectAccount: (email: string) => void;
};

export const SignInOptions = ({ navigateToSignup, navigateToConnectAccount }: Props) => {
  const client = useClient();
  const [errorMessage, setErrorMessage] = useState<string>();
  const { setPendingSignInData, clearAllPendingData } = useAuthFlowState();

  const handleNoAccount = useCallback(
    (authData: PendingSignInData) => {
      setPendingSignInData(authData);
      const skipCaptcha = !!authData.appleIdToken;
      navigateToSignup(skipCaptcha);
    },
    [navigateToSignup, setPendingSignInData],
  );

  // Incase returned email from SSO already is tied to an existing user
  // We need to navigate to prompt the user to either connect accounts or sign in.
  const handleAccountExists = useCallback(
    (email: string) => {
      navigateToConnectAccount(email);
    },
    [navigateToConnectAccount],
  );

  const onAuthWithDiscord = async () => {
    Analytics.trackEvent({
      clientSignupStep: {
        step: AnalyticsEventClientSignupStepSignupStep.SIGNUP_STEP_DISCORD_CLICK,
      },
    });

    // Start by clearing any existing data
    clearAllPendingData();

    const authResult = await AppAuth.authWithDiscord();

    if (!authResult) {
      setErrorMessage(FAILED_TO_AUTHENTICATE_ERROR);
      return;
    }

    try {
      await client.passwordlessSignIn({
        discordToken: authResult.accessToken,
        sessionTokenMode: SessionTokenMode.SESSION_TOKEN_MODE_RESPONSE,
      });
    } catch (err) {
      const errStr = getErrorMessage(err);

      if ((err as AuthV4Error)?.code === AuthV4ErrorCode.userNotFound) {
        const profile = await AppAuth.fetchDiscordProfile(authResult.accessToken);

        if (!profile) {
          logError('Failed to fetch Discord profile');
          setErrorMessage(FAILED_TO_AUTHENTICATE_ERROR);
          return;
        }

        handleNoAccount({
          discordToken: authResult.accessToken,
          email: profile.email,
        });
        return;
      }

      if ((err as AuthV4Error)?.code === AuthV4ErrorCode.userAlreadyExists) {
        const profile = await AppAuth.fetchDiscordProfile(authResult.accessToken);

        if (!profile) {
          logError('Failed to fetch Discord profile');
          setErrorMessage(FAILED_TO_AUTHENTICATE_ERROR);
          return;
        }

        setPendingSignInData({
          discordToken: authResult.accessToken,
          email: profile.email,
        });
        handleAccountExists(profile.email);
        return;
      }

      logError(errStr);
      setErrorMessage(FAILED_TO_AUTHENTICATE_ERROR);
    }
  };

  const onAuthWithApple = async () => {
    Analytics.trackEvent({
      clientSignupStep: {
        step: AnalyticsEventClientSignupStepSignupStep.SIGNUP_STEP_APPLE_CLICK,
      },
    });

    clearAllPendingData();

    const authResult = await AppAuth.authWithApple();

    if (!authResult || !authResult?.identityToken) {
      throw new Error('Failed to authenticate with Apple SSO');
    }

    // note: we extract the email from the jwt token here due to the fact
    // that the email is only returned on first login attempt and not in subsequent ones.
    const decodedToken = jwtDecode<{ email?: string }>(authResult.identityToken);
    const extractedEmail = decodedToken?.email;

    if (!authResult || !authResult.identityToken) {
      setErrorMessage(FAILED_TO_AUTHENTICATE_ERROR);
      return;
    }

    try {
      await client.passwordlessSignIn({
        appleIdToken: authResult.identityToken,
        sessionTokenMode: SessionTokenMode.SESSION_TOKEN_MODE_RESPONSE,
      });
    } catch (err) {
      const errStr = getErrorMessage(err);

      if ((err as AuthV4Error)?.code === AuthV4ErrorCode.userNotFound) {
        handleNoAccount({
          appleIdToken: authResult.identityToken,
          email: extractedEmail ?? '',
        });
        return;
      }

      // NO_OP should not happen but adding analytics trace incase I'm incorrect about this.
      if ((err as AuthV4Error)?.code === AuthV4ErrorCode.userAlreadyExists) {
        InstrumentationAnalytics.captureException(
          new Error('Failed to authenticate with Apple SSO, user already exists.'),
        );
      }

      logError(errStr);
      setErrorMessage(FAILED_TO_AUTHENTICATE_ERROR);
    }
  };

  return (
    <VStack>
      <Divider label="or" />
      <Gutter height={24} />
      <ButtonLarge
        analyticsActionName="AUTH_WITH_DISCORD"
        iconElement={
          <IconAssets.Discord
            color="white"
            height={24}
            width={24}
          />
        }
        upperCase={false}
        onPress={onAuthWithDiscord}
      >
        Continue with Discord
      </ButtonLarge>
      <Gutter height={8} />
      <ButtonLarge
        analyticsActionName="AUTH_WITH_APPLE"
        iconElement={
          <IconAssets.AppleLogo
            color="white"
            height={24}
            width={24}
          />
        }
        upperCase={false}
        onPress={onAuthWithApple}
      >
        Continue with Apple
      </ButtonLarge>
      {!!errorMessage && (
        <>
          <Gutter height={8} />
          <Typography
            color="red400"
            fontWeight="medium"
            textAlign="center"
          >
            {errorMessage}
          </Typography>
        </>
      )}
    </VStack>
  );
};
