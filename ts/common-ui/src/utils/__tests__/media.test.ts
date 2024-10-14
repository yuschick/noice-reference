import { validateFileSize } from '../media';

describe('media utils', () => {
  describe('validateFileSize', () => {
    it('should accept 30 000 000 bytes with a 30 MiB limit', () => {
      expect(validateFileSize({ fileSize: 30000000, mb: 30 })).toBe(true);
    });

    it('should accept 31 457 280 bytes with a 30 MiB limit', () => {
      expect(validateFileSize({ fileSize: 31457280, mb: 30 })).toBe(true);
    });

    it('should reject 32 000 000 bytes with a 30 MiB limit', () => {
      expect(validateFileSize({ fileSize: 32000000, mb: 30 })).toBe(false);
    });
  });
});
