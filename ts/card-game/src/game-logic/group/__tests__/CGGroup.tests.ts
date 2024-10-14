import { MockGameStateProvider } from '../../__mocks__/MockGameStateProvider';
import { DelegateEventForwarder } from '../../events';
import { CGPlayer } from '../../player';
import { CGGroup } from '../CGGroup';

const DUMMY_GROUP_ID = 'test-group';
const DUMMY_GROUP_NAME = 'Test Group';
const playerIds = ['group-member', 'group-member-2', 'group-member-3'];

const eventForwarder = new DelegateEventForwarder();
const stateProvider = new MockGameStateProvider();

stateProvider.getPlayers.mockImplementation((...playerIds) =>
  playerIds.map((id) => new CGPlayer(id, DUMMY_GROUP_ID, eventForwarder, stateProvider)),
);

describe(`CGGroup`, () => {
  afterEach(() => {
    eventForwarder.removeAllListeners();
    stateProvider.getPlayers.mockClear();
  });

  it('should be able to init from an initial state', () => {
    const group = new CGGroup(DUMMY_GROUP_ID, eventForwarder, stateProvider, {
      name: DUMMY_GROUP_NAME,
      points: 500,
    });
    const solo = new CGGroup('solo-group', eventForwarder, stateProvider, {
      name: 'Solo',
      points: 300,
      isSolo: true,
    });

    expect(group.name).toEqual(DUMMY_GROUP_NAME);
    expect(group.score).toEqual(500);
    expect(group.isSolo).toEqual(false);
    expect(solo.isSolo).toEqual(true);

    group.destroy();
    solo.destroy();
  });

  describe('Event Handling', () => {
    it('should add players from onPlayerJoined messages', () => {
      const group = new CGGroup(DUMMY_GROUP_ID, eventForwarder, stateProvider);

      expect(group.getGroupPlayers()).toHaveLength(0);
      expect(stateProvider.getPlayers).toHaveBeenLastCalledWith();

      eventForwarder.emit(DUMMY_GROUP_ID, 'onPlayerJoined', {
        player: { userId: playerIds[0] },
      });

      expect(group.getGroupPlayers()).toHaveLength(1);
      expect(stateProvider.getPlayers).toHaveBeenLastCalledWith(playerIds[0]);

      eventForwarder.emit(DUMMY_GROUP_ID, 'onPlayerJoined', {
        player: { userId: playerIds[1] },
      });

      expect(group.getGroupPlayers()).toHaveLength(2);
      expect(stateProvider.getPlayers).toHaveBeenLastCalledWith(
        playerIds[0],
        playerIds[1],
      );
    });

    it('should remove players from onPlayerLeft (permanent) messages', () => {
      const group = new CGGroup(DUMMY_GROUP_ID, eventForwarder, stateProvider);

      eventForwarder.emit(DUMMY_GROUP_ID, 'onPlayerJoined', {
        player: { userId: playerIds[0] },
      });

      expect(group.getGroupPlayers()).toHaveLength(1);

      eventForwarder.emit(DUMMY_GROUP_ID, 'onPlayerLeft', {
        userId: playerIds[0],
        permanent: true,
      });
      expect(group.getGroupPlayers()).toHaveLength(0);
    });

    it('should keep players from onPlayerLeft (non-permanent) messages', () => {
      const group = new CGGroup(DUMMY_GROUP_ID, eventForwarder, stateProvider);

      eventForwarder.emit(DUMMY_GROUP_ID, 'onPlayerJoined', {
        player: { userId: playerIds[0] },
      });

      expect(group.getGroupPlayers()).toHaveLength(1);

      eventForwarder.emit(DUMMY_GROUP_ID, 'onPlayerLeft', {
        userId: playerIds[0],
        permanent: false,
      });
      expect(group.getGroupPlayers()).toHaveLength(1);
    });

    it('should update group score', () => {
      const group = new CGGroup(DUMMY_GROUP_ID, eventForwarder, stateProvider);

      expect(group.score).toEqual(0);
      eventForwarder.emit(DUMMY_GROUP_ID, 'onGroupPointsUpdated', {
        points: 300,
      });
      expect(group.score).toEqual(300);
    });
  });

  describe('State getters', () => {
    it('should provide whether a player exists in group or not', () => {
      const group = new CGGroup(DUMMY_GROUP_ID, eventForwarder, stateProvider);
      const playerId = playerIds[0];

      eventForwarder.emit(group.groupID, 'onPlayerJoined', {
        player: { userId: playerId },
      });

      expect(group.hasPlayer(playerId)).toEqual(true);
      expect(group.hasPlayer('kadonnut')).toEqual(false);
    });

    it('should return a player instance given a player id', () => {
      const group = new CGGroup(DUMMY_GROUP_ID, eventForwarder, stateProvider);
      const playerId = playerIds[0];

      eventForwarder.emit(group.groupID, 'onPlayerJoined', {
        player: { userId: playerId },
      });

      expect(group.getPlayer(playerId)).not.toBeUndefined();
    });

    it('should return all players in group', () => {
      const group = new CGGroup(DUMMY_GROUP_ID, eventForwarder, stateProvider);

      playerIds.forEach((userId) =>
        eventForwarder.emit(group.groupID, 'onPlayerJoined', {
          player: { userId },
        }),
      );

      expect(group.getGroupPlayers()).toHaveLength(playerIds.length);
    });
  });

  describe('Duplication', () => {
    it('should be able to clone a group with a new ID', () => {
      const group = new CGGroup('initial-id', eventForwarder, stateProvider, {
        name: DUMMY_GROUP_NAME,
        points: 300,
      });

      eventForwarder.emit('initial-id', 'onPlayerJoined', {
        groupId: 'initial-id',
        userId: 'player-1',
        player: { userId: 'player-1' },
      });
      eventForwarder.emit('initial-id', 'onPlayerJoined', {
        groupId: 'initial-id',
        userId: 'player-2',
        player: { userId: 'player-2' },
      });

      expect(group.getGroupPlayers()).toHaveLength(2);

      const clone = group.cloneWithID(DUMMY_GROUP_ID);

      expect(clone.name).toEqual(group.name);
      expect(clone.score).toEqual(group.score);
      expect(clone.getGroupPlayers()).toHaveLength(clone.getGroupPlayers().length);

      eventForwarder.emit(DUMMY_GROUP_ID, 'onGroupPointsUpdated', {
        groupId: DUMMY_GROUP_ID,
        points: 400,
      });
      expect(clone.score).toEqual(400);

      eventForwarder.emit(DUMMY_GROUP_ID, 'onPlayerLeft', {
        groupId: DUMMY_GROUP_ID,
        userId: 'player-2',
        permanent: true,
      });
      expect(clone.getGroupPlayers()).toHaveLength(1);
    });
  });
});
