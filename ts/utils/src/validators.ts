/**
 * Determines whether the string contains emojis.
 * @param str The string to check.
 * @returns True if the string contains emojis.
 */
export const hasEmojis = (str: string): boolean => /\p{Extended_Pictographic}/u.test(str);

export enum InvalidNameErrors {
  TooShort = 'Name must be longer than 2 characters.',
  ContainsEmojis = 'Name cannot contain emojis.',
}

/**
 * Determines whether a given display name is valid or not.
 * @param name The name to check.
 * @returns A tuple with a bool if it is valid, and a string containing the error (if there is one).
 */
export const isValidName = (name: string): [boolean, string] => {
  if (hasEmojis(name)) {
    return [false, InvalidNameErrors.ContainsEmojis];
  }

  if (name.length <= 2) {
    return [false, InvalidNameErrors.TooShort];
  }

  return [true, ''];
};

export enum InvalidPasswordErrors {
  TooShort = 'Password must be at least 8 characters.',
}

export const isValidPassword = (pw: string): [boolean, string] => {
  if (pw.length < 8) {
    return [false, InvalidPasswordErrors.TooShort];
  }

  return [true, ''];
};
