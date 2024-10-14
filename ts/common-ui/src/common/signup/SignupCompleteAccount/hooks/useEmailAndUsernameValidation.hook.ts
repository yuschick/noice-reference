import { useClient } from '@noice-com/common-react-core';
import { EmailStatus } from '@noice-com/schemas/auth/authv4.pb';
import { UsernameStatus } from '@noice-com/schemas/profile/profile.pb';
import { Nullable } from '@noice-com/utils';
import { useCallback, useState, ChangeEvent } from 'react';

import { useSignup } from '../../context';

import { UsernameError, UsernameValidationError } from '@common-common/username';

interface HookResult {
  emailAddressError: Nullable<string>;
  usernameError: Nullable<UsernameError>;
  onEmailChange(event: ChangeEvent<HTMLInputElement>): void;
  onSubmitEmailAndUsernameValidation(): Promise<boolean>;
}

const ERROR_MSG =
  'This email address is either invalid or not available. Please double check the address and try again.';

export function useEmailAndUsernameValidation(): HookResult {
  const {
    signupData: { username, appleIdToken, email, verifiedCaptchaToken },
    showError,
    appendSignupData,
  } = useSignup();
  const client = useClient();

  const [usernameError, setUsernameError] = useState<Nullable<UsernameError>>(null);
  const [emailAddressError, setEmailAddressError] = useState<Nullable<string>>(null);

  const onEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmailAddressError(null);
    appendSignupData({ email: event.target.value });
  };

  const onSubmitEmailAndUsernameValidation = useCallback(async () => {
    setUsernameError(null);

    try {
      const result = await client.AuthService.verifySignup({
        appleIdToken,
        captchaToken: verifiedCaptchaToken,
        email,
        username,
      });

      if (result.usernameStatus !== UsernameStatus.USERNAME_STATUS_OK) {
        setUsernameError(
          result.usernameStatus ?? UsernameStatus.USERNAME_STATUS_UNSPECIFIED,
        );
        return false;
      }

      if (result.emailStatus !== EmailStatus.EMAIL_STATUS_ACCEPTED) {
        setEmailAddressError(ERROR_MSG);
        return false;
      }

      return true;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error?.message === 'invalid captcha token') {
        showError();
        return false;
      }

      if (error?.message?.includes('value does not match regex')) {
        setUsernameError(UsernameValidationError.PatternInvalid);
        return false;
      }

      setUsernameError(UsernameStatus.USERNAME_STATUS_UNSPECIFIED);
      return false;
    }
  }, [
    appleIdToken,
    client.AuthService,
    email,
    showError,
    username,
    verifiedCaptchaToken,
  ]);

  return {
    emailAddressError,
    onEmailChange,
    onSubmitEmailAndUsernameValidation,
    usernameError,
  };
}
