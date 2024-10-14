import { useMountEffect } from '@noice-com/common-react-core';
import { useAnalytics, useConversionEvents } from '@noice-com/common-ui';
import {
  AnalyticsEventClientSignupStepSignupMode,
  AnalyticsEventClientSignupStepSignupStep,
} from '@noice-com/schemas/analytics/analytics.pb';
import { useCallback } from 'react';

interface HookResult {
  sendSelectAvatarEvent(avatarId: string): void;
  sendViewAvatarEvent(avatarId: string): void;
}

export function useAvatarSelectorAnalytics(): HookResult {
  const { trackEvent } = useAnalytics();
  const { sendBasicConversionEvent } = useConversionEvents();

  useMountEffect(() => {
    trackEvent({
      clientSignupStep: {
        step: AnalyticsEventClientSignupStepSignupStep.SIGNUP_STEP_AVATAR_SELECT,
        mode: AnalyticsEventClientSignupStepSignupMode.SIGNUP_MODE_SIGNUP,
      },
    });
  });

  const sendSelectAvatarEvent = useCallback(
    (avatarId: string) => {
      trackEvent({
        clientSignupStep: {
          step: AnalyticsEventClientSignupStepSignupStep.SIGNUP_STEP_COMPLETED,
          mode: AnalyticsEventClientSignupStepSignupMode.SIGNUP_MODE_SIGNUP,
        },
      });
      sendBasicConversionEvent('SignupCompleted');
      trackEvent({
        clientAvatarSelectorAvatarSelected: {
          avatarId,
        },
      });
    },
    [sendBasicConversionEvent, trackEvent],
  );

  const sendViewAvatarEvent = useCallback(
    (avatarId: string) => {
      trackEvent({
        clientAvatarSelectorAvatarViewed: {
          avatarId,
        },
      });
    },
    [trackEvent],
  );

  return {
    sendSelectAvatarEvent,
    sendViewAvatarEvent,
  };
}
