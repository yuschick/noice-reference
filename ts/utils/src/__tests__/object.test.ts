import { deepMerge, invertObject } from '../object';

describe('object utils', () => {
  describe('invertObject', () => {
    it('should turn object values into keys', () => {
      const start = {
        foo: 'bar',
        baz: 'gaz',
        waldo: 'fred',
      };
      expect(invertObject(start)).toEqual({
        bar: 'foo',
        gaz: 'baz',
        fred: 'waldo',
      });
    });

    it('should ignore values that are not strings or numbers', () => {
      const start = {
        foo: 'bar',
        gaz: 50,
        ignore: true,
      };
      expect(invertObject(start)).toEqual({
        bar: 'foo',
        50: 'gaz',
      });
    });
  });

  describe('deepMerge', () => {
    it('should merge 2 objects', () => {
      const obj1 = {
        test1: 'hello',
        test2: 'world',
      };

      const obj2 = {
        test3: 'how is it',
        test4: 'going',
      };

      const result = deepMerge(obj1, obj2);
      expect(result).toEqual({
        test1: 'hello',
        test2: 'world',
        test3: 'how is it',
        test4: 'going',
      });
    });
  });
});
