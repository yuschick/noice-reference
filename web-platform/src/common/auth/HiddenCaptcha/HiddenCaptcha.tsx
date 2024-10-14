import HCaptcha from '@hcaptcha/react-hcaptcha';
import {
  useAnalytics,
  useLazyValue,
  useKeyContentLoadMetadata,
} from '@noice-com/common-ui';
import { AnalyticsEventClientGuestCreationInvisibleCaptchaGuestCreationInvisibleCaptchaStep } from '@noice-com/schemas/analytics/analytics.pb';
import { useRef } from 'react';

interface Props {
  onVerify(token: string): void;
  onError(): void;
}

export function HiddenCaptcha({ onVerify: onVerifyProp, onError: onErrorProp }: Props) {
  const { trackEvent } = useAnalytics();
  const captchaRef = useRef<HCaptcha>(null);
  const startTime = useLazyValue(() => Date.now());
  const setKeyContentMetadata = useKeyContentLoadMetadata();

  const trackGuestCreationInvisibleCaptchaStep = (
    step: AnalyticsEventClientGuestCreationInvisibleCaptchaGuestCreationInvisibleCaptchaStep,
  ) => {
    trackEvent({
      clientGuestCreationInvisibleCaptcha: {
        step,
        durationMs: Date.now() - startTime,
      },
    });
  };

  const onLoad = () => {
    captchaRef.current?.execute();

    trackGuestCreationInvisibleCaptchaStep(
      AnalyticsEventClientGuestCreationInvisibleCaptchaGuestCreationInvisibleCaptchaStep.GUEST_CREATION_INVISIBLE_CAPTCHA_STEP_EXECUTE,
    );
    setKeyContentMetadata('captch_execute', 'true');
  };

  const onOpen = () => {
    trackGuestCreationInvisibleCaptchaStep(
      AnalyticsEventClientGuestCreationInvisibleCaptchaGuestCreationInvisibleCaptchaStep.GUEST_CREATION_INVISIBLE_CAPTCHA_STEP_CHALLENGE_OPEN,
    );
  };

  const onClose = () => {
    trackGuestCreationInvisibleCaptchaStep(
      AnalyticsEventClientGuestCreationInvisibleCaptchaGuestCreationInvisibleCaptchaStep.GUEST_CREATION_INVISIBLE_CAPTCHA_STEP_CHALLENGE_DISMISS,
    );
  };

  const onChalExpired = () => {
    trackGuestCreationInvisibleCaptchaStep(
      AnalyticsEventClientGuestCreationInvisibleCaptchaGuestCreationInvisibleCaptchaStep.GUEST_CREATION_INVISIBLE_CAPTCHA_STEP_CHALLENGE_EXPIRED,
    );
  };

  const onVerify = (token: string) => {
    trackGuestCreationInvisibleCaptchaStep(
      AnalyticsEventClientGuestCreationInvisibleCaptchaGuestCreationInvisibleCaptchaStep.GUEST_CREATION_INVISIBLE_CAPTCHA_STEP_VERIFIED,
    );
    setKeyContentMetadata('captch_verified', 'true');
    onVerifyProp(token);
  };

  const onError = () => {
    trackGuestCreationInvisibleCaptchaStep(
      AnalyticsEventClientGuestCreationInvisibleCaptchaGuestCreationInvisibleCaptchaStep.GUEST_CREATION_INVISIBLE_CAPTCHA_STEP_ERROR,
    );
    setKeyContentMetadata('captch_error', 'true');
    onErrorProp();
  };

  return (
    <HCaptcha
      ref={captchaRef}
      sitekey={NOICE.HCAPTCHA_SITE_KEY}
      size="invisible"
      onChalExpired={onChalExpired}
      onClose={onClose}
      onError={onError}
      onExpire={onError}
      onLoad={onLoad}
      onOpen={onOpen}
      onVerify={onVerify}
    />
  );
}
