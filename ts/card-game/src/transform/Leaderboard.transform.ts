import { ILeaderboardGroup, ILeaderboardPlayer } from '@noice-com/platform-client';
import { SortUtils } from '@noice-com/utils';

import { LeaderboardGroup, LeaderboardGroupmember } from '@game-types';

export function transformLeaderboardPlayer(
  player: ILeaderboardPlayer,
): LeaderboardGroupmember {
  return {
    playerId: player.userId,
    score: player.points,
  };
}

export function transformLeaderboardGroup(
  group: ILeaderboardGroup,
  rank: number,
): LeaderboardGroup {
  // This should be sorted, but just to be safe.
  const players = group.players.map((player) => transformLeaderboardPlayer(player));
  players.sort((a, b) => SortUtils.sortAscending(a.score, b.score));
  return {
    rank,
    players,
    score: group.points,
    groupId: group.groupId,
    groupName: group.groupName,
  };
}
