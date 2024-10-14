import { useEffect } from 'react';

import { useCardGameState } from '../context';

export function useMatchEnded(callback: VoidFunction): void {
  const cardGame = useCardGameState();

  useEffect(() => {
    cardGame?.addListener('onMatchEnded', callback);

    return () => {
      cardGame?.removeListener('onMatchEnded', callback);
    };
  }, [callback, cardGame]);
}
