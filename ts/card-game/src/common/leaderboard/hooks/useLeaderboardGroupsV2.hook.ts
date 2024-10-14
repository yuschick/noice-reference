import { useAuthenticatedUser } from '@noice-com/common-ui';
import debounce from 'lodash.debounce';
import { useEffect, useState } from 'react';

import { useLeaderboards } from '@game-context';
import { GroupProps, LeaderboardPlayer, LeaderboardGroup } from '@game-types';

const transformGroup = (group: LeaderboardGroup, localId: string): GroupProps => {
  let isOwnGroup = false;
  const players = group.players.map(({ playerId, score }): LeaderboardPlayer => {
    if (playerId === localId) {
      isOwnGroup = true;
    }

    return {
      playerId,
      score,
    };
  });

  return {
    groupId: group.groupId,
    groupName: group.groupName,
    playerData: players,
    own: isOwnGroup,
    rank: group.rank,
    score: group.score,
  };
};

interface State {
  topGroups: GroupProps[];
  ownGroupWithNeighbours: GroupProps[];
  totalGroupCount: number;
}

const MAX_GROUPS = 8;

export const useLeaderboardGroupsV2 = (): State => {
  const { userId: localPlayerId } = useAuthenticatedUser();
  const [state, setState] = useState<State>({
    topGroups: [],
    ownGroupWithNeighbours: [],
    totalGroupCount: 0,
  });

  const leaderboards = useLeaderboards();

  useEffect(() => {
    if (!leaderboards || !localPlayerId) {
      return;
    }

    const updateGroups = (msg: LeaderboardGroup[]) => {
      const groupsWithPlayers = msg.filter((group) => !!group.players.length);
      const transformedGroups = groupsWithPlayers.map((group) =>
        transformGroup(group, localPlayerId),
      );

      const ownGroupIndex = transformedGroups.findIndex((group) => group.own);

      // If the player group (+ neighbour groups) is outside of the top groups,
      // we need to show a divider
      const ownGroupWithNeighbours =
        ownGroupIndex > MAX_GROUPS - 2
          ? transformedGroups.slice(ownGroupIndex - 1, ownGroupIndex + 2)
          : [];

      setState({
        topGroups: transformedGroups.slice(0, MAX_GROUPS),
        ownGroupWithNeighbours,
        totalGroupCount: transformedGroups.length,
      });
    };

    const debouncedUpdateGroups = debounce(updateGroups, 300);

    updateGroups(leaderboards.currentState?.groups ?? []);

    return leaderboards.addEventListener({
      async onReset(msg) {
        debouncedUpdateGroups(msg.groups);
      },
      async onPlayerLeft(msg) {
        debouncedUpdateGroups(msg.groups);
      },
      async onGroupUpdate(msg) {
        debouncedUpdateGroups(msg.groups);
      },
      async onPlayerUpdate(msg) {
        debouncedUpdateGroups(msg.groups);
      },
    });
  }, [leaderboards, localPlayerId]);

  return state;
};
