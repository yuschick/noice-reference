import { StreamLeaderboard } from '../leaderboard';

describe('StreamLeaderboard', () => {
  const ignore = jest.fn();

  // mocks
  const delegate = {
    onPing: ignore,
    onReset: ignore,
    onGroupUpdate: ignore,
    onPlayerUpdate: ignore,
    onPlayerLeft: ignore,
    onEnd: ignore,
  };
  const ctx = {
    getGroup: ignore,
    getState: ignore,
    getLeaderboard: ignore,
  };
  // data
  const group1 = {
    id: '1',
    name: 'team1',
  };
  const player1 = {
    userId: '1',
    groupId: '1',
  };
  const player2 = {
    userId: '2',
    groupId: '1',
  };
  const player3 = {
    userId: '3',
    groupId: '1',
  };

  const streamLeaderboard = new StreamLeaderboard('123', delegate);

  beforeAll(() => streamLeaderboard.onReset(ctx, {}));

  it('should handle point updates for player', () => {
    streamLeaderboard.onGroupUpdate(ctx, {
      ...group1,
      points: 150,
      players: [
        {
          ...player1,
          points: 150,
        },
      ],
    });

    streamLeaderboard.onPlayerUpdate(ctx, {
      ...player1,
      points: 250,
      delta: 100,
    });
    expect(streamLeaderboard.getState().groups.get(group1.id)?.points).toBe(250);
  });

  it('should handle receiving new players', () => {
    // new players
    streamLeaderboard.onPlayerUpdate(ctx, {
      ...player2,
      points: 0,
    });
    streamLeaderboard.onPlayerUpdate(ctx, {
      ...player3,
      points: 0,
    });

    // Receive point update for new player
    streamLeaderboard.onPlayerUpdate(ctx, {
      ...player2,
      points: 150,
      delta: 150,
    });

    expect(streamLeaderboard.getState().groups.get(group1.id)?.points).toBe(400);
    expect(streamLeaderboard.getState().groups.get(group1.id)?.players.length).toBe(3);
  });

  it('should handle the leaving of a player', () => {
    // player1 leaves
    streamLeaderboard.onPlayerLeft(ctx, {
      userId: player1.userId,
      groupId: player1.groupId,
    });

    expect(streamLeaderboard.getState().groups.get(group1.id)?.points).toBe(400);
    expect(streamLeaderboard.getState().groups.get(group1.id)?.players.length).toBe(2);
  });

  it('should handle the re-joining of an old player', () => {
    streamLeaderboard.onPlayerUpdate(ctx, {
      ...player1,
      points: 200,
    });

    expect(streamLeaderboard.getState().groups.get(group1.id)?.points).toBe(400);
    expect(streamLeaderboard.getState().groups.get(group1.id)?.players.length).toBe(3);
  });
});
