import { MockGameStateProvider } from '../../__mocks__/MockGameStateProvider';
import {
  boosterAsActiveFragment,
  StandardBooster,
  TimedBooster,
} from '../../__testdata__/boosters';
import { DelegateEventForwarder } from '../../events';
import { CGPlayer } from '../../player';
import { GameTimer } from '../../timer';
import { CGActiveBooster } from '../CGActiveBooster';

import { CgActiveBoosterFragment } from '@game-gen';

const standardBoosterSchema: CgActiveBoosterFragment =
  boosterAsActiveFragment(StandardBooster);
const timedBoosterSchema: CgActiveBoosterFragment = boosterAsActiveFragment(TimedBooster);

describe('CGActiveBooster', () => {
  const eventForwarder = new DelegateEventForwarder();
  const stateProvider = new MockGameStateProvider();

  const playerInstance = new CGPlayer(
    'test-player',
    'test-group',
    eventForwarder,
    stateProvider,
  );

  beforeAll(() => {
    stateProvider.getPlayer.mockImplementation(() => playerInstance);
  });

  afterAll(() => {
    stateProvider.getPlayer.mockClear();
  });

  describe('Ownership', () => {
    const ownerId = 'bob';
    const originalOwnerId = 'hank';

    const booster = new CGActiveBooster({
      ownerId,
      originalOwnerId,
      schema: standardBoosterSchema,
      attachedTimestamp: Date.now(),
      stateProvider,
    });

    it('Should expose the owner of the booster', () => {
      expect(booster.ownerId).toEqual(ownerId);
      expect(booster.getOwner()).toBeInstanceOf(CGPlayer);
    });

    it('Should expose the original owner of the booster', () => {
      expect(booster.givenById).toEqual(originalOwnerId);
      expect(booster.getOriginalOwner()).toBeInstanceOf(CGPlayer);
    });
  });

  describe('Timed Boosters', () => {
    it('should expose time left on the booster', () => {
      const startTime = 1000;
      const halfTime = startTime + timedBoosterSchema.timeActive / 2;
      const endTime = startTime + timedBoosterSchema.timeActive;

      jest.useFakeTimers();
      jest.setSystemTime(startTime);

      const booster = new CGActiveBooster({
        ownerId: 'bob',
        originalOwnerId: 'bob',
        schema: timedBoosterSchema,
        attachedTimestamp: Date.now(),
        stateProvider,
      });

      expect(booster.activeTimer).toBeInstanceOf(GameTimer);

      // Halfway
      jest.setSystemTime(halfTime);
      expect(booster.getNormalizedTime()).toEqual(0.5);

      // Full
      jest.setSystemTime(endTime);
      expect(booster.getNormalizedTime()).toEqual(1);
    });

    it('should not have a timer for untimed boosters', () => {
      const booster = new CGActiveBooster({
        ownerId: 'bob',
        originalOwnerId: 'bob',
        schema: standardBoosterSchema,
        attachedTimestamp: Date.now(),
        stateProvider,
      });

      expect(booster.activeTimer).toBeNull();
      expect(booster.getNormalizedTime()).toEqual(0);
    });
  });
});
