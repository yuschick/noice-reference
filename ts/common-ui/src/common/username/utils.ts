import { UsernameStatus } from '@noice-com/schemas/profile/profile.pb';

import { UsernameError, UsernameValidationError } from './types';

export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 30;

export const getUsernameErrorMessage = (error: UsernameError) => {
  if (error === UsernameStatus.USERNAME_STATUS_GUIDELINES_VIOLATION) {
    return 'Please choose a different username and make sure it complies with our community guidelines';
  }

  if (error === UsernameStatus.USERNAME_STATUS_RESERVED) {
    return 'This username has been reserved';
  }

  if (error === UsernameValidationError.PatternInvalid) {
    return 'Username can only contain letters, numbers and underscores';
  }

  if (error === UsernameValidationError.LengthInvalid) {
    return `Usernames must be between ${USERNAME_MIN_LENGTH} and ${USERNAME_MAX_LENGTH} characters`;
  }

  return 'Please pick another username';
};
