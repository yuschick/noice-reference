import { GameTimer } from '../GameTimer';

describe('GameTimer', () => {
  const startTime = Date.now();

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe('Initialization', () => {
    it('should init from the current time given a duration', () => {
      jest.setSystemTime(startTime);
      const duration = 5000;
      const timer = GameTimer.FromNow(duration);

      expect(timer.start).toEqual(startTime);
      expect(timer.duration).toEqual(duration);
      expect(timer.end).toEqual(startTime + duration);
    });

    it('should init from a given start point', () => {
      const defaultDuration = 5000;

      const before = Date.now();
      const timer = GameTimer.FromServerTime('5000', undefined, { defaultDuration });
      const after = Date.now();
      expect(timer.start).toBeGreaterThanOrEqual(before);
      expect(timer.start).toBeLessThanOrEqual(after);

      expect(timer.duration).toEqual(defaultDuration);
      expect(timer.end).toEqual(timer.start + defaultDuration);
    });

    it('should init from a given end point', () => {
      const defaultDuration = 5000;

      const before = Date.now();
      const timer = GameTimer.FromServerTime(undefined, '10000', { defaultDuration });
      const after = Date.now();
      expect(timer.end).toBeGreaterThanOrEqual(before);
      expect(timer.end).toBeLessThanOrEqual(after);

      expect(timer.duration).toEqual(defaultDuration);
      expect(timer.start).toEqual(timer.end - defaultDuration);
    });

    it('should init from two timestamp strings', () => {
      const start = new Date();
      const end = new Date(start.getTime() + 25000);
      const duration = end.getTime() - start.getTime();
      const timer = GameTimer.FromDateStrings(
        `${start.toISOString()}`,
        `${end.toISOString()}`,
      );

      expect(timer.start).toEqual(start.getTime());
      expect(timer.end).toEqual(end.getTime());
      expect(timer.duration).toEqual(duration);
    });

    it('should init from two timestamps relative to serverTime', () => {
      const start = 5000;
      const end = 15001;
      const duration = end - start;
      const before = Date.now();
      const timer = GameTimer.FromServerTime(`${start}`, `${end}`);
      const after = Date.now();

      expect(timer.start).toBeGreaterThanOrEqual(before);
      expect(timer.start).toBeLessThanOrEqual(after);
      expect(timer.duration).toEqual(duration);
      expect(timer.end).toEqual(timer.start + duration);
    });

    it('should init from two timestamps and serverTime', () => {
      const timer = GameTimer.FromServerTime('5000', '15001', { serverTime: '10000' });

      expect(timer.duration).toEqual(10001);
      expect(timer.timeLeft).toEqual(5001);
    });
  });

  describe('Time Keeping', () => {
    it('should provide the current timer progress', () => {
      const now = Date.now();
      const duration = 500;
      const half = duration / 2;
      const quarter = half / 2;

      const start = now;
      const end = now + half * 2;
      const timer = GameTimer.FromServerTime(`${start}`, `${end}`);

      // Check that providing an arbitrary value works..
      expect(timer.duration).toEqual(duration);
      expect(timer.getProgress(timer.start + quarter)).toBeCloseTo(0.25);

      jest.setSystemTime(now + half);
      expect(timer.getProgress()).toBeCloseTo(0.5);

      // Check that the bounds work
      expect(timer.getProgress(timer.start)).toEqual(0);
      expect(timer.getProgress(timer.end)).toEqual(1);
    });

    it('should provide the progress clamped between 0 - 1', () => {
      const now = Date.now();
      const duration = 3000;
      const start = now;
      const end = start + duration;

      const timer = GameTimer.FromServerTime(`${start}`, `${end}`);
      expect(timer.getClampedProgress(timer.start - 500)).toEqual(0);
      expect(timer.getClampedProgress(timer.end + 500)).toEqual(1);
    });

    it('should provide whether the timer has started', () => {
      const now = Date.now();
      const timer = GameTimer.FromServerTime(`${now}`, undefined, {
        defaultDuration: 500,
      });

      jest.setSystemTime(now - 30);
      expect(timer.isStarted).toEqual(false);

      jest.setSystemTime(now + 30);
      expect(timer.isStarted).toEqual(true);
    });

    it('should provide whether the timer is in progress', () => {
      const now = Date.now();
      const timer = GameTimer.FromServerTime(`${now}`, undefined, {
        defaultDuration: 500,
      });

      jest.setSystemTime(now - 1);
      expect(timer.hasTimeLeft).toEqual(false);

      jest.setSystemTime(now);
      expect(timer.hasTimeLeft).toEqual(true);

      jest.setSystemTime(now + 100);
      expect(timer.hasTimeLeft).toEqual(true);
    });

    it('should provide whether the timer is completed', () => {
      const now = Date.now();
      const timer = GameTimer.FromServerTime(undefined, `${now}`, {
        defaultDuration: 500,
      });

      jest.setSystemTime(now - 100);
      expect(timer.isCompleted).toEqual(false);

      jest.setSystemTime(now + 30);
      expect(timer.isCompleted).toEqual(true);
    });
  });

  describe('Pausing', () => {
    it('should pause the progress', () => {
      const now = Date.now();
      const duration = 500;
      const half = duration / 2;
      const quarter = half / 2;

      const start = now;
      const end = now + half * 2;
      const timer = GameTimer.FromServerTime(`${start}`, `${end}`);

      jest.setSystemTime(now + quarter);

      timer.pause();

      // This should have no effect when paused
      jest.advanceTimersByTime(quarter);

      expect(timer.getProgress()).toBeCloseTo(0.25);
      expect(timer.getClampedProgress()).toEqual(0.25);
      expect(timer.timeLeft).toBeCloseTo(end - now - quarter);
    });

    it('should resume the timer', () => {
      const now = Date.now();
      const duration = 500;
      const half = duration / 2;
      const quarter = half / 2;

      const start = now;
      const end = now + half * 2;
      const timer = GameTimer.FromServerTime(`${start}`, `${end}`);

      jest.setSystemTime(now + quarter);

      timer.pause();

      // This should have no effect when paused
      jest.advanceTimersByTime(quarter);

      timer.resume();

      jest.advanceTimersByTime(quarter);

      expect(timer.getProgress()).toBeCloseTo(0.5);
      expect(timer.getClampedProgress()).toEqual(0.5);
      expect(timer.timeLeft).toBeCloseTo(end - now - half);
    });
  });
});
