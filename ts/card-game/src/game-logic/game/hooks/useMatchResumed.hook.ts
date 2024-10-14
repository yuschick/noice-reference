import { StreamStateRoundPhase } from '@noice-com/schemas/game-logic/game_logic.pb';
import { useEffect } from 'react';

import { useCardGameState } from '../context';
import { CardGameOnMatchPauseStateChanged } from '../types';

export function useMatchResumed(callback: VoidFunction): void {
  const cardGame = useCardGameState();

  useEffect(() => {
    if (!cardGame) {
      return;
    }

    const onResumed = ({ isPaused, roundPhase }: CardGameOnMatchPauseStateChanged) => {
      if (isPaused || roundPhase !== StreamStateRoundPhase.ROUND_PHASE_UNSPECIFIED) {
        return;
      }

      callback();
    };

    cardGame.addListener('onMatchPauseStateChanged', onResumed);

    return () => {
      cardGame.removeListener('onMatchPauseStateChanged', onResumed);
    };
  }, [callback, cardGame]);
}
