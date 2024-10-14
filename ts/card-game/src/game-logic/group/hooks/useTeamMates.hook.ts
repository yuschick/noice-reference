import { useEffect, useState } from 'react';

import { useLocalPlayerId } from '../../game/hooks';

import { useCardGameGroup } from './useCardGameGroup.hook';

interface HookResult {
  teamPlayerIds: string[];
}

export function useTeamMates(): HookResult {
  const localGroup = useCardGameGroup();
  const [teamPlayerIds, setTeamPlayerIds] = useState<string[]>([]);

  const localPlayerId = useLocalPlayerId();

  useEffect(() => {
    if (!localGroup) {
      return;
    }

    setTeamPlayerIds(
      localGroup.getPlayerIds().filter((playerId) => playerId !== localPlayerId),
    );

    const onUpdated = () => {
      setTeamPlayerIds(
        localGroup.getPlayerIds().filter((playerId) => playerId !== localPlayerId),
      );
    };

    localGroup.addListener('onPlayerJoined', onUpdated);
    localGroup.addListener('onPlayerLeft', onUpdated);

    return () => {
      localGroup.removeListener('onPlayerJoined', onUpdated);
      localGroup.removeListener('onPlayerLeft', onUpdated);
    };
  }, [localGroup, localPlayerId]);

  return {
    teamPlayerIds,
  };
}
