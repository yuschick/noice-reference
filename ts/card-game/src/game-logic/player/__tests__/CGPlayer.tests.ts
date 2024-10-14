/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { IMatchGroup } from '@noice-com/platform-client';
import { MockMatchGroup } from '@noice-com/platform-client/src/testing';
import * as GameLogic from '@noice-com/schemas/game-logic/game_logic.pb';

import { MockGameStateProvider } from '../../__mocks__/MockGameStateProvider';
import { MockBasicPlayer } from '../../__testdata__/players';
import { CGAvailableBooster } from '../../boosters';
import { DelegateEventForwarder } from '../../events';
import { GameConfig } from '../../game';
import { GameTimer } from '../../timer';
import { CGPlayer } from '../CGPlayer';

const eventForwarder = new DelegateEventForwarder();
const stateProvider = new MockGameStateProvider();
const PLAYER_ID = 'test-player-1';

const MockPlayer: GameLogic.Player = {
  ...MockBasicPlayer,
  userId: PLAYER_ID,
};

describe('CGPlayer', () => {
  afterEach(() => {
    eventForwarder.removeAllListeners();
  });

  it('should be able to init from an initial state', () => {
    const player = new CGPlayer(PLAYER_ID, 'test-group', eventForwarder, stateProvider);

    expect(player.score).toEqual(0);
    expect(player.activeCardID).toBeNull();
    expect(player.availableBoosterID).toBeNull();

    eventForwarder.emit(PLAYER_ID, 'onPlayerJoined', {
      player: {
        ...MockPlayer,
        points: 500,
        activeCard: {
          cardId: 'test-card|4',
        },
        cardSwitchOutTimer: {
          startTime: '123456',
          endTime: '123789',
        },
        hand: {
          cardIds: [
            'test-card|1',
            'test-card|2',
            'test-card|3',
            'test-card|4',
            'test-card|5',
          ],
          matchEndCardIds: ['match-card|1'],
        },
        heldBoosterId: 3,
      },
    });

    expect(player.score).toEqual(500);
    expect(player.activeCardID).toEqual('test-card|4');
    expect(player.availableBoosterID).toEqual(3);
    expect(player.switchoutTimer).toBeInstanceOf(GameTimer);
    expect(player.currentHand).toHaveLength(5);
    expect(player.availableMatchCards).toHaveLength(1);
    expect(player.nextReshuffleCost).toEqual(0);
  });

  describe('State management', () => {
    it('should set the player to connected/disconnected', () => {
      const player = new CGPlayer(PLAYER_ID, 'test-group', eventForwarder, stateProvider);

      eventForwarder.emit(PLAYER_ID, 'onPlayerJoined', {
        userId: PLAYER_ID,
        player: {
          ...MockPlayer,
          points: 500,
        },
      });

      expect(player.disconnected).toEqual(false);

      eventForwarder.emit(PLAYER_ID, 'onPlayerLeft', {
        userId: PLAYER_ID,
        permanent: false,
      });

      expect(player.disconnected).toEqual(true);
    });

    it('should keep track of player points', () => {
      const player = new CGPlayer(PLAYER_ID, 'test-group', eventForwarder, stateProvider);

      expect(player.score).toEqual(0);
      eventForwarder.emit(PLAYER_ID, 'onPlayerPointsUpdated', {
        userId: PLAYER_ID,
        points: 200,
      });
      expect(player.score).toEqual(200);
      eventForwarder.emit(PLAYER_ID, 'onPlayerPointsUpdated', {
        userId: PLAYER_ID,
        points: 364,
      });
      expect(player.score).toEqual(364);
    });

    it('should keep track of players card switchout timer', () => {
      const player = new CGPlayer(PLAYER_ID, 'test-group', eventForwarder, stateProvider);

      expect(player.switchoutTimer).toBeNull();
      expect(player.canChangeCard()).toEqual(true);
      expect(player.isSwitchoutReady).toEqual(false);

      eventForwarder.emit(PLAYER_ID, 'onPlayerJoined', {
        player: {
          ...MockPlayer,
          points: 500,
          activeCard: {
            cardId: 'test-card|4',
          },
        },
      });

      jest.useFakeTimers();
      const startTime = Date.now();
      const endTime = startTime + 30000;

      jest.setSystemTime(startTime);
      eventForwarder.emit(PLAYER_ID, 'onCardSwitchOutTimerStarted', {
        userId: PLAYER_ID,
        startTime: `${startTime}`,
        endTime: `${endTime}`,
      });

      expect(player.switchoutTimer).toBeInstanceOf(GameTimer);
      expect(player.switchoutTimer?.start).toEqual(startTime);
      expect(player.switchoutTimer?.end).toEqual(endTime);
      expect(player.canChangeCard()).toEqual(false);
      expect(player.isSwitchoutReady).toEqual(false);

      jest.setSystemTime(endTime + 5);
      eventForwarder.emit(PLAYER_ID, 'onCardSwitchOutAvailable', {
        userId: PLAYER_ID,
      });
      expect(player.isSwitchoutReady).toEqual(true);
      expect(player.canChangeCard()).toEqual(true);
    });

    it('should use config info to generate switchout timers when receiving partial data', () => {
      const player = new CGPlayer(PLAYER_ID, 'test-group', eventForwarder, stateProvider);

      const player2 = new CGPlayer(
        'player-2',
        'test-group',
        eventForwarder,
        stateProvider,
      );

      const testDuration = 300;
      const testConfig = new GameConfig({
        cardSwitchOutTimerDuration: `${testDuration}`,
      });

      const startTime = Date.now();
      const endTime = startTime + testDuration;

      stateProvider.getActiveConfig.mockImplementationOnce(() => testConfig);
      eventForwarder.emit(player.playerID, 'onCardSwitchOutTimerStarted', {
        userId: player.playerID,
        startTime: `${startTime}`,
      });

      expect(stateProvider.getActiveConfig).toHaveBeenCalled();
      expect(player.switchoutTimer).toBeInstanceOf(GameTimer);
      // Since server times are ignored and new Date.now() is used, let's just check that the start time is close enough
      expect(player.switchoutTimer!.start).toBeGreaterThanOrEqual(startTime);
      expect(player.switchoutTimer!.start).toBeLessThanOrEqual(startTime + 50);
      // Check that end was calculated correctly based on config testDuration
      expect(player.switchoutTimer!.end).toEqual(
        player.switchoutTimer!.start + testDuration,
      );

      stateProvider.getActiveConfig.mockReset();
      stateProvider.getActiveConfig.mockImplementationOnce(() => testConfig);
      eventForwarder.emit(player2.playerID, 'onCardSwitchOutTimerStarted', {
        userId: player2.playerID,
        endTime: `${endTime}`,
      });

      expect(stateProvider.getActiveConfig).toHaveBeenCalled();
      expect(player2.switchoutTimer).toBeInstanceOf(GameTimer);
      // Since server times are ignored and new Date.now() is used, let's just check that the end time is close enough
      expect(player2.switchoutTimer!.end).toBeGreaterThanOrEqual(startTime);
      expect(player2.switchoutTimer!.end).toBeLessThanOrEqual(startTime + 50);
      // Check that start was calculated correctly based on config testDuration
      expect(player2.switchoutTimer!.start).toEqual(
        player2.switchoutTimer!.end - testDuration,
      );
    });

    it('should store the current hand and available match cards', () => {
      const player = new CGPlayer(PLAYER_ID, 'test-group', eventForwarder, stateProvider);

      const expectedCardIds = ['1', '2', '3', '4', '5'];
      const expectedMatchCards = ['1', '2'];

      expect(player.currentHand).toHaveLength(0);
      expect(player.availableMatchCards).toHaveLength(0);
      expect(player.hasMatchCardsAvailable()).toEqual(false);
      eventForwarder.emit(player.playerID, 'onHandShuffled', {
        userId: player.playerID,
        cardIds: [...expectedCardIds],
        matchEndCardIds: [...expectedMatchCards],
      });
      expect(player.currentHand).toHaveLength(expectedCardIds.length);
      expect(player.currentHand).toEqual(expectedCardIds);
      expect(player.availableMatchCards).toHaveLength(expectedMatchCards.length);
      expect(player.availableMatchCards).toEqual(expectedMatchCards);
      expect(player.hasMatchCardsAvailable()).toEqual(true);
    });

    it('should expose if there are match cards available', () => {
      const player = new CGPlayer(PLAYER_ID, 'test-group', eventForwarder, stateProvider);

      const cardIds = ['1', '2', '3'];

      expect(player.hasMatchCardsAvailable()).toEqual(false);
      eventForwarder.emit(player.playerID, 'onHandShuffled', {
        userId: player.playerID,
        cardIds: [...cardIds],
        matchEndCardIds: [],
      });

      expect(player.hasMatchCardsAvailable()).toEqual(false);
      eventForwarder.emit(player.playerID, 'onHandShuffled', {
        userId: player.playerID,
        cardIds: [...cardIds],
        matchEndCardIds: [...cardIds],
      });

      expect(player.hasMatchCardsAvailable()).toEqual(true);
    });

    it('should expose how much the next reshuffle will cost', () => {
      const player = new CGPlayer(PLAYER_ID, 'test-group', eventForwarder, stateProvider);

      expect(player.nextReshuffleCost).toEqual(0);
      eventForwarder.emit(player.playerID, 'onReshuffleCostUpdated', {
        userId: player.playerID,
        nextReshuffleCost: 6,
      });

      expect(player.nextReshuffleCost).toEqual(6);
    });

    it('should keep track of players available booster and cooldown', () => {
      const player = new CGPlayer(PLAYER_ID, 'test-group', eventForwarder, stateProvider);

      stateProvider.getPlayerAvailableBooster.mockImplementationOnce(() => undefined);
      expect(player.nextBoosterTimer).toBeNull();

      eventForwarder.emit(PLAYER_ID, 'onPlayerJoined', {
        player: {
          ...MockPlayer,
          points: 500,
          activeCard: {
            cardId: 'test-card|4',
          },
        },
      });

      jest.useFakeTimers();
      const startTime = Date.now();
      const endTime = startTime + 30000;

      jest.setSystemTime(startTime);
      eventForwarder.emit(PLAYER_ID, 'onBoosterCooldownStarted', {
        userId: PLAYER_ID,
        startTime: `${startTime}`,
        endTime: `${endTime}`,
      });

      expect(player.nextBoosterTimer).toBeInstanceOf(GameTimer);
      expect(player.nextBoosterTimer?.start).toEqual(startTime);
      expect(player.nextBoosterTimer?.end).toEqual(endTime);

      jest.setSystemTime(endTime + 5);
      eventForwarder.emit(PLAYER_ID, 'onBoosterAvailable', {
        userId: PLAYER_ID,
        boosterId: 3,
      });
      expect(player.nextBoosterTimer).toBeNull();
      expect(player.availableBoosterID).toEqual(3);
    });

    it('should keep track of the players inactivity timer', () => {
      const player = new CGPlayer(PLAYER_ID, 'test-group', eventForwarder, stateProvider);

      expect(player.secondsToInactivityKick).toEqual(-1);
      expect(player.hasInactivityWarning).toEqual(false);
      expect(player.isInactivtyKickPaused).toEqual(false);

      eventForwarder.emit(PLAYER_ID, 'onInactivityTimerUpdated', {
        userId: PLAYER_ID,
        secondsRemaining: 30,
      });

      expect(player.secondsToInactivityKick).toEqual(30);
      expect(player.hasInactivityWarning).toEqual(true);
      expect(player.isInactivtyKickPaused).toEqual(false);

      eventForwarder.emit(PLAYER_ID, 'onMatchEnded', {});

      expect(player.secondsToInactivityKick).toEqual(30);
      expect(player.hasInactivityWarning).toEqual(true);
      expect(player.isInactivtyKickPaused).toEqual(true);

      eventForwarder.emit(PLAYER_ID, 'onMatchStarted', {});

      expect(player.secondsToInactivityKick).toEqual(30);
      expect(player.hasInactivityWarning).toEqual(true);
      expect(player.isInactivtyKickPaused).toEqual(false);

      eventForwarder.emit(PLAYER_ID, 'onInactivityTimerCancelled', {
        userId: PLAYER_ID,
      });

      expect(player.secondsToInactivityKick).toEqual(-1);
      expect(player.hasInactivityWarning).toEqual(false);
      expect(player.isInactivtyKickPaused).toEqual(false);

      eventForwarder.emit(PLAYER_ID, 'onInactivityTimerUpdated', {
        userId: PLAYER_ID,
        secondsRemaining: 30,
      });

      expect(player.secondsToInactivityKick).toEqual(30);
      expect(player.hasInactivityWarning).toEqual(true);

      eventForwarder.emit(PLAYER_ID, 'onInactivityKickReceived', {
        userId: PLAYER_ID,
      });

      expect(player.secondsToInactivityKick).toEqual(-1);
      expect(player.hasInactivityWarning).toEqual(false);
      expect(player.disconnected).toEqual(true);
    });
  });

  describe('Event emission', () => {
    it('should emit an event when the players points change', () => {
      const player = new CGPlayer(PLAYER_ID, 'test-group', eventForwarder, stateProvider);

      const listener = jest.fn();
      player.addListener('onScoreUpdated', listener);

      eventForwarder.emit(PLAYER_ID, 'onPlayerPointsUpdated', {
        userId: PLAYER_ID,
        points: 300,
      });
      expect(listener).toHaveBeenCalledWith({ scoreTotal: 300 });
    });

    it('should emit an event when the players card changes', () => {
      const player = new CGPlayer(PLAYER_ID, 'test-group', eventForwarder, stateProvider);

      const listener = jest.fn();
      player.addListener('onCardSelected', listener);

      eventForwarder.emit(PLAYER_ID, 'onActiveCardSet', {
        userId: PLAYER_ID,
        cardId: 'test-card',
        pointsUpdateDuration: '5000',
      });

      expect(listener).toHaveBeenCalledWith({ cardId: 'test-card' });
    });

    it('should emit an event when the player is removed', () => {
      const permanentLeaver = new CGPlayer(
        PLAYER_ID,
        'test-group',
        eventForwarder,
        stateProvider,
      );

      const permanentListener = jest.fn();
      permanentLeaver.addListener('onRemoved', permanentListener);

      const tempLeaver = new CGPlayer(
        'temporary-leaver',
        'test-group',
        eventForwarder,
        stateProvider,
      );

      const tempListener = jest.fn();
      tempLeaver.addListener('onRemoved', tempListener);

      eventForwarder.emit(PLAYER_ID, 'onPlayerLeft', {
        userId: PLAYER_ID,
        permanent: true,
        groupId: permanentLeaver.groupID,
      });
      expect(permanentListener).toHaveBeenCalledWith({ isPermanent: true });

      eventForwarder.emit(tempLeaver.playerID, 'onPlayerLeft', {
        userId: tempLeaver.playerID,
        permanent: false,
        groupId: tempLeaver.groupID,
      });
    });

    it('should emit an event when a card switchout timer starts and completes', () => {
      const player = new CGPlayer(PLAYER_ID, 'test-group', eventForwarder, stateProvider);

      const listener = jest.fn();
      player.addListener('onSwitchoutTimer', listener);
      player.addListener('onSwitchoutReady', listener);

      eventForwarder.emit(PLAYER_ID, 'onCardSwitchOutTimerStarted', {
        userId: PLAYER_ID,
        startTime: `${Date.now()}`,
        endTime: `${Date.now() + 30000}`,
      });

      expect(listener).toHaveBeenCalledTimes(1);

      eventForwarder.emit(PLAYER_ID, 'onCardSwitchOutAvailable', {
        userId: PLAYER_ID,
      });

      expect(listener).toHaveBeenCalledTimes(2);
    });

    it('should emit an event when the hand is shuffled', () => {
      const player = new CGPlayer(PLAYER_ID, 'test-group', eventForwarder, stateProvider);

      const expectedCardIds = ['1', '2', '3', '4', '5'];
      const expectedMatchCards = ['1', '2'];
      const listener = jest.fn();

      player.addListener('onHandShuffled', listener);
      eventForwarder.emit(player.playerID, 'onHandShuffled', {
        userId: player.playerID,
        cardIds: [...expectedCardIds],
        matchEndCardIds: [...expectedMatchCards],
      });

      expect(listener).toHaveBeenCalledWith({
        cardIds: expectedCardIds,
        matchCardIds: expectedMatchCards,
      });
    });

    it('should emit an event when the reshuffle cost updates', () => {
      const player = new CGPlayer(PLAYER_ID, 'test-group', eventForwarder, stateProvider);

      const listener = jest.fn();
      player.addListener('onReshuffleCostUpdated', listener);
      eventForwarder.emit(player.playerID, 'onReshuffleCostUpdated', {
        userId: player.playerID,
        nextReshuffleCost: 6,
      });

      expect(listener).toHaveBeenCalledWith({ nextReshuffleCost: 6 });
    });

    it('should emit an event when a booster is available and the cooldown starts', () => {
      const player = new CGPlayer(PLAYER_ID, 'test-group', eventForwarder, stateProvider);

      const listener = jest.fn();
      player.addListener('onBoosterAvailable', listener);
      player.addListener('onBoosterCooldownTimer', listener);

      eventForwarder.emit(PLAYER_ID, 'onBoosterCooldownStarted', {
        userId: PLAYER_ID,
        startTime: `${Date.now()}`,
        endTime: `${Date.now() + 30000}`,
      });

      expect(listener).toHaveBeenCalledTimes(1);

      stateProvider.getPlayerAvailableBooster.mockImplementationOnce(
        (playerId) =>
          new CGAvailableBooster(
            {
              id: 3,
              canTargetSelf: false,
            },
            {
              owner: playerId,
              eventForwarder,
              stateProvider,
            },
          ),
      );
      eventForwarder.emit(PLAYER_ID, 'onBoosterAvailable', {
        userId: PLAYER_ID,
        boosterId: 3,
      });

      expect(listener).toHaveBeenCalledTimes(2);
    });

    it('should emit an event when entering booster apply mode', () => {
      const player = new CGPlayer(
        MockPlayer.userId!,
        'test-group',
        eventForwarder,
        stateProvider,
      );

      eventForwarder.emit(PLAYER_ID, 'onPlayerJoined', {
        player: {
          ...MockPlayer,
          points: 300,
          activeCard: {
            cardId: 'test-card|4',
          },
          heldBoosterId: 3,
        },
      });

      const listener = jest.fn();
      player.addListener('onApplyingBooster', listener);

      const boosterInstance = new CGAvailableBooster(
        { id: 3, canTargetSelf: true },
        {
          owner: MockPlayer.userId!,
          isOwnedLocally: true,
          requests: [],
          stateProvider,
          eventForwarder,
        },
      );

      stateProvider.getPlayerAvailableBooster.mockImplementation(() => boosterInstance);

      player.toggleBoosterApply(true);
      expect(listener).toHaveBeenLastCalledWith({
        isApplying: true,
        booster: boosterInstance,
      });
      player.toggleBoosterApply(false);
      expect(listener).toHaveBeenLastCalledWith({
        isApplying: false,
        booster: boosterInstance,
      });

      stateProvider.getPlayerAvailableBooster.mockClear();
    });

    it('should emit an event when the match bonus is received', () => {
      const player = new CGPlayer(PLAYER_ID, 'test-group', eventForwarder, stateProvider);

      const listener = jest.fn();
      player.addListener('onMatchBonusReceived', listener);
      const msg = {
        userId: player.playerID,
        points: 2000,
        bonusType: GameLogic.MatchBonusType.MATCH_BONUS_TYPE_VICTORY_ROYAL,
      };
      eventForwarder.emit(player.playerID, 'onMatchBonusReceived', msg);

      expect(listener).toHaveBeenCalledWith({
        points: msg.points,
        bonusType: msg.bonusType,
      });
    });

    it('should emit events for inactivity timer updates', () => {
      const player = new CGPlayer(PLAYER_ID, 'test-group', eventForwarder, stateProvider);

      // Verify the generic warning event
      const warningListener = jest.fn();
      player.addListener('onInactivityWarning', warningListener);
      eventForwarder.emit(PLAYER_ID, 'onInactivityTimerUpdated', {
        userId: PLAYER_ID,
        secondsRemaining: 45,
      });

      expect(warningListener).toHaveBeenCalledTimes(1);
      expect(warningListener).toHaveBeenCalledWith({ secondsRemaining: 45 });

      // Verify cancelling
      const cancelledListener = jest.fn();
      player.addListener('onInactivtyKickCancelled', cancelledListener);
      eventForwarder.emit(PLAYER_ID, 'onInactivityTimerCancelled', {
        userId: PLAYER_ID,
      });
      expect(cancelledListener).toHaveBeenCalledTimes(1);

      // Verify pausing on match end
      eventForwarder.emit(PLAYER_ID, 'onInactivityTimerUpdated', {
        userId: PLAYER_ID,
        secondsRemaining: 45,
      });
      expect(warningListener).toHaveBeenCalledTimes(2);

      const pausedListener = jest.fn();
      player.addListener('onInactivityKickPaused', pausedListener);
      eventForwarder.emit(PLAYER_ID, 'onMatchEnded', {});
      expect(pausedListener).toHaveBeenCalledTimes(1);

      // Verify resuming on match start + actual kicking
      const kickedListener = jest.fn();
      player.addListener('onInactivityKick', kickedListener);

      eventForwarder.emit(PLAYER_ID, 'onMatchStarted', {});
      eventForwarder.emit(PLAYER_ID, 'onInactivityTimerUpdated', {
        userId: PLAYER_ID,
        secondsRemaining: 25,
      });
      expect(warningListener).toHaveBeenCalledTimes(3);
      eventForwarder.emit(PLAYER_ID, 'onInactivityKickReceived', {
        userId: PLAYER_ID,
      });
      expect(kickedListener).toHaveBeenCalledTimes(1);
    });
  });

  describe('Player actions', () => {
    let mockContext: MockMatchGroup;
    let requestHandRef: jest.MockedFunction<IMatchGroup['requestHand']>;
    let shuffleHandRef: jest.MockedFunction<IMatchGroup['shuffleHand']>;
    let setActiveCardRef: jest.MockedFunction<IMatchGroup['setActiveCard']>;

    beforeAll(() => {
      MockMatchGroup.MockFactory = jest.fn;
      mockContext = new MockMatchGroup('test-group', PLAYER_ID);

      requestHandRef = mockContext.requestHand as jest.MockedFunction<
        IMatchGroup['requestHand']
      >;
      shuffleHandRef = mockContext.shuffleHand as jest.MockedFunction<
        IMatchGroup['shuffleHand']
      >;
      setActiveCardRef = mockContext.setActiveCard as jest.MockedFunction<
        IMatchGroup['setActiveCard']
      >;

      stateProvider.getMatchConnection.mockImplementation(() => mockContext);
    });

    afterAll(() => {
      MockMatchGroup.MockFactory = MockMatchGroup.DefaultMockMethod;
      stateProvider.getMatchConnection.mockClear();
    });

    it('requestHand should call shuffleHand or requestHand based on args', async () => {
      const player = new CGPlayer(
        PLAYER_ID,
        mockContext.groupId,
        eventForwarder,
        stateProvider,
      );

      expect(requestHandRef).toBeCalledTimes(0);
      await player.requestHand(false);
      expect(requestHandRef).toBeCalledTimes(1);

      expect(mockContext.shuffleHand).toBeCalledTimes(0);
      await player.requestHand(true);
      expect(mockContext.shuffleHand).toBeCalledTimes(1);

      requestHandRef.mockClear();
      shuffleHandRef.mockClear();
    });

    it('setActiveCard should call context setActiveCard', async () => {
      const player = new CGPlayer(
        PLAYER_ID,
        mockContext.groupId,
        eventForwarder,
        stateProvider,
      );

      expect(setActiveCardRef).toBeCalledTimes(0);
      await player.setActiveCard('99');
      expect(setActiveCardRef).toBeCalledTimes(1);

      requestHandRef.mockClear();
      shuffleHandRef.mockClear();
    });

    it('toggleBoosterApply should trigger booster apply if a booster exists', async () => {
      const player = new CGPlayer(
        MockPlayer.userId!,
        mockContext.groupId,
        eventForwarder,
        stateProvider,
      );

      eventForwarder.emit(PLAYER_ID, 'onPlayerJoined', {
        player: {
          ...MockPlayer,
          points: 300,
          activeCard: {
            cardId: 'test-card|4',
          },
          heldBoosterId: 3,
        },
      });

      stateProvider.getPlayerAvailableBooster.mockImplementationOnce((_id) => undefined);

      expect(player.toggleBoosterApply(true)).toEqual(false);
      expect(player.isApplyingBooster).toEqual(false);

      stateProvider.getPlayerAvailableBooster.mockImplementationOnce(
        (id) =>
          new CGAvailableBooster(
            { id: 3, canTargetSelf: true },
            {
              owner: id,
              isOwnedLocally: true,
              requests: [],
              stateProvider,
              eventForwarder,
            },
          ),
      );

      expect(player.toggleBoosterApply(true)).toEqual(true);
      expect(player.isApplyingBooster).toEqual(true);
    });
  });
});
