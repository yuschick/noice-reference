import { useClient } from '@noice-com/common-react-core';
import { useLocation } from 'react-router';

import { useSignup } from '@common-common/signup/context';
import {
  useSignupPlatformSuspension,
  useSignupStages,
} from '@common-common/signup/hooks';
import { SignupMode, SignupStage } from '@common-common/signup/types';

type AppleSigninSuccessResponse = {
  authorization: {
    code: string;
    /* eslint-disable-next-line @typescript-eslint/naming-convention */
    id_token: string;
  };
};

interface UseAppleSignupResult {
  handleSuccess: (response: AppleSigninSuccessResponse) => Promise<void>;
}

export function useAppleSignup(): UseAppleSignupResult {
  const handlePlatformSuspension = useSignupPlatformSuspension();
  const location = useLocation();
  const { onSignupStagesCompleted, updateSignupStage } = useSignupStages();
  const client = useClient();
  const {
    appendSignupData,
    excludeNewAccountCreation,
    setFrom,
    setSignupMode,
    showError,
  } = useSignup();

  const handleSuccess = async (response: AppleSigninSuccessResponse) => {
    const appleIdToken = response.authorization.id_token;
    appendSignupData({ appleIdToken });

    try {
      // If the Apple account is linked to a Noice account, log in
      const account = await client.passwordlessSignIn({ appleIdToken });
      setFrom(location.state?.from);

      if (!handlePlatformSuspension(account)) {
        return;
      }

      if (!account.uid) {
        showError({
          header: 'Error logging in',
          message:
            'There was an error when trying to log in with Apple, please try again.',
        });
        return;
      }

      setSignupMode(SignupMode.LogIn);
      onSignupStagesCompleted({
        userId: account.uid,
        target: location.state?.from,
        signupMode: SignupMode.LogIn,
      });
    } catch (error) {
      if (excludeNewAccountCreation) {
        showError({
          header: 'Error with Apple authentication',
          message: 'Could not authentication with Apple at this time. Please try again',
        });
        return;
      }

      setSignupMode(SignupMode.SignUp);
      setFrom(location.state?.from);
      updateSignupStage(SignupStage.CompleteAccount);
    }
  };

  return { handleSuccess };
}
