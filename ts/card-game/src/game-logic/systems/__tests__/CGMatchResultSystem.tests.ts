/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as Schemas from '@noice-com/schemas/game-logic/game_logic.pb';

import { CGMatchResultSystem } from '../CGMatchResultSystem';

import { MockGameStateProvider } from '@game-logic/__mocks__/MockGameStateProvider';
import { DelegateEventForwarder } from '@game-logic/events';

const eventForwarder = new DelegateEventForwarder();
const stateProvider = new MockGameStateProvider();
const LOCAL_PLAYER_ID = 'test-local-player-id';
const LOCAL_GROUP_ID = 'test-local-group-id';

const localPlayerData: Schemas.Player = {
  userId: LOCAL_PLAYER_ID,
  points: 1000,
  name: 'Local Player',
};

const teammatePlayerData: Schemas.Player = {
  userId: 'test-teammate-player-id',
  points: 500,
  name: 'Teammate Player',
};

const bestGroupDetails: Schemas.GroupDetails = {
  group: {
    id: LOCAL_GROUP_ID,
    name: 'Group Name',
    points: 1500,
    isParty: false,
    isSolo: true,
  },
  players: [localPlayerData, teammatePlayerData],
};

const bestPlayerDetails: Schemas.PlayerDetails = {
  ...localPlayerData,
};

const bestCardDetails: Schemas.CardDetails = {
  groupName: bestGroupDetails.group?.name,
  succeedingCard: {
    cardId: 'example-card',
    points: 500,
    userId: localPlayerData.userId,
  },
};

describe('CGMatchResultSystem', () => {
  afterEach(() => {
    eventForwarder.removeAllListeners();
  });

  it('should emit the match results when a match ends', (done) => {
    const system = new CGMatchResultSystem(
      LOCAL_PLAYER_ID,
      eventForwarder,
      stateProvider,
    );

    const listener = jest.fn();
    system.addListener('onMatchResultsAvailable', listener);
    expect(system.matchResults).toBeNull();

    eventForwarder.emit(LOCAL_PLAYER_ID, 'onMatchEnded', {
      matchId: 'test-match-id',
      groupId: LOCAL_GROUP_ID,
      group: bestGroupDetails.group,
      bestGroup: bestGroupDetails,
      players: [localPlayerData, teammatePlayerData],
      bestCard: bestCardDetails,
      bestPlayer: bestPlayerDetails,
    });

    // The event waits 1 tick before emitting due to a timeout
    setTimeout(() => {
      expect(listener).toHaveBeenCalledTimes(1);
      expect(system.matchResults).not.toBeNull();
      done();
    }, 5);
  });

  it('should delay match end if a victory royale bonus occurs', (done) => {
    const system = new CGMatchResultSystem(
      LOCAL_PLAYER_ID,
      eventForwarder,
      stateProvider,
    );

    const listener = jest.fn();
    system.addListener('onMatchResultsAvailable', listener);
    expect(system.matchResults).toBeNull();

    eventForwarder.emit(teammatePlayerData.userId!, 'onMatchBonusReceived', {
      userId: teammatePlayerData.userId!,
      bonusType: Schemas.MatchBonusType.MATCH_BONUS_TYPE_VICTORY_ROYAL,
    });

    eventForwarder.emit(LOCAL_PLAYER_ID, 'onMatchEnded', {
      matchId: 'test-match-id',
      groupId: LOCAL_GROUP_ID,
      group: bestGroupDetails.group,
      bestGroup: bestGroupDetails,
      players: [localPlayerData, teammatePlayerData],
      bestCard: bestCardDetails,
      bestPlayer: bestPlayerDetails,
    });

    expect(listener).not.toHaveBeenCalled();
    expect(system.matchResults).not.toBeNull();

    setTimeout(() => {
      expect(listener).toHaveBeenCalledTimes(1);
      expect(system.matchResults).not.toBeNull();
      done();
    }, CGMatchResultSystem.VictoryRoyaleDelay);
  });

  it('should put the local player first in the match results', () => {
    const system = new CGMatchResultSystem(
      LOCAL_PLAYER_ID,
      eventForwarder,
      stateProvider,
    );

    const listener = jest.fn();
    system.addListener('onMatchResultsAvailable', listener);
    expect(system.matchResults).toBeNull();

    eventForwarder.emit(LOCAL_PLAYER_ID, 'onMatchEnded', {
      matchId: 'test-match-id',
      groupId: LOCAL_GROUP_ID,
      group: bestGroupDetails.group,
      bestGroup: bestGroupDetails,
      players: [teammatePlayerData, localPlayerData],
      bestCard: bestCardDetails,
      bestPlayer: bestPlayerDetails,
    });

    // The event waits 1 tick before emitting due to a timeout
    setTimeout(() => {
      expect(listener).toHaveBeenCalledTimes(1);
      expect(system.matchResults).not.toBeNull();

      const results = system.matchResults!;
      expect(results!.players![0].userId).toEqual(LOCAL_PLAYER_ID);
      expect(results!.players![1].userId).toEqual(teammatePlayerData.userId);
    }, 5);
  });

  it('should clear the match results when a new match starts', () => {
    const system = new CGMatchResultSystem(
      LOCAL_PLAYER_ID,
      eventForwarder,
      stateProvider,
    );

    const listener = jest.fn();
    system.addListener('onMatchResultsCleared', listener);
    expect(system.matchResults).toBeNull();

    eventForwarder.emit(LOCAL_PLAYER_ID, 'onMatchEnded', {
      matchId: 'test-match-id',
      groupId: LOCAL_GROUP_ID,
      group: bestGroupDetails.group,
      bestGroup: bestGroupDetails,
      players: [localPlayerData, teammatePlayerData],
      bestCard: bestCardDetails,
      bestPlayer: bestPlayerDetails,
    });

    expect(listener).not.toHaveBeenCalled();
    expect(system.matchResults).not.toBeNull();

    eventForwarder.emit(LOCAL_PLAYER_ID, 'onMatchStarted', {
      matchId: 'test-match-id',
      groupId: LOCAL_GROUP_ID,
    });

    expect(listener).toHaveBeenCalledTimes(1);
    expect(system.matchResults).toBeNull();
  });
});
