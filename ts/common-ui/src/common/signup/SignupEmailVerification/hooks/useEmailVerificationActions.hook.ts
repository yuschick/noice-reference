import { useApolloClient } from '@apollo/client';
import { useClient } from '@noice-com/common-react-core';
import {
  EmailVerificationMode,
  ErrorDetailsCause,
} from '@noice-com/schemas/auth/authv4.pb';
import { hasPlatformErrorCause } from '@noice-com/utils';
import debounce from 'lodash/debounce';
import { useCallback, useState } from 'react';

import { useSignup } from '../../context';
import { useSignupPlatformSuspension, useSignupStages } from '../../hooks';
import { SignupMode } from '../../types';

import { useAuthentication } from '@common-context';

const USER_ALREADY_EXISTS_ERROR_CODE = 6;

interface HookResult {
  hasErrorWithCode: boolean;
  onResendCodeClick(): void;
  onInputChangeValidationReset(): void;
  onVerifyEmailFormSubmit(code: string): void;
}

export function useEmailVerificationActions(isMobile = false): HookResult {
  const {
    signupData,
    signupMode,
    appendSignupData,
    showError,
    from,
    excludeNewAccountCreation,
  } = useSignup();
  const { cache } = useApolloClient();
  const client = useClient();
  const { userId: temporaryUserId, hasRole } = useAuthentication();
  const handlePlatformSuspension = useSignupPlatformSuspension();
  const { onSignupStagesCompleted } = useSignupStages();

  const [tries, setTries] = useState(1);
  const [showInputError, setShowInputError] = useState(false);

  const onResendCode = useCallback(async () => {
    if (!signupData.email) {
      return;
    }

    try {
      const token = await client.AuthService.verifyEmail(
        signupData.email,
        signupMode === SignupMode.LogIn
          ? EmailVerificationMode.EMAIL_VERIFICATION_MODE_SIGNIN
          : EmailVerificationMode.EMAIL_VERIFICATION_MODE_SIGNUP,
        signupData.verifiedCaptchaToken,
      );

      appendSignupData({
        verifyEmailToken: token,
      });
    } catch (e) {
      showError({
        header: 'Error requesting email verification',
        message: 'Something went wrong while requesting email verification',
      });
    }
  }, [
    appendSignupData,
    client.AuthService,
    showError,
    signupData.email,
    signupData.verifiedCaptchaToken,
    signupMode,
  ]);

  const onResendCodeClick = debounce(onResendCode, 1000, {
    leading: true,
    trailing: false,
  });

  const onLogin = useCallback(
    async (email: string, verifyEmailToken: string, code: string): Promise<boolean> => {
      try {
        const account = await client.passwordlessSignIn({
          email: { email, token: verifyEmailToken, code },
        });

        if (signupData.discordToken) {
          await client.AuthService.addDiscordAccount(signupData.discordToken);
        }

        if (!handlePlatformSuspension(account)) {
          return false;
        }

        if (!account.uid) {
          showError();
          return false;
        }

        onSignupStagesCompleted({ userId: account.uid, signupMode: SignupMode.LogIn });
      } catch (e) {
        return false;
      }

      return true;
    },
    [
      client,
      handlePlatformSuspension,
      onSignupStagesCompleted,
      showError,
      signupData.discordToken,
    ],
  );

  const onSignup = useCallback(
    async (code: string): Promise<boolean> => {
      if (excludeNewAccountCreation) {
        showError();
        return false;
      }

      try {
        const {
          email,
          username,
          dob,
          verifyEmailToken,
          acceptedTerms,
          marketingConsent,
          discordToken,
          appleIdToken,
        } = signupData;

        if (
          !email ||
          !dob ||
          !username ||
          !verifyEmailToken ||
          !acceptedTerms ||
          !marketingConsent
        ) {
          return false;
        }

        if (temporaryUserId && !hasRole('full_user')) {
          await client.completeTemporaryAccount({
            username,
            birthday: dob,
            email,
            acceptedTerms,
            emailVerificationToken: verifyEmailToken,
            emailVerificationCode: code,
            marketingConsent,
            appleIdToken,
            discordToken,
          });

          await client.refreshAccessToken();

          const id = cache.identify({
            __typename: 'ProfileProfile',
            userId: temporaryUserId,
          });
          if (id) {
            cache.evict({ id, broadcast: true });
            cache.gc();
          }

          onSignupStagesCompleted({
            userId: temporaryUserId,
            signupMode: SignupMode.SignUp,
          });

          return true;
        }

        const account = await client.completeAccount({
          username,
          birthday: dob,
          email,
          acceptedTerms,
          emailVerificationToken: verifyEmailToken,
          emailVerificationCode: code,
          marketingConsent,
          appleIdToken,
          discordToken,
          origin: from,
          isMobile,
        });

        if (!account.uid) {
          showError();
          return false;
        }

        onSignupStagesCompleted({ userId: account.uid, signupMode: SignupMode.SignUp });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        if (e?.code === USER_ALREADY_EXISTS_ERROR_CODE) {
          showError({
            header: 'Sorry',
            message: 'Something went wrong while creating your account',
          });
          return false;
        }

        if (hasPlatformErrorCause(e, ErrorDetailsCause.CAUSE_TEMPORARY_THROTTLED)) {
          showError({
            header: 'Something unexpected happened',
            message: 'We encountered an issue while setting up your account',
          });
        }

        return false;
      }

      return true;
    },
    [
      cache,
      client,
      excludeNewAccountCreation,
      from,
      hasRole,
      isMobile,
      onSignupStagesCompleted,
      showError,
      signupData,
      temporaryUserId,
    ],
  );

  const onVerifyEmailFormSubmit = useCallback(
    async (code: string) => {
      if (tries > 9) {
        showError({
          header: 'Too many tries',
          message: "You've entered wrong code too many times",
        });
        return;
      }

      if (!signupData.email || !code || !signupData.verifyEmailToken) {
        showError({
          header: 'Insufficient data',
          message: 'No sufficient data to submit access code',
        });

        setTries((prev) => prev + 1);
        setShowInputError(true);
        return;
      }

      if (signupMode === SignupMode.LogIn) {
        const success = await onLogin(
          signupData.email,
          signupData.verifyEmailToken,
          code,
        );

        if (!success) {
          setTries((prev) => prev + 1);
          setShowInputError(true);
        }

        return;
      }

      if (signupMode === SignupMode.SignUp) {
        const success = await onSignup(code);

        if (!success) {
          setTries((prev) => prev + 1);
          setShowInputError(true);
        }

        return;
      }
    },
    [
      onLogin,
      onSignup,
      showError,
      signupData.email,
      signupData.verifyEmailToken,
      signupMode,
      tries,
    ],
  );

  const onInputChangeValidationReset = useCallback(() => {
    setShowInputError(false);
  }, []);

  return {
    hasErrorWithCode: showInputError,
    onResendCodeClick,
    onInputChangeValidationReset,
    onVerifyEmailFormSubmit,
  };
}
