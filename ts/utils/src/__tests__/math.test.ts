import { clamp, stringMath, transformNumberToShortString, transformRange } from '../math';

describe('math utils', () => {
  describe('stringMath', () => {
    it("should give correct value in 'add' operation", () => {
      const result = stringMath('add', '1', '1');
      expect(result).toEqual('2');
    });

    it("should give correct value in 'substract' operation", () => {
      const result = stringMath('substract', '2', '1');
      expect(result).toEqual('1');
    });

    it('add with empty values', () => {
      const result = stringMath('add');
      expect(result).toBe('NaN');
    });

    it('substract with empty values', () => {
      const result = stringMath('substract');
      expect(result).toBe('NaN');
    });
  });

  describe('clamp', () => {
    it('stays within min', () => {
      const value = clamp(1, 2, 3);
      expect(value).toBe(2);
    });

    it('statys within max', () => {
      const value = clamp(4, 2, 3);
      expect(value).toBe(3);
    });

    it("doesn't affect if already wihin range", () => {
      const value = clamp(1, 0, 2);
      expect(value).toBe(1);
    });
  });

  describe('transformRange', () => {
    it('larger range', () => {
      const value = transformRange(2, 1, 3, 4, 6);
      expect(value).toBe(5);
    });

    it('smaller range', () => {
      const value = transformRange(5, 4, 6, 1, 3);
      expect(value).toBe(2);
    });
  });

  describe('transformNumberToShortString', () => {
    it('does nothing when under thousand', () => {
      const result = transformNumberToShortString(999);
      expect(result).toBe('999');
    });

    it('transforms when bigger than thousand', () => {
      const result = transformNumberToShortString(1_111);
      expect(result).toBe('1.1K');
    });

    it('transforms when bigger than million', () => {
      const result = transformNumberToShortString(1_111_111);
      expect(result).toBe('1.1M');
    });
  });
});
