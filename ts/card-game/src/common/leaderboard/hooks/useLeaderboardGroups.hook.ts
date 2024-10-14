import { useAuthenticatedUser } from '@noice-com/common-ui';
import { useCallback, useEffect, useState } from 'react';

import { useLeaderboards } from '@game-context';
import { GroupProps, LeaderboardPlayer, LeaderboardGroup } from '@game-types';

export const useLeaderboardGroups = () => {
  const { userId: localPlayerId } = useAuthenticatedUser();
  const [groups, setGroups] = useState<GroupProps[]>([]);

  const leaderboards = useLeaderboards();

  const transformGroup = useCallback(
    async (group: LeaderboardGroup, localId: string): Promise<GroupProps> => {
      let isOwnGroup = false;
      const players = await Promise.all(
        group.players.map(async ({ playerId, score }): Promise<LeaderboardPlayer> => {
          if (playerId === localId) {
            isOwnGroup = true;
          }

          return {
            playerId,
            score,
          };
        }),
      );

      return {
        groupId: group.groupId,
        groupName: group.groupName,
        playerData: players,
        own: isOwnGroup,
        rank: group.rank,
        score: group.score,
      };
    },
    [],
  );

  const updateGroups = useCallback(
    async (newGroups: LeaderboardGroup[]): Promise<void> => {
      if (!localPlayerId) {
        return;
      }

      const transformed = await Promise.all(
        newGroups.map(async (group) => await transformGroup(group, localPlayerId)),
      );
      setGroups(transformed);
    },
    [localPlayerId, transformGroup],
  );

  useEffect(() => {
    const currentState = leaderboards.currentState;

    if (currentState) {
      void updateGroups(currentState.groups);
    }

    return leaderboards.addEventListener({
      async onReset(msg) {
        if (!localPlayerId) {
          return;
        }

        const reset = await Promise.all(
          msg.groups.map(async (group) => await transformGroup(group, localPlayerId)),
        );
        setGroups(reset);
      },
      async onPlayerLeft(msg) {
        if (!localPlayerId) {
          return;
        }

        const updated = await Promise.all(
          msg.groups.map(async (group) => await transformGroup(group, localPlayerId)),
        );
        setGroups(updated);
      },
      async onGroupUpdate(msg) {
        if (!localPlayerId) {
          return;
        }

        // @todo: We also have affectedGroups, but are not using it yet
        const updated = await Promise.all(
          msg.groups.map(async (group) => await transformGroup(group, localPlayerId)),
        );
        setGroups(updated);
      },
      async onPlayerUpdate(msg) {
        if (!localPlayerId) {
          return;
        }

        // @todo: We also have affectedGroups and player, but are not using it yet
        const updated = await Promise.all(
          msg.groups.map(async (group) => await transformGroup(group, localPlayerId)),
        );
        setGroups(updated);
      },
    });
  }, [leaderboards, localPlayerId, updateGroups, transformGroup]);

  return groups;
};
