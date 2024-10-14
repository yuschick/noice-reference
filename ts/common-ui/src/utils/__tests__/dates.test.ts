import { timersValid } from '../dates';

describe('date utils', () => {
  describe('timersValid', () => {
    it('should return false if a timer is undefined', () => {
      expect(timersValid()).toEqual(false);
      expect(timersValid(null)).toEqual(false);
    });

    it('should return false if a timers start and end times are equal', () => {
      const now = Date.now();
      expect(
        timersValid({
          start: now,
          end: now,
        }),
      ).toEqual(false);
    });

    it('should return false if a timers start time is after the end time', () => {
      const now = Date.now();
      expect(
        timersValid({
          start: now + 1000,
          end: now + 100,
        }),
      ).toEqual(false);
    });

    it('should return true if the timer is valid', () => {
      const now = Date.now();
      expect(timersValid({ start: now, end: now + 1000 })).toEqual(true);
      expect(timersValid({ start: now - 5000, end: now + 5000 })).toEqual(true);
    });
  });
});
