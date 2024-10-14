import { validateEmail } from '../validators';

describe('validators', () => {
  describe('validateEmail', () => {
    it('should return true for valid emails', () => {
      expect(validateEmail('test@noice.com')).toBe(true);
      expect(validateEmail('avery.very_very_superlong+32132@email.net')).toBe(true);
    });
  });

  it('should return false for invalid emails', () => {
    expect(validateEmail('test@noice')).toBe(false);
    expect(validateEmail('test@noice.')).toBe(false);
    expect(validateEmail('@noice.com')).toBe(false);
    expect(validateEmail('test@.com')).toBe(false);
  });
});
