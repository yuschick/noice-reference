import { useEffect } from 'react';

import { useCardGameState } from '../context';

export function useRoundPhaseEnded(callback: VoidFunction): void {
  const cardGame = useCardGameState();

  useEffect(() => {
    if (!cardGame) {
      return;
    }

    cardGame.addListener('onRoundPhaseEnded', callback);

    return () => {
      cardGame.removeListener('onRoundPhaseEnded', callback);
    };
  }, [callback, cardGame]);
}
