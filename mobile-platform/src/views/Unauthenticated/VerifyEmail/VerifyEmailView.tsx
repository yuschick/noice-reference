import {
  AnalyticsEventClientSignupStepSignupMode,
  AnalyticsEventClientSignupStepSignupStep,
} from '@noice-com/schemas/analytics/analytics.pb';
import { EmailVerificationMode } from '@noice-com/schemas/auth/authv4.pb';
import { makeLoggers } from '@noice-com/utils';
import { useCallback } from 'react';

import { useAuthFlowState } from '../hooks/useAuthFlowState.hook';
import { useEmailVerification } from '../hooks/useEmailVerification.hook';

import { useAsyncEffect } from '@hooks/useAsyncEffect.hook';
import { Analytics } from '@lib/Analytics';
import { UnAuthenticatedScreenProps } from '@navigators/routes';

const { logError } = makeLoggers('VerifyEmailView');

export const VerifyEmailView = ({
  navigation,
}: UnAuthenticatedScreenProps<'verify-email'>) => {
  const { verifyEmailAndSendCode } = useEmailVerification();
  const { pendingSignUpData } = useAuthFlowState();

  const verify = useCallback(async () => {
    try {
      const verificationMode = !pendingSignUpData
        ? EmailVerificationMode.EMAIL_VERIFICATION_MODE_SIGNIN
        : EmailVerificationMode.EMAIL_VERIFICATION_MODE_SIGNUP;

      Analytics.trackEvent({
        clientSignupStep: {
          mode: pendingSignUpData
            ? AnalyticsEventClientSignupStepSignupMode.SIGNUP_MODE_SIGNUP
            : AnalyticsEventClientSignupStepSignupMode.SIGNUP_MODE_SIGNIN,
          step: AnalyticsEventClientSignupStepSignupStep.SIGNUP_STEP_EMAIL_VERIFICATION,
        },
      });

      const res = await verifyEmailAndSendCode(verificationMode);

      navigation.popToTop();
      if (res.status === 'verified') {
        navigation.navigate('email-login-code');
        return;
      }

      if (res.status === 'no-account') {
        navigation.navigate('complete-account');
        return;
      }

      if (res.status === 'error') {
        navigation.navigate('sign-in', { externalErrorMessage: res.message });
        return;
      }
    } catch (err) {
      logError(err);
      navigation.navigate('sign-in', {
        externalErrorMessage: 'Something went wrong, please try again.',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useAsyncEffect(verify);

  return <></>;
};
