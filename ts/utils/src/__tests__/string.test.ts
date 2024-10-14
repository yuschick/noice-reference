import { normalizePropertyName, padStart } from '../string';

describe('string utils', () => {
  describe('padStart', () => {
    it('should return a string of the correct length with the given padding', () => {
      expect(padStart('hi', '0', 5)).toEqual('000hi');
      expect(padStart('foo', '_', 10)).toEqual('_______foo');
    });

    it('should return the string if the string exceeds the target length', () => {
      expect(padStart('hello there', '0', 5)).toEqual('hello there');
    });
  });

  describe('normalize property name', () => {
    it('normalizes kebab-cased property name', () => {
      expect(normalizePropertyName('property-name')).toBe('Property name');
    });

    it('normalizes snake_case property name', () => {
      expect(normalizePropertyName('property_name')).toBe('Property name');
    });

    it('normalizes camelCased property name', () => {
      expect(normalizePropertyName('propertyName')).toBe('Property name');
    });
  });
});
