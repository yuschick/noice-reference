import { sortAscending, sortDescending } from '../sort';

describe('sort utils', () => {
  describe('sortAscending', () => {
    it('should sort from lowest to highest (0...10)', () => {
      const arr = [1, 5, 4, 2, 3];
      const sorted = [...arr];
      sorted.sort(sortAscending);
      expect(sorted).toEqual([1, 2, 3, 4, 5]);
    });
  });

  describe('sortDescending', () => {
    it('should sort from highest to lowest (10...0)', () => {
      const arr = [1, 5, 4, 2, 3];
      const sorted = [...arr];
      sorted.sort(sortDescending);
      expect(sorted).toEqual([5, 4, 3, 2, 1]);
    });
  });
});
