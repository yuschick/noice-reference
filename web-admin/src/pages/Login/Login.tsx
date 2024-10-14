import {
  SignupDiscord,
  SignupMethod,
  NoiceLogo,
  SignupContent,
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

import { LoginSubRoutes, LoginRoutes } from '@common/route';

const DISCORD_REDIRECT_URL = `${window.location.origin}${LoginRoutes.LogIn}/${LoginSubRoutes.Discord}`;

const signupRoutes: SignupRoutes = {
  signupRootRoute: LoginRoutes.LogIn,
  errorRoute: `${LoginRoutes.LogIn}/${LoginSubRoutes.Error}`,
  suspensionRoute: LoginRoutes.LogOut,
  [SignupStage.CompleteAccount]: '',
  [SignupStage.VerifyEmail]: `${LoginRoutes.LogIn}/${LoginSubRoutes.VerifyEmail}`,
  [SignupStage.AccountExists]: '',
  [SignupStage.Completed]: '/',
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
        <title>Login</title>
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
            element={
              <SignupContent>
                <SignupContent.Main>
                  <SignupMethod />
                </SignupContent.Main>
              </SignupContent>
            }
            path="*"
          />
        </Routes>
      </div>

      <InvisibleSignupCaptcha />
    </SignupProvider>
  );
};
