import {
  getMaxHours,
  getMaxMinutes,
  getMaxSeconds,
  getMinHours,
  getMinMinutes,
  getMinSeconds,
} from '../utils';

describe('ClipTimeController utils', () => {
  describe('getMinHours', () => {
    it('should return 0 if no min value is provided', () => {
      expect(getMinHours()).toBe(0);
    });

    it('should return 0 if min value is 0', () => {
      expect(getMinHours(0)).toBe(0);
    });

    it('should return 0 if min value is negative', () => {
      expect(getMinHours(-1)).toBe(0);
    });

    it('should return 0 if min value is 59 minutes', () => {
      expect(getMinHours(59 * 60)).toBe(0);
    });

    it('should return 1 if min value is 60 minutes', () => {
      expect(getMinHours(60 * 60)).toBe(1);
    });
  });

  describe('getMinMinutes', () => {
    it('should return 0 if no min value is provided', () => {
      expect(getMinMinutes(0)).toBe(0);
    });

    it('should return 0 if min value is 0', () => {
      expect(getMinMinutes(0, 0)).toBe(0);
    });

    it('should return 0 if min value is negative', () => {
      expect(getMinMinutes(0, -1)).toBe(0);
    });

    it('should return 0 if hours are 0 and min value is 61 minutes', () => {
      expect(getMinMinutes(0, 61 * 60)).toBe(0);
    });

    it('should return 1 if hours are 1 and min value is 61 minutes', () => {
      expect(getMinMinutes(1, 61 * 60)).toBe(1);
    });
  });

  describe('getMinSeconds', () => {
    it('should return 0 if no min value is provided', () => {
      expect(getMinSeconds(0, 0)).toBe(0);
    });

    it('should return 0 if min value is 0', () => {
      expect(getMinSeconds(0, 0, 0)).toBe(0);
    });

    it('should return 0 if min value is negative', () => {
      expect(getMinSeconds(0, 0, -1)).toBe(0);
    });

    it('should return 0 if hours are 0, minutes are 0 and min value is 61 seconds', () => {
      expect(getMinSeconds(0, 0, 61)).toBe(0);
    });

    it('should return 1 if hours are 1, minutes are 5 and min value is 1 hour 5 minutes 1 second', () => {
      expect(getMinSeconds(1, 5, 1 * 60 * 60 + 5 * 60 + 1)).toBe(1);
    });
  });

  describe('getMaxHours', () => {
    it('should return undefined if no valid video duration and max value are provided', () => {
      expect(getMaxHours(0)).toBe(undefined);
      expect(getMaxHours(0, 0)).toBe(undefined);
      expect(getMaxHours(-1, 0)).toBe(undefined);
      expect(getMaxHours(-1)).toBe(undefined);
    });

    it('should return valid number, when max is valid but video duration is not', () => {
      expect(getMaxHours(-1, 61 * 60)).toBe(1);
    });

    it('should return valid number, when video duration is valid but max is not', () => {
      expect(getMaxHours(61 * 60, -1)).toBe(1);
    });

    it('should return 0 if video duration is 59 min and max not set', () => {
      expect(getMaxHours(59 * 60)).toBe(0);
    });

    it('should return 1 if video duration is 60 min and max not set', () => {
      expect(getMaxHours(60 * 60)).toBe(1);
    });

    it('should return 1 if video duration is 61 minutes and max is 120 minutes', () => {
      expect(getMaxHours(61 * 60, 120 * 60)).toBe(1);
    });

    it('should return 0 if video duration is 61 minutes and max is 59 minutes', () => {
      expect(getMaxHours(61 * 60, 59 * 60)).toBe(0);
    });
  });

  describe('getMaxMinutes', () => {
    it('should return 59 if no valid video duration and max value are provided', () => {
      expect(getMaxMinutes(0, 1)).toBe(59);
      expect(getMaxMinutes(0, 1, 0)).toBe(59);
      expect(getMaxMinutes(-1, 1, 0)).toBe(59);
      expect(getMaxMinutes(-1, 1)).toBe(59);
    });

    it('should return valid number, when max is valid but video duration is not', () => {
      expect(getMaxMinutes(-1, 0, 38 * 60)).toBe(38);
    });

    it('should return valid number, when video duration is valid but max is not', () => {
      expect(getMaxMinutes(38 * 60, 0, -1)).toBe(38);
    });

    it('should return 38 if video duration is 1 hour 38 min and hour is 1', () => {
      expect(getMaxMinutes(1 * 60 * 60 + 38 * 60, 1)).toBe(38);
    });

    it('should return 38 if video duration is 38 minutes and max is 45 minutes', () => {
      expect(getMaxMinutes(38 * 60, 0, 45 * 60)).toBe(38);
    });

    it('should return 0 if video duration is 45 minutes and max is 48 minutes', () => {
      expect(getMaxMinutes(45 * 60, 0, 38 * 60)).toBe(38);
    });
  });

  describe('getMaxSeconds', () => {
    it('should return 59 if no valid video duration and max value are provided', () => {
      expect(getMaxSeconds(0, 1, 1)).toBe(59);
      expect(getMaxSeconds(0, 1, 1, 0)).toBe(59);
      expect(getMaxSeconds(-1, 1, 1, 0)).toBe(59);
      expect(getMaxSeconds(-1, 1, 1)).toBe(59);
    });

    it('should return valid number, when max is valid but video duration is not', () => {
      expect(getMaxSeconds(-1, 0, 0, 38)).toBe(38);
    });

    it('should return valid number, when video duration is valid but max is not', () => {
      expect(getMaxSeconds(38, 0, 0, -1)).toBe(38);
    });

    it('should return 38 if video duration is 1 hour 38 min 22 seconds and hour is 1, minutes is 38', () => {
      expect(getMaxSeconds(1 * 60 * 60 + 38 * 60 + 22, 1, 38)).toBe(22);
    });

    it('should return 38 if video duration is 38 seconds and max is 45 seconds', () => {
      expect(getMaxSeconds(38, 0, 0, 45)).toBe(38);
    });

    it('should return 0 if video duration is 45 seconds and max is 48 seconds', () => {
      expect(getMaxSeconds(45, 0, 0, 38)).toBe(38);
    });
  });
});
