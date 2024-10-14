import { useClient } from '@noice-com/common-react-core';
import { useAuthentication, useKeyContentLoadMetadata } from '@noice-com/common-ui';
import { AnalyticsEventClientImplicitAccountLoginStep } from '@noice-com/schemas/analytics/analytics.pb';
import { makeLoggers } from '@noice-com/utils';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router';
import { useSearchParams } from 'react-router-dom';

interface HookResult {
  authIsLoading: boolean;
  hasAuthFailed: boolean;
  showImplicitAccountLogin: boolean;
  onCaptchaVerify(token: string): Promise<void>;
  onCaptchaError(): void;
}

const { logError } = makeLoggers('AUTHENTICATION');

const BE_A_ROBOT_SEARCH_PARAM = 'be-a-robot';
// Copied from stackoverflow https://stackoverflow.com/a/39704670
const userAgentBotRedux = /bot|google|baidu|bing|msn|teoma|slurp|yandex/i;

export function useInitAuthenticatedUser(): HookResult {
  const [authIsLoading, setAuthIsLoading] = useState(true);
  const [showImplicitAccountLogin, setShowImplicitAccountLogin] = useState(false);
  const [hasAuthFailed, setHasAuthFailed] = useState(false);

  const [searchParams] = useSearchParams();
  const { isAuthenticated, initialized } = useAuthentication();
  const client = useClient();
  const setKeyContentMetadata = useKeyContentLoadMetadata();
  const location = useLocation();

  const lastStart = useRef(Date.now());

  const sendStepEvent = useCallback(
    (step: AnalyticsEventClientImplicitAccountLoginStep) => {
      const now = Date.now();
      client.AnalyticsService.trackEvent({
        clientImplicitAccountLogin: {
          step,
          durationMs: now - lastStart.current,
        },
      });
      lastStart.current = now;
    },
    [client.AnalyticsService],
  );

  const started = useRef(false);
  useEffect(() => {
    if (started.current) {
      return;
    }

    if (!initialized) {
      return;
    }

    if (isAuthenticated()) {
      setAuthIsLoading(false);
      started.current = true;
      return;
    }

    // If bot flag is set, do not attempt to authenticate
    if (
      searchParams.has(BE_A_ROBOT_SEARCH_PARAM) ||
      userAgentBotRedux.test(navigator.userAgent)
    ) {
      setAuthIsLoading(false);
      setHasAuthFailed(true);
      started.current = true;
      return;
    }

    // If user is not authenticated, start implicit account creation
    sendStepEvent(AnalyticsEventClientImplicitAccountLoginStep.STEP_STARTED);
    setShowImplicitAccountLogin(true);
    setAuthIsLoading(false);
    started.current = true;
  }, [initialized, isAuthenticated, searchParams, sendStepEvent]);

  const onCaptchaVerify = useCallback(
    async (token: string) => {
      sendStepEvent(AnalyticsEventClientImplicitAccountLoginStep.STEP_CAPTCHA_DONE);

      try {
        setKeyContentMetadata('implicit_account_login', 'true');

        let captchaToken: string;
        try {
          captchaToken = await client.AuthService.verifyCaptcha(token);
          sendStepEvent(
            AnalyticsEventClientImplicitAccountLoginStep.STEP_TOKEN_VERIFICATION_DONE,
          );
        } catch (e) {
          sendStepEvent(
            AnalyticsEventClientImplicitAccountLoginStep.STEP_TOKEN_VERIFICATION_FAILED,
          );
          throw e;
        }

        try {
          await client.createTemporaryAccount({
            captchaToken,
            origin: location.pathname,
          });
          sendStepEvent(
            AnalyticsEventClientImplicitAccountLoginStep.STEP_ACCOUNT_CREATION_DONE,
          );
        } catch (e) {
          sendStepEvent(
            AnalyticsEventClientImplicitAccountLoginStep.STEP_ACCOUNT_CREATION_FAILED,
          );
          throw e;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        const msg = 'message' in e ? e.message : 'Unknown error';
        setKeyContentMetadata('implicit_account_login_error', msg);

        logError('Failed to create temporary account', e);
        setHasAuthFailed(true);
        setAuthIsLoading(false);
        client.AnalyticsService.trackEvent({
          clientImplicitAccountLoginFailed: {
            error: msg,
          },
        });
      }

      setShowImplicitAccountLogin(false);
    },
    [sendStepEvent, setKeyContentMetadata, client, location.pathname],
  );

  const onCaptchaError = useCallback(() => {
    setShowImplicitAccountLogin(false);
    setHasAuthFailed(true);
    setAuthIsLoading(false);
    sendStepEvent(AnalyticsEventClientImplicitAccountLoginStep.STEP_CAPTCHA_FAILED);
  }, [setShowImplicitAccountLogin, sendStepEvent]);

  return {
    authIsLoading,
    hasAuthFailed,
    showImplicitAccountLogin,
    onCaptchaVerify,
    onCaptchaError,
  };
}
