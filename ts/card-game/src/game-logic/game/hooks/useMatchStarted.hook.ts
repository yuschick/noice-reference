import { useEffect } from 'react';

import { useCardGameState } from '../context';

export function useMatchStarted(callback: VoidFunction): void {
  const cardGame = useCardGameState();

  useEffect(() => {
    cardGame?.addListener('onMatchStarted', callback);

    return () => {
      cardGame?.removeListener('onMatchStarted', callback);
    };
  }, [callback, cardGame]);
}
