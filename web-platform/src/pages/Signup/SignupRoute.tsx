import { useMountEffect } from '@noice-com/common-react-core';
import {
  InvisibleSignupCaptcha,
  NoiceLogo,
  SignupAccountExists,
  SignupCompleteAccount,
  SignupError,
  SignupProvider,
  SignupRoutes,
  SignupStage,
  useAnalytics,
  useConversionEvents,
} from '@noice-com/common-ui';
import { CSSProperties } from 'react';
import { Helmet } from 'react-helmet-async';
import { Route, Routes } from 'react-router';

import { useSignupStagesCompletedAccountCheck, useSignupRoute } from './hooks';
import { SignupMethod, SignupDiscord, SignupPlatformEmailVerification } from './pages';
import styles from './SignupRoute.module.css';

import background from '@assets/images/background-stream.webp';
import characters from '@assets/images/noice-hero-characters.webp';
import { useCookiesConsentSignupAnalytics } from '@common/analytics';
import {
  ACCOUNT_SUSPENSION_PATH,
  Routes as AppRoutes,
  SignupSubRoutes,
} from '@common/route';

const DISCORD_REDIRECT_URL = `${window.location.protocol}//${window.location.host}${AppRoutes.Signup}/${SignupSubRoutes.Discord}`;

const signupRoutes: SignupRoutes = {
  [SignupStage.CompleteAccount]: `${AppRoutes.Signup}/${SignupSubRoutes.CompleteAccount}`,
  [SignupStage.VerifyEmail]: `${AppRoutes.Signup}/${SignupSubRoutes.VerifyEmail}`,
  [SignupStage.AccountExists]: `${AppRoutes.Signup}/${SignupSubRoutes.AccountExists}`,
  [SignupStage.Completed]: AppRoutes.Home,
  signupRootRoute: AppRoutes.Signup,
  errorRoute: `${AppRoutes.Signup}/${SignupSubRoutes.Error}`,
  suspensionRoute: ACCOUNT_SUSPENSION_PATH,
};

export function SignupRoute() {
  useSignupRoute();
  const { trackEvent, trackExternalEvent } = useAnalytics();
  const { sendBasicConversionEvent } = useConversionEvents();
  const checkIsAccountCompletedWithRedirect = useSignupStagesCompletedAccountCheck();
  const {
    trackCookiesConsentWasShownBeforeSignup,
    handleCookiesConsentChangeOnSignupEvent,
  } = useCookiesConsentSignupAnalytics();

  useMountEffect(() => {
    if (window.wasCookiesConsentShown) {
      trackCookiesConsentWasShownBeforeSignup();
    }

    window.addEventListener('UC_SDK_EVENT', handleCookiesConsentChangeOnSignupEvent);

    return () => {
      window.removeEventListener('UC_SDK_EVENT', handleCookiesConsentChangeOnSignupEvent);
    };
  });

  return (
    <>
      <Helmet>
        <title>Signup</title>
      </Helmet>

      <SignupProvider
        appleRedirectUrl={NOICE.APPLE_REDIRECT_URI}
        captchaSiteKey={window.NOICE.HCAPTCHA_SITE_KEY}
        checkIsAccountCompletedWithRedirect={checkIsAccountCompletedWithRedirect}
        discordClientId={window.NOICE.DISCORD_CLIENT_ID}
        discordRedirectUrl={DISCORD_REDIRECT_URL}
        routes={signupRoutes}
        trackAnalyticsEvent={trackEvent}
        trackAnalyticsExternalEvent={trackExternalEvent}
        trackConversionEvent={sendBasicConversionEvent}
      >
        <InvisibleSignupCaptcha />

        <Routes>
          <Route
            element={
              <div
                className={styles.signupLoginBackground}
                style={
                  {
                    '--background': `url(${background})`,
                    '--characters': `url(${characters})`,
                  } as CSSProperties
                }
              >
                <div className={styles.betaLogo}>
                  <NoiceLogo
                    className={styles.signupLogo}
                    theme="light"
                    variant="horizontal"
                  />

                  <NoiceLogo
                    className={styles.smallScreenLogo}
                    theme="spectrum"
                    variant="mark"
                  />

                  <span className={styles.betaPill}>Open Beta</span>
                </div>
                <Routes>
                  <Route
                    element={<SignupError />}
                    path={SignupSubRoutes.Error}
                  />
                  <Route
                    element={<SignupCompleteAccount />}
                    path={SignupSubRoutes.CompleteAccount}
                  />
                  <Route
                    element={<SignupPlatformEmailVerification />}
                    path={SignupSubRoutes.VerifyEmail}
                  />
                  <Route
                    element={<SignupDiscord />}
                    path={SignupSubRoutes.Discord}
                  />
                  <Route
                    element={<SignupAccountExists />}
                    path={SignupSubRoutes.AccountExists}
                  />
                  <Route
                    element={<SignupMethod />}
                    index
                  />
                </Routes>
              </div>
            }
            path="*"
          />
        </Routes>
      </SignupProvider>
    </>
  );
}
