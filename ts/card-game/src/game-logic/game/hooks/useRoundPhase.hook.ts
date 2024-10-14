import { StreamStateRoundPhase } from '@noice-com/schemas/game-logic/game_logic.pb';
import { useEffect, useState } from 'react';

import { useStreamGame } from '@game-logic/game/context';

export function useRoundPhase(): StreamStateRoundPhase {
  const { gameInstance } = useStreamGame();

  const [roundPhase, setRoundPhase] = useState<StreamStateRoundPhase>(
    () => gameInstance?.roundPhase ?? StreamStateRoundPhase.ROUND_PHASE_UNSPECIFIED,
  );

  useEffect(() => {
    if (!gameInstance) {
      return;
    }

    const handleRoundStateChange = () => setRoundPhase(gameInstance.roundPhase);

    handleRoundStateChange();

    gameInstance.addListener('onGameInit', handleRoundStateChange);
    gameInstance.addListener('onRoundPhaseCompetition', handleRoundStateChange);
    gameInstance.addListener('onRoundPhaseEnded', handleRoundStateChange);
    gameInstance.addListener('onRoundPhasePreparation', handleRoundStateChange);

    return () => {
      gameInstance.removeListener('onGameInit', handleRoundStateChange);
      gameInstance.removeListener('onRoundPhaseCompetition', handleRoundStateChange);
      gameInstance.removeListener('onRoundPhaseEnded', handleRoundStateChange);
      gameInstance.removeListener('onRoundPhasePreparation', handleRoundStateChange);
    };
  }, [gameInstance]);

  return roundPhase;
}
