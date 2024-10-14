import { useClient } from '@noice-com/common-react-core';
import {
  useAuthentication,
  FullscreenSpinner,
  useKeyContentLoadTracker,
  useKeyContentLoadMetadata,
  AuthenticatedUserProvider,
} from '@noice-com/common-ui';
import { AnalyticsEventClientImplicitAccountLoginStep } from '@noice-com/schemas/analytics/analytics.pb';
import { makeLoggers } from '@noice-com/utils';
import { ReactElement, useCallback, useEffect, useRef, useState } from 'react';
import { Navigate, RouteProps, useLocation } from 'react-router-dom';

import { Routes } from '../types';

import { HiddenCaptcha } from '@common/auth';

// Prevent circular dependency

const { log, logError } = makeLoggers('AUTHENTICATION');

export function AuthenticatedRoute({ children }: RouteProps): ReactElement | null {
  const { isAuthenticated, initialized, userId } = useAuthentication();
  const location = useLocation();

  const client = useClient();

  const [isLoading, setIsLoading] = useState(true);

  const [showImplicitAccountLogin, setShowImplicitAccountLogin] = useState(false);

  const setKeyContentMetadata = useKeyContentLoadMetadata();

  useKeyContentLoadTracker('authenticated_route_account', isLoading);
  useKeyContentLoadTracker('implicit_account_login', showImplicitAccountLogin);

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

  useEffect(() => {
    if (!initialized) {
      return;
    }

    if (isAuthenticated()) {
      setIsLoading(false);
      return;
    }

    // If user is not authenticated, start implicit account creation
    sendStepEvent(AnalyticsEventClientImplicitAccountLoginStep.STEP_STARTED);
    setShowImplicitAccountLogin(true);
    setIsLoading(false);
  }, [initialized, isAuthenticated, sendStepEvent]);

  const onVerify = useCallback(
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
        client.AnalyticsService.trackEvent({
          clientImplicitAccountLoginFailed: {
            error: msg,
          },
        });
      }

      // If success, user sees children, if fails, user is navigated to signup page
      setShowImplicitAccountLogin(false);
    },
    [sendStepEvent, setKeyContentMetadata, client, location.pathname],
  );

  const onError = useCallback(() => {
    setShowImplicitAccountLogin(false);
    sendStepEvent(AnalyticsEventClientImplicitAccountLoginStep.STEP_CAPTCHA_FAILED);
  }, [setShowImplicitAccountLogin, sendStepEvent]);

  if (isLoading) {
    return <FullscreenSpinner />;
  }

  if (isAuthenticated() && userId) {
    return (
      <AuthenticatedUserProvider userId={userId}>{children}</AuthenticatedUserProvider>
    );
  }

  if (showImplicitAccountLogin) {
    return (
      <>
        <FullscreenSpinner />
        <HiddenCaptcha
          onError={onError}
          onVerify={onVerify}
        />
      </>
    );
  }

  log('Player trying to go somewhere without authenticating. Redirecting to login');

  return (
    <Navigate
      to={{
        pathname: Routes.Signup,
        search: `from=${location.pathname}${encodeURIComponent(location.search)}`,
      }}
    />
  );
}
