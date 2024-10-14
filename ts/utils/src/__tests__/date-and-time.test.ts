import {
  getDays,
  getFullRelativeTime,
  getHours,
  getHTMLAttributeTime,
  getMinutes,
  getRelativeTime,
  getSeconds,
  getShortDate,
  getTime,
  parseDuration,
} from '../date-and-time';

describe('date utils', () => {
  const timestamp = '2023-09-12T18:00:00Z';
  const twoDays = 1000 * 60 * 60 * 48;
  const nearlyTwoDays = 1000 * 60 * 60 * 47.5;
  const twoHours = 1000 * 60 * 60 * 2;
  const nearlyTwoHours = 1000 * 60 * 60 * 1.9;
  const twoMinutes = 1000 * 60 * 2;
  const nearlyTwoMinutes = 1000 * 60 * 1.95;

  describe('getShortDate', () => {
    it('should return correct value', () => {
      expect(getShortDate(timestamp, { showInUTC: true })).toBe('12/09/23');
    });
  });

  describe('getTime', () => {
    it('should return correct value', () => {
      expect(getTime(timestamp, { showInUTC: true })).toBe('18:00');
    });

    it('should return correct value with seconds', () => {
      expect(getTime(timestamp, { showInUTC: true, showSeconds: true })).toBe('18:00:00');
    });
  });

  describe('getDays', () => {
    it('should return correct value', () => {
      const days = getDays(twoDays);
      expect(days).toBe(2);
    });

    it('should return correct value with rounding', () => {
      const days = getDays(nearlyTwoDays, true);
      expect(days).toBe(2);
    });

    it('should return correct value without rounding', () => {
      const days = getDays(nearlyTwoDays);
      expect(days).toBe(1);
    });

    it('should return 0 with 0 timestamp', () => {
      const days = getDays(0);
      expect(days).toBe(0);
    });
  });

  describe('getHours', () => {
    it('should return correct value', () => {
      const hours = getHours(twoHours);
      expect(hours).toBe(2);
    });

    it('should return correct value with rounding', () => {
      const hours = getHours(nearlyTwoHours, true);
      expect(hours).toBe(2);
    });

    it('should return correct value without rounding', () => {
      const hours = getHours(nearlyTwoHours);
      expect(hours).toBe(1);
    });

    it('should return 0 with 0 timestamp', () => {
      const hours = getHours(0);
      expect(hours).toBe(0);
    });
  });

  describe('getMinutes', () => {
    it('should return correct value', () => {
      const minutes = getMinutes(twoMinutes);
      expect(minutes).toBe(2);
    });

    it('should return correct value with rounding', () => {
      const minutes = getMinutes(nearlyTwoMinutes, true);
      expect(minutes).toBe(2);
    });

    it('should return correct value with rounding', () => {
      const minutes = getMinutes(nearlyTwoMinutes);
      expect(minutes).toBe(1);
    });

    it('should return 0 with 0 timestsamp', () => {
      const minutes = getMinutes(0);
      expect(minutes).toBe(0);
    });
  });

  describe('getSeconds', () => {
    it('should return correct value', () => {
      const seconds = getSeconds(2000);
      expect(seconds).toBe(2);
    });

    it('should return 0 with 0 timestsamp', () => {
      const seconds = getSeconds(0);
      expect(seconds).toBe(0);
    });
  });

  describe('getRelativeTime', () => {
    it('should return correct string with days', () => {
      const relativeTime = getRelativeTime(new Date().getTime() - twoDays);
      expect(relativeTime).toBe('2d');
    });

    it('should return correct string with hours', () => {
      const relativeTime = getRelativeTime(new Date().getTime() - twoHours);
      expect(relativeTime).toBe('2h');
    });

    it('should return correct string with minutes', () => {
      const relativeTime = getRelativeTime(new Date().getTime() - twoMinutes);
      expect(relativeTime).toBe('2m');
    });

    it('should return correct string with seconds', () => {
      const relativeTime = getRelativeTime(new Date().getTime() - 2000);
      expect(relativeTime).toBe('2s');
    });

    it('should return correct string with negative time', () => {
      const relativeTime = getRelativeTime(new Date().getTime() + 10000);
      expect(relativeTime).toBe('-10s');
    });
  });

  describe('get HTML attribute time', () => {
    it('returns date in HTML attribute format', () => {
      expect(getHTMLAttributeTime('06.09.2035 15:53')).toBe('2035-06-09T15:53');

      expect(getHTMLAttributeTime('12/26/2035 04:07')).toBe('2035-12-26T04:07');
    });
  });

  describe('parseDuration tests', () => {
    it('should parse simple with seconds', () => {
      expect(parseDuration('1s')).toBe(1000);
    });

    it('should parse simple duration with minutes', () => {
      expect(parseDuration('1m')).toBe(60000);
    });

    it('should parse simple duration with hours', () => {
      expect(parseDuration('1h')).toBe(3600000);
    });

    it('should parse simple duration with days', () => {
      expect(parseDuration('1d')).toBe(86400000);
    });

    it('should parse duration with fractions', () => {
      expect(parseDuration('1.5s')).toBe(1500);
    });
  });

  describe('getFullRelativeTime tests', () => {
    beforeAll(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date(2020, 3, 1, 0, 0, 0));
    });

    it('days are rounded correctly if hours > 12', () => {
      const date = new Date(2020, 3, 2, 13, 1, 1);
      expect(
        getFullRelativeTime(date.toISOString(), {
          days: true,
          hours: true,
          minutes: true,
          seconds: true,
        }),
      ).toBe('1 day 13 hours 1 minute 1 second');
    });

    it('days are rounded correctly if hours < 12', () => {
      const date = new Date(2020, 3, 2, 11, 1, 1);
      expect(
        getFullRelativeTime(date.toISOString(), {
          days: true,
          hours: true,
          minutes: true,
          seconds: true,
        }),
      ).toBe('1 day 11 hours 1 minute 1 second');
    });

    it('hours are rounded correctly if minutes > 30', () => {
      const date = new Date(2020, 3, 2, 13, 40, 1);
      expect(
        getFullRelativeTime(date.toISOString(), {
          days: true,
          hours: true,
          minutes: true,
          seconds: true,
        }),
      ).toBe('1 day 13 hours 40 minutes 1 second');
    });

    it('hours are rounded correctly if minutes < 30', () => {
      const date = new Date(2020, 3, 2, 11, 20, 1);
      expect(
        getFullRelativeTime(date.toISOString(), {
          days: true,
          hours: true,
          minutes: true,
          seconds: true,
        }),
      ).toBe('1 day 11 hours 20 minutes 1 second');
    });

    it('minutes are rounded correctly if seconds > 30', () => {
      const date = new Date(2020, 3, 2, 13, 40, 40);
      expect(
        getFullRelativeTime(date.toISOString(), {
          days: true,
          hours: true,
          minutes: true,
          seconds: true,
        }),
      ).toBe('1 day 13 hours 40 minutes 40 seconds');
    });

    it('minutes are rounded correctly if seconds < 30', () => {
      const date = new Date(2020, 3, 2, 11, 20, 20);
      expect(
        getFullRelativeTime(date.toISOString(), {
          days: true,
          hours: true,
          minutes: true,
          seconds: true,
        }),
      ).toBe('1 day 11 hours 20 minutes 20 seconds');
    });

    it('singular forms if 1 of unit is present  ', () => {
      const date = new Date(2020, 3, 2, 1, 1, 1);
      expect(
        getFullRelativeTime(date.toISOString(), {
          days: true,
          hours: true,
          minutes: true,
          seconds: true,
        }),
      ).toBe('1 day 1 hour 1 minute 1 second');
    });

    it('fallbacks to show minutes if relative time is smaller than provided options', () => {
      const date = new Date(2020, 3, 1, 0, 5, 5);
      expect(
        getFullRelativeTime(date.toISOString(), {
          days: true,
          hours: true,
          fallbackToMoreGranularTime: true,
        }),
      ).toBe('5 minutes');
    });

    it('fallbacks to show seconds if relative time is smaller than provided options', () => {
      const date = new Date(2020, 3, 1, 0, 0, 5);
      expect(
        getFullRelativeTime(date.toISOString(), {
          days: true,
          hours: true,
          fallbackToMoreGranularTime: true,
        }),
      ).toBe('5 seconds');
    });

    it('does not show more granular fallbacks if days and hours found', () => {
      const date = new Date(2020, 3, 2, 5, 0, 5);
      expect(
        getFullRelativeTime(date.toISOString(), {
          days: true,
          hours: true,
          fallbackToMoreGranularTime: true,
        }),
      ).toBe('1 day 5 hours');
    });

    it('does not show more granular fallbacks if days found', () => {
      const date = new Date(2020, 3, 2, 0, 0, 5);
      expect(
        getFullRelativeTime(date.toISOString(), {
          days: true,
          fallbackToMoreGranularTime: true,
        }),
      ).toBe('1 day');
    });

    it('does not show more granular fallbacks if hours found', () => {
      const date = new Date(2020, 3, 1, 4, 0, 5);
      expect(
        getFullRelativeTime(date.toISOString(), {
          days: true,
          hours: true,
          fallbackToMoreGranularTime: true,
        }),
      ).toBe('4 hours');
    });

    it('does not fallback to show more granular time by default', () => {
      const date = new Date(2020, 3, 1, 0, 5, 5);
      expect(
        getFullRelativeTime(date.toISOString(), {
          days: true,
          hours: true,
        }),
      ).toBe('');
    });

    afterAll(() => {
      jest.useRealTimers();
    });
  });
});
