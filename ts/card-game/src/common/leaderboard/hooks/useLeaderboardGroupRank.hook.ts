import { useEffect, useState } from 'react';

import { useLeaderboards } from '@game-context';
import { useCardGameGroup } from '@game-logic/group/hooks';
import { LeaderboardGroup } from '@game-types';

interface HookResult {
  groupRank: number;
}

export function useLeaderboardGroupRank(): HookResult {
  const localGroup = useCardGameGroup();
  const leaderboards = useLeaderboards();

  const [groupRank, setGroupRank] = useState<number>(() => {
    if (!leaderboards || !localGroup) {
      return 0;
    }

    return (
      leaderboards.currentState?.groups.find(
        (group) => group.groupId === localGroup.groupID,
      )?.rank ?? 0
    );
  });

  useEffect(() => {
    if (!leaderboards || !localGroup) {
      return;
    }

    const updateGroups = (groups: LeaderboardGroup[]) => {
      setGroupRank(
        groups.find((group) => group.groupId === localGroup.groupID)?.rank ?? 0,
      );
    };

    updateGroups(leaderboards.currentState?.groups ?? []);

    return leaderboards.addEventListener({
      async onReset(msg) {
        updateGroups(msg.groups);
      },
      async onPlayerLeft(msg) {
        updateGroups(msg.groups);
      },
      async onGroupUpdate(msg) {
        updateGroups(msg.groups);
      },
      async onPlayerUpdate(msg) {
        updateGroups(msg.groups);
      },
    });
  }, [leaderboards, localGroup]);

  return {
    groupRank,
  };
}
