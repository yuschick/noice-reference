import { cleanArray, mapExisting, reduce } from '../array';

describe('array utils', () => {
  describe('reduce', () => {
    it('should reduce the given value to the target value (with types)', () => {
      const sum = reduce<number, number>(
        [10, 50, 60],
        (sum: number, val: number) => sum + val,
        0,
      );
      expect(sum).toEqual(120);

      interface Players {
        [key: string]: number;
      }

      expect(
        reduce<string, Players>(
          ['bob', 'jerry', 'sam'],
          (result: Players, name: string, index: number) => {
            return {
              ...result,
              [name]: index,
            };
          },
          {},
        ),
      ).toEqual({
        bob: 0,
        jerry: 1,
        sam: 2,
      });
    });
  });

  describe('mapExisting', () => {
    it('only returns defined results', () => {
      const arr = ['1', '2', '3', '4'];

      const result = mapExisting(arr, (curr) => {
        if (curr === '3') {
          return undefined;
        }

        if (curr === '4') {
          return null;
        }

        return curr;
      });
      expect(result).toEqual(['1', '2']);
    });
  });

  describe('clean', () => {
    it('cleans array', () => {
      const arrayWithNullsAndUndefined = [
        1,
        2,
        3,
        4,
        undefined,
        5,
        null,
        6,
        undefined,
        7,
      ];

      expect(cleanArray(arrayWithNullsAndUndefined)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    });
  });
});
