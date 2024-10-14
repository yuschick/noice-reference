import { formatLargeNumber } from '../format';

describe('formatting utils', () => {
  describe('format large number', () => {
    it('It should return the correctly formatted strings', () => {
      expect(formatLargeNumber(5_600_123)).toEqual('5.6M');
      expect(formatLargeNumber(1_100_000)).toEqual('1.1M');
      expect(formatLargeNumber(50_500)).toEqual('50.5K');
      expect(formatLargeNumber(1_500)).toEqual('1.5K');
      expect(formatLargeNumber(999)).toEqual('999');
      expect(formatLargeNumber(23)).toEqual('23');
      expect(formatLargeNumber(0)).toEqual('0');
    });
  });
});
