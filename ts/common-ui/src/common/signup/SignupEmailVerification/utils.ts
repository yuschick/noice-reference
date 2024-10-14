import { VerificationCode } from './types';

export function getVerificationCodeAsString(code: VerificationCode) {
  const iterable = code.entries();
  let result = iterable.next();
  let codeString = '';

  while (!result.done) {
    if (!result.value[1]) {
      return null;
    }

    codeString = codeString.concat(result.value[1]);
    result = iterable.next();
  }

  return codeString;
}
