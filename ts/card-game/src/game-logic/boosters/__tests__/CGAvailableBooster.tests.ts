import { IMatchGroup } from '@noice-com/platform-client';
import { MockMatchGroup } from '@noice-com/platform-client/src/testing';

import { MockGameStateProvider } from '../../__mocks__/MockGameStateProvider';
import * as TestData from '../../__testdata__/boosters';
import { DelegateEventForwarder } from '../../events';
import { CGPlayer } from '../../player';
import { CGAvailableBooster } from '../CGAvailableBooster';

const PLAYER_ID = 'test-player-1';
const GROUP_ID = 'test-group';

function initializePlayer(
  forwarder: DelegateEventForwarder,
  playerId: string,
  cardId?: string,
) {
  forwarder.emit(playerId, 'onPlayerJoined', {
    userId: playerId,
    player: {
      userId: playerId,
      points: 0,
      activeCard: {
        cardId,
      },
      cardSwitchOutTimer: {
        startTime: '1',
        endTime: '2',
      },
      hand: {
        cardIds: [],
        matchEndCardIds: [],
      },
      reshuffleCount: 0,
    },
  });
}

describe('CGAvailableBooster', () => {
  const eventForwarder = new DelegateEventForwarder();
  const stateProvider = new MockGameStateProvider();
  let mockContext: IMatchGroup;

  // These are initialized in beforeAll just below
  const localPlayer = new CGPlayer(PLAYER_ID, GROUP_ID, eventForwarder, stateProvider);
  const teammate = new CGPlayer('player-2', GROUP_ID, eventForwarder, stateProvider);
  const teammateNoCard = new CGPlayer(
    'player-3',
    GROUP_ID,
    eventForwarder,
    stateProvider,
  );
  const offlineTeammate = new CGPlayer(
    'player-4',
    GROUP_ID,
    eventForwarder,
    stateProvider,
    {
      isOnline: false,
    },
  );

  let useBoosterRef: jest.MockedFunction<IMatchGroup['useBooster']>;
  let requestBoosterRef: jest.MockedFunction<IMatchGroup['requestBooster']>;
  let cancelBoosterRequestRef: jest.MockedFunction<IMatchGroup['cancelBoosterRequest']>;

  beforeAll(() => {
    MockMatchGroup.MockFactory = jest.fn;
    mockContext = new MockMatchGroup(GROUP_ID, PLAYER_ID);
    stateProvider.getMatchConnection.mockImplementation(() => mockContext);

    initializePlayer(eventForwarder, PLAYER_ID, 'test-card'); // localPlayer
    initializePlayer(eventForwarder, 'player-2', 'test-card-2'); // teammate
    initializePlayer(eventForwarder, 'player-3'); // teammateNoCard

    // Cache mocked fns
    useBoosterRef = mockContext.useBooster as jest.MockedFunction<
      IMatchGroup['useBooster']
    >;
    requestBoosterRef = mockContext.requestBooster as jest.MockedFunction<
      IMatchGroup['requestBooster']
    >;
    cancelBoosterRequestRef = mockContext.cancelBoosterRequest as jest.MockedFunction<
      IMatchGroup['cancelBoosterRequest']
    >;

    // Mock implementations...
    useBoosterRef.mockImplementation(() => Promise.resolve());
    requestBoosterRef.mockImplementation(() => Promise.resolve());
    cancelBoosterRequestRef.mockImplementation(() => Promise.resolve());
  });

  afterAll(() => {
    MockMatchGroup.MockFactory = MockMatchGroup.DefaultMockMethod;
    stateProvider.getMatchConnection.mockClear();
  });

  it('should expose the schema of the available booster', () => {
    const availableBooster = new CGAvailableBooster(
      TestData.boosterAsFragment(TestData.TeammateOnlyBooster),
      {
        owner: PLAYER_ID,
        eventForwarder,
        stateProvider,
      },
    );
    expect(availableBooster.boosterId).toEqual(TestData.TeammateOnlyBooster.id);
  });

  it('should expose the current requests on the given booster', () => {
    const booster1 = new CGAvailableBooster(
      TestData.boosterAsFragment(TestData.TeammateOnlyBooster),
      {
        owner: PLAYER_ID,
        eventForwarder,
        stateProvider,
        requests: ['player-1', 'player-2'],
      },
    );
    expect(booster1.currentRequests).toHaveLength(2);
    // Default to empty array
    const booster2 = new CGAvailableBooster(
      TestData.boosterAsFragment(TestData.TeammateOnlyBooster),
      {
        owner: PLAYER_ID,
        eventForwarder,
        stateProvider,
      },
    );
    expect(booster2.currentRequests).toHaveLength(0);
  });

  it('should allow subscribing for booster request changes', () => {
    const booster = new CGAvailableBooster(
      TestData.boosterAsFragment(TestData.StandardBooster),
      {
        owner: PLAYER_ID,
        eventForwarder,
        stateProvider,
        requests: ['player-1', 'player-2'],
      },
    );
    const listener = jest.fn();
    booster.addListener('onBoosterRequested', listener);
    booster.addListener('onRequestCancelled', listener);
    expect(listener).toHaveBeenCalledTimes(0);
    // @note: These messages are confusing, as they are a bit flipped
    // ie. Target user is actually the user who owns the booster.
    eventForwarder.emit(PLAYER_ID, 'onBoosterRequestCancelled', {
      boosterId: booster.boosterId,
      userId: 'player-2',
      targetUserId: PLAYER_ID,
    });
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenLastCalledWith({ requesteeId: 'player-2' });
    expect(booster.currentRequests).toHaveLength(1);
    expect(booster.currentRequests).toEqual(['player-1']);
    eventForwarder.emit(PLAYER_ID, 'onBoosterRequested', {
      boosterId: booster.boosterId,
      userId: 'player-3',
      targetUserId: PLAYER_ID,
    });
    expect(listener).toHaveBeenCalledTimes(2);
    expect(listener).toHaveBeenLastCalledWith({ requesteeId: 'player-3' });
    expect(booster.currentRequests).toHaveLength(2);
    expect(booster.currentRequests).toEqual(['player-1', 'player-3']);
  });

  it('should allow subscribing for booster usage changes', () => {
    const booster = new CGAvailableBooster(
      TestData.boosterAsFragment(TestData.StandardBooster),
      {
        owner: PLAYER_ID,
        eventForwarder,
        stateProvider,
        requests: ['player-1', 'player-2'],
      },
    );
    const listener = jest.fn();
    booster.addListener('onBoosterUsed', listener);

    eventForwarder.emit(PLAYER_ID, 'onBoosterUsed', {
      userId: PLAYER_ID,
      targetUserId: PLAYER_ID,
      boosterId: TestData.StandardBooster.id,
    });

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenLastCalledWith({
      targetId: PLAYER_ID,
      targetIsSelf: true,
    });

    // All listeners should be removed as it deactivates afterwards..
    eventForwarder.emit(PLAYER_ID, 'onBoosterUsed', {
      userId: PLAYER_ID,
      targetUserId: 'player-2',
      boosterId: TestData.StandardBooster.id,
    });

    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('should tell whether a booster is usable on a given target', () => {
    const booster = new CGAvailableBooster(
      TestData.boosterAsFragment(TestData.TeammateOnlyBooster),
      {
        owner: localPlayer.playerID,
        eventForwarder,
        stateProvider,
        requests: ['player-1', 'player-2', 'player-4'],
      },
    );

    expect(booster.canBeUsedOn(localPlayer)).toEqual(false);
    expect(booster.canBeUsedOn(teammate)).toEqual(true);
    expect(booster.canBeUsedOn(teammateNoCard)).toEqual(false);
    expect(booster.canBeUsedOn(offlineTeammate)).toEqual(false);
  });

  it('should trigger useBooster if owned by the local player', async () => {
    const booster = new CGAvailableBooster(
      TestData.boosterAsFragment(TestData.TeammateOnlyBooster),
      {
        owner: localPlayer.playerID,
        isOwnedLocally: true,
        eventForwarder,
        stateProvider,
        requests: ['player-1', 'player-2'],
      },
    );

    expect(await booster.useBooster(teammate)).toEqual(true);
    expect(mockContext.useBooster).toBeCalledTimes(1);
    expect(mockContext.useBooster).toHaveBeenLastCalledWith(
      teammate.playerID,
      booster.boosterId,
    );

    const booster2 = new CGAvailableBooster(
      TestData.boosterAsFragment(TestData.StandardBooster),
      {
        owner: teammate.playerID,
        eventForwarder,
        stateProvider,
        requests: [],
      },
    );
    expect(await booster2.useBooster(teammate)).toEqual(false);
    expect(mockContext.useBooster).toBeCalledTimes(1);
  });

  it('should trigger requestBooster/cancel', async () => {
    const booster = new CGAvailableBooster(
      TestData.boosterAsFragment(TestData.StandardBooster),
      {
        owner: teammate.playerID,
        eventForwarder,
        stateProvider,
        requests: [],
      },
    );

    // Make sure booster request gets sent.
    expect(requestBoosterRef).toHaveBeenCalledTimes(0);
    expect(await booster.requestBooster()).toEqual(true);
    expect(requestBoosterRef).toHaveBeenCalledTimes(1);
    expect(requestBoosterRef).toHaveBeenLastCalledWith(
      booster.ownerId,
      booster.boosterId,
    );

    // Mock response
    eventForwarder.emit(booster.ownerId, 'onBoosterRequested', {
      userId: localPlayer.playerID,
      targetUserId: booster.ownerId,
      boosterId: booster.boosterId,
    });

    // Make sure booster has correctly stored the request
    expect(booster.boosterRequestExists(localPlayer.playerID)).toEqual(true);

    // Make sure we send the cancel request
    expect(cancelBoosterRequestRef).toHaveBeenCalledTimes(0);
    expect(await booster.cancelRequest()).toEqual(true);
    expect(cancelBoosterRequestRef).toHaveBeenCalledTimes(1);
    expect(cancelBoosterRequestRef).toHaveBeenLastCalledWith(
      booster.ownerId,
      booster.boosterId,
    );

    // Mock response
    eventForwarder.emit(booster.ownerId, 'onBoosterRequestCancelled', {
      userId: localPlayer.playerID,
      targetUserId: booster.ownerId,
      boosterId: booster.boosterId,
    });

    // Make sure booster has correctly updated the request list
    expect(booster.boosterRequestExists(localPlayer.playerID)).toEqual(false);
  });
});
