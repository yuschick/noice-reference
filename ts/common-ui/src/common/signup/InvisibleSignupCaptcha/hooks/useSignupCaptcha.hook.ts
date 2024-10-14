import { useClient } from '@noice-com/common-react-core';
import { EmailVerificationMode } from '@noice-com/schemas/auth/authv4.pb';

import { useSignup } from '../../context';
import { useSignupStages } from '../../hooks';
import { SignupMode, SignupStage } from '../../types';

interface HookResult {
  onVerify: (token: string) => void;
}

export function useSignupCaptcha(): HookResult {
  const {
    showError,
    signupData,
    appendSignupData,
    setSignupMode,
    excludeNewAccountCreation,
  } = useSignup();
  const { updateSignupStage } = useSignupStages();
  const client = useClient();

  const onVerify = async (token: string) => {
    if (!signupData.email) {
      showError();
      return;
    }

    let verifiedCaptchaToken: string | undefined;

    try {
      verifiedCaptchaToken = await client.AuthService.verifyCaptcha(token);

      if (!verifiedCaptchaToken) {
        throw new Error("Couldn't verify captcha token");
      }

      appendSignupData({
        verifiedCaptchaToken,
      });
    } catch (e) {
      showError();
      return;
    }

    try {
      // If we have an appleIdToken at this stage, we are in the process of creating a new account from the Apple SSO so it is technically a signup still
      const token = await client.AuthService.verifyEmail(
        signupData.email,
        signupData.appleIdToken
          ? EmailVerificationMode.EMAIL_VERIFICATION_MODE_SIGNUP
          : EmailVerificationMode.EMAIL_VERIFICATION_MODE_SIGNIN,
        verifiedCaptchaToken,
      );

      appendSignupData({
        verifyEmailToken: token,
      });

      // When we enter this this stage with an appleIdToken, we are in the process of creating a new account from the Apple SSO so it is technically a signup still
      setSignupMode(signupData.appleIdToken ? SignupMode.SignUp : SignupMode.LogIn);
      updateSignupStage(SignupStage.VerifyEmail);
      return;
      // eslint-disable-next-line
    } catch (e: any) {
      if (e?.code === 8) {
        showError({
          header: 'Too many failed tries',
          message: 'Rate limit exceeded, try again later',
        });

        return;
      }

      // eslint-disable-next-line
      if (e?.code === 5) {
        if (excludeNewAccountCreation) {
          showError({
            header: 'Unknown user',
            message: 'Create account on Noice platform to get access to this site',
          });
          return;
        }

        setSignupMode(SignupMode.SignUp);
        updateSignupStage(SignupStage.CompleteAccount);
        return;
      }

      showError({
        header: 'Unknown error',
        message: 'Unexpected error occurred',
      });
    }
  };

  return {
    onVerify,
  };
}
