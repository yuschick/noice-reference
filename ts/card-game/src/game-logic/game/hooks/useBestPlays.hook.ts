import { useEffect, useState } from 'react';

import type { CGActiveCard } from '../../card';
import { useCardGameState } from '../context/StreamGameProvider';

interface HookResult {
  hasBestPlays: boolean;
  bestPlays: CGActiveCard[];
}

export function useBestPlays(): HookResult {
  const gameState = useCardGameState();

  const [bestPlays, setBestPlays] = useState<CGActiveCard[]>([]);

  useEffect(() => {
    const updateBestPlays = () => {
      // Get all best plays
      const allBestPlays =
        (gameState
          ?.getLocalGroup()
          ?.getPlayerIds()
          .map((playerId) => gameState.getPlayerBestPlay(playerId))
          .filter(Boolean) as CGActiveCard[]) ?? [];
      const localPlayerBestPlay = allBestPlays.find(
        (card) => card.ownerId === gameState?.getLocalPlayer()?.playerID,
      );

      // If local player has one, put it first
      const orderedBestPlays = [
        localPlayerBestPlay,
        ...allBestPlays.filter((card) => card.ownerId !== localPlayerBestPlay?.ownerId),
      ].filter(Boolean) as CGActiveCard[];

      setBestPlays(orderedBestPlays);
    };

    updateBestPlays();

    gameState?.addListener('onPlayerJoined', updateBestPlays);
    gameState?.addListener('onPlayerLeft', updateBestPlays);
    gameState?.addListener('onActiveCardSucceeded', updateBestPlays);

    return () => {
      gameState?.removeListener('onPlayerJoined', updateBestPlays);
      gameState?.addListener('onPlayerLeft', updateBestPlays);
      gameState?.removeListener('onActiveCardSucceeded', updateBestPlays);
    };
  }, [gameState]);

  return {
    hasBestPlays: bestPlays.length > 0,
    bestPlays,
  };
}
