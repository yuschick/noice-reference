import { useAuthenticatedUser } from '@noice-com/common-ui';
import { useState, useEffect } from 'react';

import { useCardGameState } from '../../game/context';
import type { CGPlayer } from '../CGPlayer';

import { CardGameOnPlayerJoined, CardGameOnPlayerLeft } from '@game-logic/game';

/**
 * Subscribe to a given player.
 *
 * @param playerId The ID of the player.
 * @returns The instance of the player state, or null if they don't exist.
 */
export function useCardGamePlayer(playerId: string): CGPlayer | null {
  const gameInstance = useCardGameState();
  const [player, setPlayer] = useState(gameInstance?.getPlayer(playerId));

  // Ensure when things change we have the correct data.
  useEffect(() => {
    const playerInstance = gameInstance?.getPlayer(playerId);
    setPlayer((currentPlayer) =>
      playerInstance !== currentPlayer ? playerInstance : currentPlayer,
    );
  }, [gameInstance, playerId]);

  // Use events to stay updated.
  useEffect(() => {
    const onJoined = ({ player }: CardGameOnPlayerJoined) => {
      if (player.playerID !== playerId) {
        return;
      }

      setPlayer(player);
    };

    const onLeft = ({ playerId: leftPlayerId, isPermanent }: CardGameOnPlayerLeft) => {
      if (!isPermanent) {
        return;
      }

      if (leftPlayerId !== playerId) {
        return;
      }

      setPlayer(null);
    };

    gameInstance?.addListener('onPlayerJoined', onJoined);
    gameInstance?.addListener('onPlayerLeft', onLeft);

    return () => {
      gameInstance?.removeListener('onPlayerJoined', onJoined);
      gameInstance?.removeListener('onPlayerLeft', onLeft);
    };
  }, [gameInstance, playerId]);

  return player ?? null;
}

export function useCardGameLocalPlayer(): CGPlayer | null {
  const { userId } = useAuthenticatedUser();

  return useCardGamePlayer(userId);
}
