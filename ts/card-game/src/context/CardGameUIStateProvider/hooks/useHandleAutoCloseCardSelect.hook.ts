import { useAuthenticatedUser } from '@noice-com/common-ui';
import { StreamStateRoundPhase } from '@noice-com/schemas/game-logic/game_logic.pb';
import { useEffect } from 'react';

import { useCardGameState } from '@game-logic/game/context';
import { useMatchEnded } from '@game-logic/game/hooks';
import { useCardGamePlayer } from '@game-logic/player/hooks';

interface Props {
  hideContent?: boolean;
  closeCardSelect(): void;
}

export function useHandleAutoCloseCardSelect({
  hideContent,
  closeCardSelect,
}: Props): void {
  const { userId } = useAuthenticatedUser();
  const player = useCardGamePlayer(userId);
  const gameState = useCardGameState();

  // Close card select on match end
  useMatchEnded(closeCardSelect);

  // If card game UI is hidden, close card select
  useEffect(() => {
    if (!hideContent) {
      return;
    }

    closeCardSelect();
  }, [hideContent, closeCardSelect]);

  // on AFK, close card select
  useEffect(() => {
    if (!player) {
      return;
    }

    player.addListener('onInactivityKick', closeCardSelect);

    return () => {
      player.removeListener('onInactivityKick', closeCardSelect);
    };
  }, [player, closeCardSelect]);

  // Handle round started closing card select
  useEffect(() => {
    if (!gameState) {
      return;
    }

    const checkIfCloseCardSelect = () => {
      if (gameState.roundPhase !== StreamStateRoundPhase.ROUND_PHASE_COMPETITION) {
        return;
      }

      closeCardSelect();
    };

    checkIfCloseCardSelect();

    gameState.addListener('onRoundPhaseCompetition', checkIfCloseCardSelect);

    return () => {
      gameState.removeListener('onRoundPhaseCompetition', checkIfCloseCardSelect);
    };
  }, [gameState, closeCardSelect]);
}
