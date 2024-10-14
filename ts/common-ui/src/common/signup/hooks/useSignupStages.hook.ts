import { AnalyticsEventClientSignupStepSignupStep } from '@noice-com/schemas/analytics/analytics.pb';
import { useCallback } from 'react';
import { NavigateOptions, useNavigate } from 'react-router-dom';

import { useSignup } from '../context';
import { SignupMode, SignupStage, SignupStagesCompletedOptions } from '../types';

import { useSignupAnalytics } from './useSignupAnalytics.hook';

interface HookResult {
  updateSignupStage(stage: SignupStage): void;
  onSignupStagesCompleted(options: SignupStagesCompletedOptions): void;
}

export function useSignupStages(): HookResult {
  const navigate = useNavigate();
  const { from, checkIsAccountCompletedWithRedirect, routes, showError } = useSignup();
  const { sendAnalyticsStepEvent, sendSignupCompletedConversionEvent } =
    useSignupAnalytics();

  const redirectToStage = useCallback(
    (stage: SignupStage, state?: NavigateOptions['state']) => {
      navigate(routes[stage], { replace: true, state });
    },
    [navigate, routes],
  );

  const updateSignupStage = useCallback(
    (stage: SignupStage) => {
      redirectToStage(stage);
    },
    [redirectToStage],
  );

  const onSignupStagesCompleted = useCallback(
    async (options: SignupStagesCompletedOptions) => {
      // If account is not completed, the function will redirect to the correct place
      if (checkIsAccountCompletedWithRedirect) {
        try {
          const isAccountCompleted = await checkIsAccountCompletedWithRedirect({
            ...options,
            target: options.target ?? from,
          });

          if (!isAccountCompleted) {
            return;
          }
        } catch (error) {
          showError();
          return;
        }
      }

      const { target, signupMode } = options;

      // Set signup completed and redirect to target or completed stage
      sendAnalyticsStepEvent(
        AnalyticsEventClientSignupStepSignupStep.SIGNUP_STEP_COMPLETED,
        signupMode,
      );

      if (signupMode === SignupMode.SignUp) {
        sendSignupCompletedConversionEvent();
      }

      navigate(target ?? from ?? routes[SignupStage.Completed], {
        replace: true,
        state: { loggedIn: true },
      });
    },
    [
      checkIsAccountCompletedWithRedirect,
      from,
      navigate,
      routes,
      sendAnalyticsStepEvent,
      sendSignupCompletedConversionEvent,
      showError,
    ],
  );

  return {
    updateSignupStage,
    onSignupStagesCompleted,
  };
}
