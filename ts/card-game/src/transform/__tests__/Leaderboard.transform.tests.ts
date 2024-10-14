import { ILeaderboardGroup, ILeaderboardPlayer } from '@noice-com/platform-client';

import {
  transformLeaderboardPlayer,
  transformLeaderboardGroup,
} from '../Leaderboard.transform';

describe('Leaderboard.transform.ts', () => {
  describe('transformLeaderboardPlayer', () => {
    it('Should transform a player leaderboard player struct', () => {
      const userId = 'player-1';
      const points = 3222;
      const result = transformLeaderboardPlayer({
        userId,
        points,
      });
      expect(result.playerId).toEqual(userId);
      expect(result.score).toEqual(points);
    });
  });

  describe('transformLeaderboardGroup', () => {
    const player1: ILeaderboardPlayer = {
      userId: 'player-1',
      points: 5000,
    };
    const player2: ILeaderboardPlayer = {
      userId: 'player-2',
      points: 4000,
    };
    const player3: ILeaderboardPlayer = {
      userId: 'player-3',
      points: 3000,
    };
    const player4: ILeaderboardPlayer = {
      userId: 'player-4',
      points: 2000,
    };
    const group: ILeaderboardGroup = {
      groupId: 'my-group',
      groupName: 'My Group',
      points: player1.points + player2.points + player3.points + player4.points,
      players: [
        // Ensure they are not in order
        player3,
        player1,
        player4,
        player2,
      ],
    };

    it('Should order the players from highest scoring to lowest', () => {
      const result = transformLeaderboardGroup(group, 3);
      expect(result.groupId).toEqual(group.groupId);
      expect(result.groupName).toEqual(group.groupName);
      expect(result.score).toEqual(group.points);
      expect(result.players).toHaveLength(group.players.length);

      // Make sure the players are in the right order
      expect(result.players[3].playerId).toEqual(player1.userId);
      expect(result.players[2].playerId).toEqual(player2.userId);
      expect(result.players[1].playerId).toEqual(player3.userId);
      expect(result.players[0].playerId).toEqual(player4.userId);
    });

    it('Should transform a group (with rank)', () => {
      const rank = 3;
      const result = transformLeaderboardGroup(group, rank);
      expect(result.groupId).toEqual(group.groupId);
      expect(result.groupName).toEqual(group.groupName);
      expect(result.score).toEqual(group.points);
      expect(result.rank).toEqual(rank);
    });
  });
});
