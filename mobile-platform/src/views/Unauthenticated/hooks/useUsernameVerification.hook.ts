import { useClient } from '@noice-com/common-react-core';
import { UsernameStatus } from '@noice-com/schemas/profile/profile.pb';
import { getErrorMessage } from '@noice-com/utils';
import { useState } from 'react';

import { useAuthFlowState } from './useAuthFlowState.hook';

enum ExtendedUsernameErrorStatus {
  PatternInvalid = 'PATTERN_INVALID',
  CaptchaInvalid = 'INVALID_CAPTCHA',
}

const getUserStatusErrorMessage = (
  error: UsernameStatus | ExtendedUsernameErrorStatus,
) => {
  if (error === UsernameStatus.USERNAME_STATUS_GUIDELINES_VIOLATION) {
    return 'Please choose a different user tag and make sure it complies with our community guidelines.';
  }

  if (error === UsernameStatus.USERNAME_STATUS_RESERVED) {
    return 'This username has been reserved';
  }

  if (error === ExtendedUsernameErrorStatus.PatternInvalid) {
    return 'Username can only contain letters, numbers and underscores';
  }

  if (error === ExtendedUsernameErrorStatus.CaptchaInvalid) {
    return 'The provided captcha is no longer valid.';
  }

  return 'Please pick another username';
};

const usernameValidPattern = /^[a-zA-Z0-9_-]{3,30}$/;

export const useUsernameVerification = () => {
  const client = useClient();
  const { pendingSignInData } = useAuthFlowState();
  const [usernameError, setUsernameError] = useState<string>();

  const { captchaToken, appleIdToken } = pendingSignInData ?? {};

  const isUsernameValid = async (username: string) => {
    const isUsernamePatternValid = usernameValidPattern.test(username);

    if (!isUsernamePatternValid) {
      setUsernameError(
        getUserStatusErrorMessage(ExtendedUsernameErrorStatus.PatternInvalid),
      );
      return false;
    }

    try {
      const verificationRes = await client.AuthService.verifySignup({
        captchaToken,
        appleIdToken,
        username,
      });

      if (verificationRes.usernameStatus !== UsernameStatus.USERNAME_STATUS_OK) {
        setUsernameError(
          getUserStatusErrorMessage(
            verificationRes.usernameStatus ?? UsernameStatus.USERNAME_STATUS_UNSPECIFIED,
          ),
        );
        return false;
      }

      return true;
    } catch (err) {
      const errorStr = getErrorMessage(err);
      if (errorStr === 'invalid captcha token') {
        setUsernameError(
          getUserStatusErrorMessage(ExtendedUsernameErrorStatus.CaptchaInvalid),
        );
        return false;
      }

      setUsernameError(
        getUserStatusErrorMessage(UsernameStatus.USERNAME_STATUS_UNSPECIFIED),
      );
      return false;
    }
  };

  return {
    usernameError,
    isUsernameValid,
  };
};
