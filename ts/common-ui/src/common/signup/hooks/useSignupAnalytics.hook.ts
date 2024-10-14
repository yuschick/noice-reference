import { AnalyticsEventClientSignupStepSignupStep } from '@noice-com/schemas/analytics/analytics.pb';
import { useCallback } from 'react';

import { useSignup } from '../context';
import { SignupMode } from '../types';
import { getAnalyticsSignupMode } from '../utils';

interface HookResult {
  sendAnalyticsStepEvent(
    step: AnalyticsEventClientSignupStepSignupStep,
    signupMode?: SignupMode,
  ): void;
  sendExternalAnalyticsStepEvent(
    step: AnalyticsEventClientSignupStepSignupStep,
    signupMode?: SignupMode,
  ): Promise<void>;
  sendSignupCompletedConversionEvent(): void;
}

export function useSignupAnalytics(): HookResult {
  const {
    signupData,
    from,
    signupMode: signupProcessMode,
    signupError,
    trackAnalyticsEvent,
    trackAnalyticsExternalEvent,
    trackConversionEvent,
  } = useSignup();

  const geEventData = useCallback(
    (step: AnalyticsEventClientSignupStepSignupStep, signupMode?: SignupMode) => ({
      clientSignupStep: {
        step,
        from,
        mode: getAnalyticsSignupMode(signupMode ?? signupProcessMode),
        error: signupError?.message,
        discordTokenExists: !!signupData.discordToken,
        verifyEmailTokenExists: !!signupData.verifyEmailToken,
        captchaTokenExists: !!signupData.verifiedCaptchaToken,
      },
    }),
    [
      from,
      signupData.discordToken,
      signupData.verifiedCaptchaToken,
      signupData.verifyEmailToken,
      signupError?.message,
      signupProcessMode,
    ],
  );

  const sendAnalyticsStepEvent = useCallback(
    (step: AnalyticsEventClientSignupStepSignupStep, signupMode?: SignupMode) => {
      trackAnalyticsEvent?.(geEventData(step, signupMode));
    },
    [trackAnalyticsEvent, geEventData],
  );

  const sendExternalAnalyticsStepEvent = useCallback(
    async (step: AnalyticsEventClientSignupStepSignupStep, signupMode?: SignupMode) => {
      await trackAnalyticsExternalEvent?.(geEventData(step, signupMode));
    },
    [trackAnalyticsExternalEvent, geEventData],
  );

  const sendSignupCompletedConversionEvent = useCallback(async () => {
    await trackConversionEvent?.('SignupCompleted');
  }, [trackConversionEvent]);

  return {
    sendAnalyticsStepEvent,
    sendExternalAnalyticsStepEvent,
    sendSignupCompletedConversionEvent,
  };
}
