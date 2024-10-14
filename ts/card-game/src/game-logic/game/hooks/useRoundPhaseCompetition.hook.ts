import { useEffect } from 'react';

import { useCardGameState } from '../context';

export function useRoundPhaseCompetition(callback: VoidFunction): void {
  const cardGame = useCardGameState();

  useEffect(() => {
    if (!cardGame) {
      return;
    }

    cardGame.addListener('onRoundPhaseCompetition', callback);

    return () => {
      cardGame.removeListener('onRoundPhaseCompetition', callback);
    };
  }, [callback, cardGame]);
}
