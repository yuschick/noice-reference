import {
  hasEmojis,
  InvalidNameErrors,
  InvalidPasswordErrors,
  isValidName,
  isValidPassword,
} from '../validators';

describe('validation utils', () => {
  describe('hasEmojis', () => {
    it('should return true if the string contains emojis', () => {
      expect(hasEmojis('Hello 👪✅')).toEqual(true);
      expect(hasEmojis('should pass')).toEqual(false);
    });
  });

  describe('isValidName', () => {
    it('should return false for too short names', () => {
      const [invalidResult, err] = isValidName('Hi');
      expect(invalidResult).toEqual(false);
      expect(err).toEqual(InvalidNameErrors.TooShort);
    });

    it('should return false for names with emojis', () => {
      const [invalidResult, err] = isValidName('Noob💀DeStroyer👪89');
      expect(invalidResult).toEqual(false);
      expect(err).toEqual(InvalidNameErrors.ContainsEmojis);
    });

    it('should return true for valid names', () => {
      const [valid1] = isValidName('Ninja');
      const [valid2] = isValidName('Iceman');
      const [valid3] = isValidName('F0rtn1t3r');
      expect(valid1).toEqual(true);
      expect(valid2).toEqual(true);
      expect(valid3).toEqual(true);
    });
  });

  describe('isValidPassword', () => {
    it('should return false for too short names', () => {
      const [invalidResult, err] = isValidPassword('hello');
      expect(invalidResult).toEqual(false);
      expect(err).toEqual(InvalidPasswordErrors.TooShort);
    });

    it('should return true for valid passwords', () => {
      const [valid1] = isValidName('this is a very long password');
      const [valid2] = isValidName('n1nj4IsMyH0meb0y');
      const [valid3] = isValidName('F0rtn1t3r');
      expect(valid1).toEqual(true);
      expect(valid2).toEqual(true);
      expect(valid3).toEqual(true);
    });
  });
});
