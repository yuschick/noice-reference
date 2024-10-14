import { useAuthenticatedUser } from '@noice-com/common-ui';
import { AnalyticsEventClientCardSelectOpenedCardSelectOpenedContext as CardSelectOpenedContext } from '@noice-com/schemas/analytics/analytics.pb';
import { StreamStateRoundPhase } from '@noice-com/schemas/game-logic/game_logic.pb';
import { useEffect } from 'react';

import { useCardGameUIState } from '@game-context';
import { useCardGameState } from '@game-logic/game/context';

interface Props {
  preventAutoOpen?: boolean;
}

export function useHandleAutoOpenCardSelect({ preventAutoOpen }: Props): void {
  const { openCardSelect, closeCardSelect } = useCardGameUIState();
  const gameState = useCardGameState();
  const { userId } = useAuthenticatedUser();

  // Handle round ended opening card select
  useEffect(() => {
    if (!gameState || preventAutoOpen) {
      // Make sure that the card select is closed if prevented
      closeCardSelect();
      return;
    }

    const checkIfOpenCardSelect = () => {
      if (gameState.roundPhase !== StreamStateRoundPhase.ROUND_PHASE_PREPARATION) {
        return;
      }

      // if already has a card
      if (gameState.getPlayerActiveCard(userId)) {
        return;
      }

      openCardSelect(
        CardSelectOpenedContext.CARD_SELECT_OPENED_CONTEXT_ROUND_END_AUTO_OPEN,
      );
    };

    checkIfOpenCardSelect();

    gameState.addListener('onRoundPhasePreparation', checkIfOpenCardSelect);

    return () => {
      gameState.removeListener('onRoundPhasePreparation', checkIfOpenCardSelect);
    };
  }, [gameState, userId, preventAutoOpen, openCardSelect, closeCardSelect]);
}
