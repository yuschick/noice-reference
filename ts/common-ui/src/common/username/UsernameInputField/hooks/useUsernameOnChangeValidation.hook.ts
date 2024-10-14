import { UsernameStatus } from '@noice-com/schemas/profile/profile.pb';
import { Nullable } from '@noice-com/utils';
import { ChangeEvent, useEffect, useState } from 'react';

import { UsernameError, UsernameValidationError } from '../../types';
import { USERNAME_MIN_LENGTH, getUsernameErrorMessage } from '../../utils';

const usernameValidPattern = /^[a-zA-Z0-9_-]{3,30}$/;

interface HookResult {
  usernameErrorMessage: Nullable<string>;
  showReservedUsernameCallout: boolean;
  onChange(event: ChangeEvent<HTMLInputElement>): void;
}

interface Props {
  usernameError: Nullable<UsernameError>;
  onUsernameChange(username: string): void;
}

export function useUsernameOnChangeValidation({
  onUsernameChange,
  usernameError: usernameErrorProp,
}: Props): HookResult {
  const [usernameError, setUsernameError] =
    useState<Nullable<UsernameError>>(usernameErrorProp);

  useEffect(() => {
    setUsernameError(usernameErrorProp);
  }, [usernameErrorProp]);

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUsernameError(null);

    const username = event.target.value;

    onUsernameChange(username);

    if (username.length < USERNAME_MIN_LENGTH) {
      setUsernameError(UsernameValidationError.LengthInvalid);
      return;
    }

    const isUsernamePatternValid = usernameValidPattern.test(username);
    if (!isUsernamePatternValid) {
      setUsernameError(UsernameValidationError.PatternInvalid);
      return;
    }
  };

  return {
    onChange,
    usernameErrorMessage: usernameError ? getUsernameErrorMessage(usernameError) : null,
    showReservedUsernameCallout:
      usernameError === UsernameStatus.USERNAME_STATUS_RESERVED,
  };
}
