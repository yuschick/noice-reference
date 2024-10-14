import { useEffect, useState } from 'react';

import { useStreamGame } from '@game-logic/game/context';

export function useTimeLeftForTeamChange(): number {
  const { gameInstance } = useStreamGame();
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    if (!gameInstance) {
      return;
    }

    const updateTimeLeft = () => {
      setTimeLeft(gameInstance.teamChangeAvailableAt?.timeLeft ?? 0);
    };
    updateTimeLeft();

    gameInstance.addListener('onTeamChangeAvailableAtUpdated', updateTimeLeft);
    return () => {
      gameInstance.removeListener('onTeamChangeAvailableAtUpdated', updateTimeLeft);
    };
  }, [gameInstance]);

  return timeLeft;
}
