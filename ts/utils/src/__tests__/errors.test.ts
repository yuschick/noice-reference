import { getErrorMessage } from '../errors';

describe('errors', () => {
  describe('getErrorMessage', () => {
    it('should return the message of an error', () => {
      const message = 'message';
      const error = new Error(message);
      expect(getErrorMessage(error)).toBe(message);
    });

    it('should return the message of an object with a message property', () => {
      const message = 'message';
      const error = { message };
      expect(getErrorMessage(error)).toBe(message);
    });

    it('should return the stringified value of an object without a message property', () => {
      const value = { foo: 'bar' };
      expect(getErrorMessage(value)).toBe(JSON.stringify(value));
    });
  });
});
