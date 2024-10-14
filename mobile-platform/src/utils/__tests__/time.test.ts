import { getTimeSinceLabel } from '../time';

describe('getTimeSinceLabel', () => {
  describe('validateEmail', () => {
    it('should return null', () => {
      expect(getTimeSinceLabel(Date.now(), Date.now())).toBe(null);
      expect(getTimeSinceLabel(new Date(), new Date())).toBe(null);
      expect(
        getTimeSinceLabel('2023-08-30T12:39:18.680Z', '2023-08-30T12:39:18.680Z'),
      ).toBe(null);
    });

    it('should return 1 minute', () => {
      const checkString = '1 minute';
      const timeDiff = 1000 * 60;
      const now = new Date();
      expect(getTimeSinceLabel(now.getTime() - timeDiff, now.getTime())).toBe(
        checkString,
      );
      expect(
        getTimeSinceLabel(new Date(now.getTime() - timeDiff), new Date(now.getTime())),
      ).toBe(checkString);
      expect(
        getTimeSinceLabel(
          new Date(now.getTime() - timeDiff).toISOString(),
          new Date(now.getTime()).toISOString(),
        ),
      ).toBe(checkString);
    });

    it('should return 5 minutes', () => {
      const checkString = '5 minutes';
      const timeDiff = 1000 * 60 * 5;
      const now = new Date();
      expect(getTimeSinceLabel(now.getTime() - timeDiff, now.getTime())).toBe(
        checkString,
      );
      expect(
        getTimeSinceLabel(new Date(now.getTime() - timeDiff), new Date(now.getTime())),
      ).toBe(checkString);
      expect(
        getTimeSinceLabel(
          new Date(now.getTime() - timeDiff).toISOString(),
          new Date(now.getTime()).toISOString(),
        ),
      ).toBe(checkString);
    });

    it('should return 1 hour', () => {
      const checkString = '1 hour';
      const timeDiff = 1000 * 60 * 60;
      const now = new Date();
      expect(getTimeSinceLabel(now.getTime() - timeDiff, now.getTime())).toBe(
        checkString,
      );
      expect(
        getTimeSinceLabel(new Date(now.getTime() - timeDiff), new Date(now.getTime())),
      ).toBe(checkString);
      expect(
        getTimeSinceLabel(
          new Date(now.getTime() - timeDiff).toISOString(),
          new Date(now.getTime()).toISOString(),
        ),
      ).toBe(checkString);
    });

    it('should return 5 hours', () => {
      const checkString = '5 hours';
      const timeDiff = 1000 * 60 * 60 * 5;
      const now = new Date();
      expect(getTimeSinceLabel(now.getTime() - timeDiff, now.getTime())).toBe(
        checkString,
      );
      expect(
        getTimeSinceLabel(new Date(now.getTime() - timeDiff), new Date(now.getTime())),
      ).toBe(checkString);
      expect(
        getTimeSinceLabel(
          new Date(now.getTime() - timeDiff).toISOString(),
          new Date(now.getTime()).toISOString(),
        ),
      ).toBe(checkString);
    });

    it('should return 1 day', () => {
      const checkString = '1 day';
      const timeDiff = 1000 * 60 * 60 * 24;
      const now = new Date();
      expect(getTimeSinceLabel(now.getTime() - timeDiff, now.getTime())).toBe(
        checkString,
      );
      expect(
        getTimeSinceLabel(new Date(now.getTime() - timeDiff), new Date(now.getTime())),
      ).toBe(checkString);
      expect(
        getTimeSinceLabel(
          new Date(now.getTime() - timeDiff).toISOString(),
          new Date(now.getTime()).toISOString(),
        ),
      ).toBe(checkString);
    });

    it('should return 5 days', () => {
      const checkString = '5 days';
      const timeDiff = 1000 * 60 * 60 * 24 * 5;
      const now = new Date();
      expect(getTimeSinceLabel(now.getTime() - timeDiff, now.getTime())).toBe(
        checkString,
      );
      expect(
        getTimeSinceLabel(new Date(now.getTime() - timeDiff), new Date(now.getTime())),
      ).toBe(checkString);
      expect(
        getTimeSinceLabel(
          new Date(now.getTime() - timeDiff).toISOString(),
          new Date(now.getTime()).toISOString(),
        ),
      ).toBe(checkString);
    });
  });
});
