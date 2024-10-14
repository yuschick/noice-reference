import { pluralize } from '../strings';

describe('string utils', () => {
  describe('pluralize', () => {
    it('should return the plural when count is greater than one', () => {
      expect(pluralize(0, 'friend', 'friends')).toEqual('friends');
      expect(pluralize(1, 'friend', 'friends')).toEqual('friend');
      expect(pluralize(6, 'friend', 'friends')).toEqual('friends');
    });
  });
});
