import { useEffect } from 'react';

import { useCardGameState } from '../context';

export function useRoundPhasePreparation(callback: VoidFunction): void {
  const cardGame = useCardGameState();

  useEffect(() => {
    if (!cardGame) {
      return;
    }

    cardGame.addListener('onRoundPhasePreparation', callback);

    return () => {
      cardGame.removeListener('onRoundPhasePreparation', callback);
    };
  }, [callback, cardGame]);
}
