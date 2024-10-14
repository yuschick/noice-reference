import { StreamStateRoundPhase } from '@noice-com/schemas/game-logic/game_logic.pb';
import { useEffect } from 'react';

import { useCardGameState } from '../context';
import { CardGameOnMatchPauseStateChanged } from '../types';

export function useMatchPaused(callback: VoidFunction): void {
  const cardGame = useCardGameState();

  useEffect(() => {
    if (!cardGame) {
      return;
    }

    const onPaused = ({ isPaused, roundPhase }: CardGameOnMatchPauseStateChanged) => {
      // With round based games we don't trigger paused state
      if (!isPaused || roundPhase !== StreamStateRoundPhase.ROUND_PHASE_UNSPECIFIED) {
        return;
      }

      callback();
    };

    cardGame.addListener('onMatchPauseStateChanged', onPaused);

    return () => {
      cardGame.removeListener('onMatchPauseStateChanged', onPaused);
    };
  }, [callback, cardGame]);
}
