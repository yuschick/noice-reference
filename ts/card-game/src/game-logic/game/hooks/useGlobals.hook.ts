import { Attribute } from '@noice-com/schemas/game-logic/game_logic.pb';
import { useEffect, useState } from 'react';

import { useStreamGame } from '@game-logic/game/context';

export function useGlobals(): Attribute[] {
  const { gameInstance } = useStreamGame();

  const [globals, setGlobals] = useState<Attribute[]>(gameInstance?.globals ?? []);

  useEffect(() => {
    if (!gameInstance) {
      return;
    }

    const handleGlobalsUpdated = () => setGlobals(gameInstance.globals);

    handleGlobalsUpdated();

    gameInstance.addListener('onGameInit', handleGlobalsUpdated);
    gameInstance.addListener('onGlobalsUpdated', handleGlobalsUpdated);

    return () => {
      gameInstance.removeListener('onGameInit', handleGlobalsUpdated);
      gameInstance.removeListener('onGlobalsUpdated', handleGlobalsUpdated);
    };
  }, [gameInstance]);

  return globals;
}
