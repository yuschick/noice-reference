import HCaptcha from '@hcaptcha/react-hcaptcha';
import { AnalyticsEventClientSignupStepSignupStep } from '@noice-com/schemas/analytics/analytics.pb';

import { useSignup } from '../context';
import { useSignupAnalytics } from '../hooks';

import { useSignupCaptcha } from './hooks';

export const InvisibleSignupCaptcha = () => {
  const {
    captchaSiteKey,
    captchaRef,
    signupData: { verifiedCaptchaToken },
    showError,
  } = useSignup();
  const { sendAnalyticsStepEvent } = useSignupAnalytics();
  const { onVerify: onVerifyToken } = useSignupCaptcha();

  if (verifiedCaptchaToken) {
    return null;
  }

  const onOpen = () => {
    sendAnalyticsStepEvent(
      AnalyticsEventClientSignupStepSignupStep.SIGNUP_STEP_INVISIBLE_CAPTHA_CHALLENGE_OPEN,
    );
  };

  const onClose = () => {
    sendAnalyticsStepEvent(
      AnalyticsEventClientSignupStepSignupStep.SIGNUP_STEP_INVISIBLE_CAPTHA_CHALLENGE_DISMISS,
    );
  };

  const onChalExpired = () => {
    sendAnalyticsStepEvent(
      AnalyticsEventClientSignupStepSignupStep.SIGNUP_STEP_INVISIBLE_CAPTHA_CHALLENGE_EXPIRED,
    );
  };

  const onVerify = (token: string) => {
    sendAnalyticsStepEvent(
      AnalyticsEventClientSignupStepSignupStep.SIGNUP_STEP_INVISIBLE_CAPTHA_VERIFIED,
    );
    onVerifyToken(token);
  };

  const onError = () => {
    sendAnalyticsStepEvent(
      AnalyticsEventClientSignupStepSignupStep.SIGNUP_STEP_INVISIBLE_CAPTHA_ERROR,
    );
    showError({
      header: 'Error in Captcha',
      message: 'Please try again',
    });
  };

  return (
    <HCaptcha
      ref={captchaRef}
      sitekey={captchaSiteKey}
      size="invisible"
      onChalExpired={onChalExpired}
      onClose={onClose}
      onError={onError}
      onExpire={onError}
      onOpen={onOpen}
      onVerify={onVerify}
    />
  );
};
