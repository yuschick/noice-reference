import { useEffect, useState } from 'react';

import { useCardGameState } from '../context';

export function useIsRoundBasedGame(): boolean {
  const gameInstance = useCardGameState();
  const [isRoundBasedGame, setIsRoundBasedGame] = useState(
    () => gameInstance?.isRoundBasedGame() || false,
  );

  useEffect(() => {
    if (!gameInstance) {
      return;
    }

    const checkGameType = () => setIsRoundBasedGame(gameInstance.isRoundBasedGame());

    gameInstance.addListener('onGameInit', checkGameType);

    return () => {
      gameInstance.removeListener('onGameInit', checkGameType);
    };
  });

  return isRoundBasedGame;
}
