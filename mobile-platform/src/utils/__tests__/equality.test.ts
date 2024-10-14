import { isNonEmptyString } from '../equality';

describe('equality', () => {
  describe('isNonEmptyString', () => {
    it('should return true for non-empty strings', () => {
      expect(isNonEmptyString('hello')).toBe(true);
    });

    it('should return false for empty strings', () => {
      expect(isNonEmptyString('')).toBe(false);
    });

    it('should return false for undefined', () => {
      const someObj: Record<string, string> = { foo: 'bar' };
      expect(isNonEmptyString()).toBe(false);
      expect(isNonEmptyString(someObj.baz)).toBe(false);
    });
  });
});
