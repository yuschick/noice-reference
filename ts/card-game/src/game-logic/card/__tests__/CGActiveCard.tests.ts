/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ActiveCardFailedMsgReason } from '@noice-com/schemas/game-logic/game_logic.pb';

import { MockGameStateProvider } from '../../__mocks__/MockGameStateProvider';
import * as MockCards from '../../__testdata__/active-cards';
import { boosterAsActiveFragment, StandardBooster } from '../../__testdata__/boosters';
import { CGActiveBooster } from '../../boosters';
import { DelegateEventForwarder } from '../../events';
import { CGActiveCard } from '../CGActiveCard';

describe('CGActiveCard', () => {
  const mockOwnerId = 'GalaxyBrainPredictionsOy';
  const eventForwarder = new DelegateEventForwarder();
  const stateProvider = new MockGameStateProvider();

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  afterEach(() => {
    eventForwarder.removeAllListeners();
  });

  describe('Intialization', () => {
    it('should use obviously incorrect defaults for missing fields', () => {
      const card = new CGActiveCard(
        'partial-card',
        mockOwnerId,
        eventForwarder,
        stateProvider,
        {},
      );
      expect(card.currentPoints).toEqual(-1);
      expect(card.maxPoints).toEqual(-1);
      expect(card.pointsUpdateTimer).toBeNull();
      expect(card.currentTargetValue).toBeNull();
      expect(card.currentTargetValues).toBeNull();
    });

    it('should use initial state if it exists', () => {
      const card = new CGActiveCard(
        MockCards.BasicCard.cardId!,
        mockOwnerId,
        eventForwarder,
        stateProvider,
        {
          ...MockCards.BasicCard,
        },
      );

      expect(card.currentPoints).toEqual(MockCards.BasicCard.points);
      expect(card.maxPoints).toEqual(MockCards.BasicCard.pointsMax);
      expect(card.pointsUpdateTimer).toBeDefined();
      expect(card.currentTargetValue).toEqual(MockCards.BasicCard.targetValue);
      expect(card.currentTargetValues).toEqual([
        { label: 'targetValue', value: MockCards.BasicCard.targetValue },
        { label: 'timerDuration', value: MockCards.BasicCard.timerDuration },
      ]);
    });
  });

  describe('State', () => {
    it('should keep track of the cards potential points and point update timer', () => {
      const card = new CGActiveCard(
        MockCards.BasicCard.cardId!,
        mockOwnerId,
        eventForwarder,
        stateProvider,
        {
          ...MockCards.BasicCard,
          points: 100,
        },
      );

      const updateTime = 5000;
      const start = Date.now();
      jest.setSystemTime(start);

      // Before event...
      expect(card.currentPoints).toEqual(100);
      eventForwarder.emit(mockOwnerId, 'onActiveCardPointsUpdated', {
        userId: mockOwnerId,
        cardId: MockCards.BasicCard.cardId,
        points: 125,
        pointsUpdateDuration: `${updateTime}`,
      });

      // After event...
      expect(card.currentPoints).toEqual(125);
      expect(card.pointsUpdateTimer).toBeDefined();
      expect(card.pointsUpdateTimer!.start).toEqual(start);
      expect(card.pointsUpdateTimer!.end).toEqual(start + updateTime);
    });

    it('should keep track of dynamic cards current dynamic value', () => {
      const card = new CGActiveCard(
        MockCards.DynamicValueCard.cardId!,
        mockOwnerId,
        eventForwarder,
        stateProvider,
        {
          ...MockCards.DynamicValueCard,
        },
      );
      const listener = jest.fn();

      const cardDiff = 20;
      const nextTarget = MockCards.DynamicValueCard.targetValue! + cardDiff;

      card.addListener('onTargetValueChanged', listener);

      // Before event...
      expect(card.currentTargetValue).toEqual(MockCards.DynamicValueCard.targetValue!);
      eventForwarder.emit(mockOwnerId, 'onActiveCardTargetValueChanged', {
        userId: mockOwnerId,
        cardId: MockCards.DynamicValueCard.cardId!,
        targetValue: nextTarget,
        targetValues: {
          targetValue: nextTarget,
        },
      });

      expect(card.currentTargetValue).toEqual(nextTarget);
      expect(listener).toHaveBeenCalledWith({
        targetValue: nextTarget,
        targetValues: [{ label: 'targetValue', value: nextTarget }],
        timerDuration: null,
      });
    });

    it('should keep track of timed cards current countdown', () => {
      const card = new CGActiveCard(
        MockCards.TimedCard.cardId!,
        mockOwnerId,
        eventForwarder,
        stateProvider,
        {
          ...MockCards.TimedCard,
        },
      );
      const listener = jest.fn();

      const durationDiff = 5;
      const nextDuration = MockCards.TimedCard.timerDuration! - durationDiff;

      card.addListener('onTargetValueChanged', listener);

      // Before event...
      expect(card.currentTimerDuration).toEqual(MockCards.TimedCard.timerDuration!);
      eventForwarder.emit(mockOwnerId, 'onActiveCardTargetValueChanged', {
        userId: mockOwnerId,
        cardId: MockCards.TimedCard.cardId!,
        targetValue: MockCards.TimedCard.targetValue,
        timerDuration: nextDuration,
        targetValues: {
          targetValue: MockCards.TimedCard.targetValue!,
          timerDuration: nextDuration,
        },
      });

      expect(card.currentTimerDuration).toEqual(nextDuration);
      expect(listener).toHaveBeenCalledWith({
        targetValue: MockCards.TimedCard.targetValue!,
        timerDuration: nextDuration,
        targetValues: [
          { label: 'targetValue', value: MockCards.TimedCard.targetValue! },
          { label: 'timerDuration', value: nextDuration },
        ],
      });
    });
  });

  describe('Event emission', () => {
    it('should emit an event when points change', () => {
      const initialPoints = 125;
      const nextPoints = 200;
      const nextPointsDelay = 5000;

      // Create card
      const card = new CGActiveCard(
        MockCards.BasicCard.cardId!,
        mockOwnerId,
        eventForwarder,
        stateProvider,
        {
          ...MockCards.BasicCard,
          points: initialPoints,
        },
      );

      // Add listener
      const listener = jest.fn();
      card.addListener('onPointsUpdated', listener);

      // Emit server event
      eventForwarder.emit(mockOwnerId, 'onActiveCardPointsUpdated', {
        userId: mockOwnerId,
        cardId: MockCards.BasicCard.cardId,
        points: nextPoints,
        pointsUpdateDuration: `${nextPointsDelay}`,
      });

      // Make sure listener has been called
      // NOTE: We don't do a strict check because the `GameTimer` gets created internally
      // therefore we cannot really do an equality check.
      expect(listener).toHaveBeenCalled();
    });

    it('should emit an event when the target value or timer changes', () => {
      const card = new CGActiveCard(
        MockCards.TimedCard.cardId!,
        mockOwnerId,
        eventForwarder,
        stateProvider,
        {
          ...MockCards.TimedCard,
        },
      );
      const listener = jest.fn();

      const targetDiff = 5;
      const nextTarget = MockCards.TimedCard.targetValue! + targetDiff;
      const durationDiff = 1;
      const nextDuration = MockCards.TimedCard.timerDuration! - durationDiff;

      card.addListener('onTargetValueChanged', listener);

      eventForwarder.emit(mockOwnerId, 'onActiveCardTargetValueChanged', {
        userId: mockOwnerId,
        cardId: MockCards.TimedCard.cardId!,
        targetValue: nextTarget,
        timerDuration: nextDuration,
        targetValues: {
          targetValue: nextTarget,
          timerDuration: nextDuration,
        },
      });

      expect(listener).toHaveBeenCalledWith({
        targetValue: nextTarget,
        timerDuration: nextDuration,
        targetValues: [
          { label: 'targetValue', value: nextTarget },
          { label: 'timerDuration', value: nextDuration },
        ],
      });
    });

    it('should emit an event when it is switched out', () => {
      const card = new CGActiveCard(
        MockCards.BasicCard.cardId!,
        mockOwnerId,
        eventForwarder,
        stateProvider,
        {
          ...MockCards.BasicCard,
        },
      );

      const listener = jest.fn();
      card.addListener('onSwitchedOut', listener);

      eventForwarder.emit(mockOwnerId, 'onActiveCardSet', {
        userId: mockOwnerId,
        cardId: MockCards.DynamicValueCard.cardId!,
        pointsUpdateDuration: '5000',
      });
      expect(listener).toHaveBeenCalled();
    });

    it('should emit an event when it succeeds', () => {
      const card = new CGActiveCard(
        MockCards.BasicCard.cardId!,
        mockOwnerId,
        eventForwarder,
        stateProvider,
        {
          ...MockCards.BasicCard,
        },
      );

      const listener = jest.fn();
      card.addListener('onSucceeded', listener);

      eventForwarder.emit(mockOwnerId, 'onActiveCardSucceeded', {
        userId: mockOwnerId,
        cardId: MockCards.BasicCard.cardId!,
        points: card.currentPoints,
      });
      expect(listener).toHaveBeenCalled();
    });

    it('should emit an event when it fails', () => {
      const card = new CGActiveCard(
        MockCards.BasicCard.cardId!,
        mockOwnerId,
        eventForwarder,
        stateProvider,
        {
          ...MockCards.BasicCard,
        },
      );

      const listener = jest.fn();
      card.addListener('onFailed', listener);

      eventForwarder.emit(mockOwnerId, 'onActiveCardFailed', {
        userId: mockOwnerId,
        cardId: MockCards.BasicCard.cardId!,
        reason: ActiveCardFailedMsgReason.REASON_CARD_FAILED,
      });
      expect(listener).toHaveBeenCalled();
    });
  });

  describe('Active Booster tracking', () => {
    beforeEach(() => {
      stateProvider.getActiveBooster.mockImplementation(
        () =>
          new CGActiveBooster({
            ownerId: mockOwnerId,
            originalOwnerId: mockOwnerId,
            schema: boosterAsActiveFragment(StandardBooster),
            attachedTimestamp: Date.now(),
            stateProvider,
          }),
      );
    });

    afterEach(() => {
      stateProvider.getActiveBooster.mockClear();
    });

    it('should track active boosters on the card', () => {
      const card = new CGActiveCard(
        MockCards.BasicCard.cardId!,
        mockOwnerId,
        eventForwarder,
        stateProvider,
        {
          ...MockCards.BasicCard,
        },
      );

      const listener = jest.fn();
      card.addListener('onBoosterAdded', listener);

      eventForwarder.emit(mockOwnerId, 'onBoosterUsed', {
        boosterId: 3,
        userId: 'bob',
        targetUserId: mockOwnerId,
      });

      // Make sure the event gets triggered
      expect(listener).toHaveBeenCalled();

      // Make sure the booster has been stored by validating that the state provider
      // gets called with the correct booster owner ID
      expect(card.getActiveBoosters()).toHaveLength(1);
      expect(stateProvider.getActiveBooster).toHaveBeenCalledWith(mockOwnerId, 'bob');
    });

    it('should track when an active booster is removed', () => {
      const card = new CGActiveCard(
        MockCards.BasicCard.cardId!,
        mockOwnerId,
        eventForwarder,
        stateProvider,
        {
          ...MockCards.BasicCard,
        },
      );

      const listener = jest.fn();
      card.addListener('onBoosterRemoved', listener);

      eventForwarder.emit(mockOwnerId, 'onBoosterUsed', {
        boosterId: 3,
        userId: 'bob',
        targetUserId: mockOwnerId,
      });

      // Make sure the event gets triggered
      expect(listener).not.toHaveBeenCalled();

      // Make sure the booster has been stored by validating that the state provider
      // gets called with the correct booster owner ID
      expect(card.getActiveBoosters()).toHaveLength(1);
      expect(stateProvider.getActiveBooster).toHaveBeenCalledWith(mockOwnerId, 'bob');

      eventForwarder.emit(mockOwnerId, 'onBoosterRemoved', {
        targetUserId: mockOwnerId,
        activatorUserId: 'bob',
      });

      // Make sure the event gets triggered
      expect(listener).toHaveBeenCalled();

      // Make sure the booster has been stored by validating that the state provider
      // gets called with the correct booster owner ID
      expect(card.getActiveBoosters()).toHaveLength(0);
    });

    it('should track when an active booster is replaced', () => {
      const card = new CGActiveCard(
        MockCards.BasicCard.cardId!,
        mockOwnerId,
        eventForwarder,
        stateProvider,
        {
          ...MockCards.BasicCard,
        },
      );

      const listener = jest.fn();
      card.addListener('onBoosterReplaced', listener);

      eventForwarder.emit(mockOwnerId, 'onBoosterUsed', {
        boosterId: 3,
        userId: 'bob',
        targetUserId: mockOwnerId,
      });

      // Make sure the event gets triggered
      expect(listener).not.toHaveBeenCalled();

      // Make sure the booster has been stored by validating that the state provider
      // gets called with the correct booster owner ID
      expect(card.getActiveBoosters()).toHaveLength(1);
      expect(stateProvider.getActiveBooster).toHaveBeenCalledWith(mockOwnerId, 'bob');

      eventForwarder.emit(mockOwnerId, 'onBoosterUsed', {
        boosterId: 5,
        userId: 'bob',
        targetUserId: mockOwnerId,
      });

      // Make sure the event gets triggered
      expect(listener).toHaveBeenCalled();

      // Make sure the booster has been stored by validating that the state provider
      // gets called with the correct booster owner ID
      expect(card.getActiveBoosters()).toHaveLength(1);
      expect(stateProvider.getActiveBooster).toHaveBeenCalledWith(mockOwnerId, 'bob');
    });
  });

  describe('Completed cards (succeeded/failed)', () => {
    it('should no longer update when locked', () => {
      // Create card
      const card = new CGActiveCard(
        MockCards.BasicCard.cardId!,
        mockOwnerId,
        eventForwarder,
        stateProvider,
        {
          ...MockCards.BasicCard,
          points: 100,
        },
      );

      // Add listener
      const listener = jest.fn();
      card.addListener('onPointsUpdated', listener);

      // Freeze the card.
      card.freeze();

      eventForwarder.emit(mockOwnerId, 'onActiveCardPointsUpdated', {
        userId: mockOwnerId,
        cardId: MockCards.BasicCard.cardId,
        points: 150,
        pointsUpdateDuration: `${5000}`,
      });

      expect(listener).not.toBeCalled();
      expect(card.currentPoints).toEqual(100);

      card.unfreeze();

      eventForwarder.emit(mockOwnerId, 'onActiveCardPointsUpdated', {
        userId: mockOwnerId,
        cardId: MockCards.BasicCard.cardId,
        points: 150,
        pointsUpdateDuration: `${5000}`,
      });

      expect(listener).toBeCalled();
      expect(card.currentPoints).toEqual(150);
    });

    it('should freeze automatically when succeeding', () => {
      // Create card
      const card = new CGActiveCard(
        MockCards.BasicCard.cardId!,
        mockOwnerId,
        eventForwarder,
        stateProvider,
        {
          ...MockCards.BasicCard,
          points: 100,
        },
      );

      expect(card.frozen).toEqual(false);

      eventForwarder.emit(mockOwnerId, 'onActiveCardSucceeded', {
        userId: mockOwnerId,
        cardId: MockCards.BasicCard.cardId,
        points: 150,
      });

      expect(card.currentPoints).toEqual(150);
      expect(card.frozen).toEqual(true);
    });

    it('should freeze automatically when failing', () => {
      // Create card
      const card = new CGActiveCard(
        MockCards.BasicCard.cardId!,
        mockOwnerId,
        eventForwarder,
        stateProvider,
        {
          ...MockCards.BasicCard,
          points: 100,
        },
      );

      expect(card.frozen).toEqual(false);

      eventForwarder.emit(mockOwnerId, 'onActiveCardFailed', {
        userId: mockOwnerId,
        cardId: MockCards.BasicCard.cardId,
        reason: ActiveCardFailedMsgReason.REASON_CARD_FAILED,
      });

      expect(card.frozen).toEqual(true);
    });

    it('should freeze automatically when being replaced', () => {
      // Create card
      const card = new CGActiveCard(
        MockCards.BasicCard.cardId!,
        mockOwnerId,
        eventForwarder,
        stateProvider,
        {
          ...MockCards.BasicCard,
          points: 100,
        },
      );

      expect(card.frozen).toEqual(false);

      eventForwarder.emit(mockOwnerId, 'onActiveCardSet', {
        userId: mockOwnerId,
        cardId: 'another-card-id',
        pointsUpdateDuration: `5000`,
      });

      expect(card.frozen).toEqual(true);
    });
  });
});
