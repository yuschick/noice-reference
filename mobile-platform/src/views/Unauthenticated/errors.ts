export const AuthV4ErrorCode = {
  userNotFound: 5,
  userAlreadyExists: 6,
  rateLimitExceeded: 8,
} as const;

type AuthV4ErrorCode = (typeof AuthV4ErrorCode)[keyof typeof AuthV4ErrorCode];

export type AuthV4Error = {
  code: AuthV4ErrorCode;
};
