import { useClient } from '@noice-com/common-react-core';
import {
  AnalyticsEventClientSignupStepSignupMode,
  AnalyticsEventClientSignupStepSignupStep,
} from '@noice-com/schemas/analytics/analytics.pb';
import { EmailStatus, EmailVerificationMode } from '@noice-com/schemas/auth/authv4.pb';
import { getErrorMessage } from '@noice-com/utils';
import { useCallback } from 'react';

import { AuthV4Error, AuthV4ErrorCode } from '../errors';

import { PendingEmailVerification, useAuthFlowState } from './useAuthFlowState.hook';

import { Analytics } from '@lib/Analytics';

const FAILED_TO_VERIFY_EMAIL_ERROR = 'Failed to verify email with captcha.';
const FAILED_WITH_TIMEOUT = 'Verification email request timed out';

type VerificationResult =
  | {
      status: 'error';
      message: string;
    }
  | {
      status: 'no-account';
    }
  | {
      status: 'verified';
    };

/**
 * Verifies the email and sends out the login code to the user
 * incase the account exists, or fails incase the account doesnt exist.
 */
export const useEmailVerification = () => {
  const { pendingSignInData, pendingSignUpData, setPendingSignInData } =
    useAuthFlowState();
  const client = useClient();

  /**
   * Check if the email provided is a valid one for signin
   * up with Noice.
   */
  const isEmailValid = useCallback(
    async (email: string) => {
      try {
        const { captchaToken, appleIdToken } = pendingSignInData ?? {};

        const res = await client.AuthService.verifySignup({
          email,
          captchaToken,
          appleIdToken,
        });

        return res.emailStatus === EmailStatus.EMAIL_STATUS_ACCEPTED;
      } catch {
        return false;
      }
    },
    [client, pendingSignInData],
  );

  const verifyEmailAndSendCode = useCallback(
    async (verificationMode?: EmailVerificationMode): Promise<VerificationResult> => {
      if (!pendingSignInData) {
        return {
          status: 'error',
          message: FAILED_TO_VERIFY_EMAIL_ERROR,
        };
      }

      const email =
        verificationMode === EmailVerificationMode.EMAIL_VERIFICATION_MODE_SIGNIN
          ? pendingSignInData.email
          : pendingSignUpData?.email;

      const { captchaToken } = pendingSignInData;

      if (email === '' || !captchaToken) {
        return {
          status: 'error',
          message: FAILED_TO_VERIFY_EMAIL_ERROR,
        };
      }

      try {
        // Verification times out after 5 seconds
        const timeoutPromise = new Promise((_resolve, reject) => {
          setTimeout(() => {
            reject(new Error(FAILED_WITH_TIMEOUT));
          }, 5000);
        });

        if (!email) {
          throw new Error('Email is required');
        }

        const verifiedEmailToken = await Promise.race([
          client.AuthService.verifyEmail(
            email,
            verificationMode ?? EmailVerificationMode.EMAIL_VERIFICATION_MODE_SIGNIN,
            captchaToken,
          ),
          timeoutPromise,
        ]);

        const emailVerification: PendingEmailVerification = {
          verifiedEmailToken: verifiedEmailToken as string, // on success this is string, on failure we never get this far
          receivedTime: Date.now(),
          tokenSentAt: Date.now(),
        };

        setPendingSignInData({
          email,
          emailVerification,
        });

        Analytics.trackEvent({
          clientSignupStep: {
            captchaTokenExists: !!captchaToken,
            mode: AnalyticsEventClientSignupStepSignupMode.SIGNUP_MODE_SIGNIN,
            step: AnalyticsEventClientSignupStepSignupStep.SIGNUP_STEP_RECAPTCHA,
            verifyEmailTokenExists: !!verifiedEmailToken,
          },
        });

        return {
          status: 'verified',
        };
      } catch (err) {
        if ((err as AuthV4Error)?.code === AuthV4ErrorCode.userNotFound) {
          return {
            status: 'no-account',
          };
        }

        return {
          status: 'error',
          message: getErrorMessage(err),
        };
      }
    },
    [client, pendingSignInData, pendingSignUpData, setPendingSignInData],
  );

  return {
    verifyEmailAndSendCode,
    isEmailValid,
  };
};
