import { useClient, useMountEffect } from '@noice-com/common-react-core';
import { AnalyticsEventClientSignupStepSignupStep } from '@noice-com/schemas/analytics/analytics.pb';
import { useRef } from 'react';

import { useSignup } from '../context';
import {
  useSignupAnalytics,
  useSignupPlatformSuspension,
  useSignupStages,
} from '../hooks';
import { SignupChannel } from '../SignupChannel';
import { SignupContent } from '../SignupContent';
import { SignupDiscordFragment, SignupMode, SignupStage } from '../types';
import { fetchDiscordProfile, getDiscordStateFromFragment } from '../utils';

import { getUrlFragment } from '@common-utils';

interface Props {
  onConnectDiscordToExistingAccount?(discordToken: string): void;
}

export function SignupDiscord({ onConnectDiscordToExistingAccount }: Props) {
  const {
    showError,
    setFrom,
    setSignupMode,
    initSignupProcess,
    excludeNewAccountCreation,
    channel,
    executeCaptcha,
  } = useSignup();
  const { sendAnalyticsStepEvent } = useSignupAnalytics();
  const { onSignupStagesCompleted, updateSignupStage } = useSignupStages();
  const handlePlatformSuspension = useSignupPlatformSuspension();
  const client = useClient();

  const run = useRef<boolean>(false);

  useMountEffect(() => {
    if (run.current) {
      return;
    }

    run.current = true;

    const onToken = async () => {
      const fragment = getUrlFragment<SignupDiscordFragment>(location.hash);
      const error = fragment.error;
      const discordToken = fragment.access_token;

      // If there is an error or no token, show an error message
      if (error || !discordToken) {
        if (error === 'access_denied') {
          showError({
            header: 'Discord error',
            message: 'Access to Discord denied',
          });

          return;
        }

        showError({
          header: 'Discord error',
          message: 'Unknown Discord error during authorization',
        });

        return;
      }

      const state = getDiscordStateFromFragment(fragment);

      // If there is no state, show an error message
      if (!state) {
        showError({
          header: 'Discord authentication error',
          message: 'Error in data received from Discord',
        });
        return;
      }

      // If the state action is connect, add the discord account to the user
      if (state.action === 'connect') {
        onConnectDiscordToExistingAccount?.(discordToken);
        return;
      }

      // If the state action is signup, continue with the signup process
      try {
        // Try to login with discord
        const account = await client.passwordlessSignIn({ discordToken });
        setFrom(state.from);

        if (!handlePlatformSuspension(account)) {
          return;
        }

        if (!account.uid) {
          showError({
            header: 'Error logging in',
            message:
              'There was an error when trying to log in with discord, please try again.',
          });
          return;
        }

        setSignupMode(SignupMode.LogIn);
        sendAnalyticsStepEvent(
          AnalyticsEventClientSignupStepSignupStep.SIGNUP_STEP_DISCORD,
          SignupMode.LogIn,
        );
        onSignupStagesCompleted({
          userId: account.uid,
          target: state.from,
          signupMode: SignupMode.LogIn,
        });
      } catch (e) {
        // If login fails, it is new user
        if (excludeNewAccountCreation) {
          showError({
            header: 'Unknown user',
            message: 'Create account on Noice platform to get access to this site',
          });
          return;
        }

        const profile = await fetchDiscordProfile(discordToken);

        if (!profile) {
          showError({
            header: 'Error logging in',
            message:
              'There was an error when trying to log in with discord, please try again.',
          });
          return;
        }

        initSignupProcess(profile.email, { discordToken });

        setSignupMode(SignupMode.SignUp);
        setFrom(state.from);

        // If the user is already registered without discord connection,
        // redirect to account exists
        // eslint-disable-next-line
        if ((e as any)?.code === 6) {
          setSignupMode(SignupMode.LogIn);
          updateSignupStage(SignupStage.AccountExists);
          return;
        }

        sendAnalyticsStepEvent(
          AnalyticsEventClientSignupStepSignupStep.SIGNUP_STEP_DISCORD,
          SignupMode.SignUp,
        );

        executeCaptcha();
      }
    };
    onToken();
  });

  return (
    <SignupContent>
      {channel && (
        <SignupContent.Header>
          <SignupChannel channel={channel} />
        </SignupContent.Header>
      )}

      <SignupContent.Main>
        <SignupContent.Description>
          Processing Discord log in...
        </SignupContent.Description>
      </SignupContent.Main>
    </SignupContent>
  );
}
