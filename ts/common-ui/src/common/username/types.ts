import { UsernameStatus } from '@noice-com/schemas/profile/profile.pb';

export enum UsernameValidationError {
  LengthInvalid = 'LengthInvalid',
  PatternInvalid = 'PatternInvalid',
}

export type UsernameError =
  | UsernameValidationError
  | Exclude<UsernameStatus, UsernameStatus.USERNAME_STATUS_OK>;
