import {
  SignupDiscord,
  NoiceLogo,
  SignupError,
  SignupEmailVerification,
  SignupProvider,
  SignupRoutes,
  SignupStage,
  InvisibleSignupCaptcha,
} from '@noice-com/common-ui';
import { Helmet } from 'react-helmet-async';
import { Route, Routes } from 'react-router';

import { useLoginSounds } from './hooks/useLoginSounds.hook';
import styles from './Login.module.css';
import { SignupMethod } from './SignupMethod/SignupMethod';

import { LoginSubRoutes, Routes as AppRoutes } from '@common/route';

const DISCORD_REDIRECT_URL = `${window.location.protocol}//${window.location.host}${AppRoutes.LogIn}/${LoginSubRoutes.Discord}`;

const signupRoutes: SignupRoutes = {
  signupRootRoute: AppRoutes.LogIn,
  errorRoute: `${AppRoutes.LogIn}/${LoginSubRoutes.Error}`,
  suspensionRoute: AppRoutes.Suspended,
  [SignupStage.CompleteAccount]: '',
  [SignupStage.VerifyEmail]: `${AppRoutes.LogIn}/${LoginSubRoutes.VerifyEmail}`,
  [SignupStage.AccountExists]: '',
  [SignupStage.Completed]: AppRoutes.StreamManager,
};

export const Login = () => {
  useLoginSounds();

  return (
    <SignupProvider
      appleRedirectUrl={NOICE.APPLE_REDIRECT_URI}
      captchaSiteKey={window.NOICE.HCAPTCHA_SITE_KEY}
      discordClientId={window.NOICE.DISCORD_CLIENT_ID}
      discordRedirectUrl={DISCORD_REDIRECT_URL}
      routes={signupRoutes}
      excludeNewAccountCreation
    >
      <Helmet>
        <title>Login to Noice Studio</title>
      </Helmet>

      <div className={styles.signupLoginBackground}>
        <NoiceLogo
          className={styles.signupLogo}
          theme="light"
          variant="horizontal"
        />
        <Routes>
          <Route
            element={<SignupError />}
            path={LoginSubRoutes.Error}
          />
          <Route
            element={<SignupEmailVerification />}
            path={LoginSubRoutes.VerifyEmail}
          />
          <Route
            element={<SignupDiscord />}
            path={LoginSubRoutes.Discord}
          />
          <Route
            element={<SignupMethod />}
            path="*"
          />
        </Routes>
      </div>

      <InvisibleSignupCaptcha />
    </SignupProvider>
  );
};
