import {
  StreamStateMatchState,
  StreamStateRoundPhase,
} from '@noice-com/schemas/game-logic/game_logic.pb';
import { useEffect, useState } from 'react';

import { useStreamGame } from '../context';
import { CardGameOnMatchPauseStateChanged } from '../types';

import { useRoundPhase } from './useRoundPhase.hook';

export function useIsMatchPaused(): boolean {
  const { gameInstance } = useStreamGame();
  const roundPhase = useRoundPhase();
  const [isMatchPaused, setIsMatchPaused] = useState(false);

  useEffect(() => {
    if (!gameInstance) {
      return;
    }

    // Visual paused state is not triggered for round based games
    setIsMatchPaused(
      gameInstance.matchState === StreamStateMatchState.MATCH_STATE_PAUSED &&
        gameInstance.roundPhase === StreamStateRoundPhase.ROUND_PHASE_UNSPECIFIED,
    );

    const handleMatchPauseStateChanged = ({
      isPaused,
      roundPhase,
    }: CardGameOnMatchPauseStateChanged) => {
      if (roundPhase !== StreamStateRoundPhase.ROUND_PHASE_UNSPECIFIED) {
        return;
      }

      setIsMatchPaused(isPaused);
    };

    gameInstance.addListener('onMatchPauseStateChanged', handleMatchPauseStateChanged);
    return () => {
      gameInstance.removeListener(
        'onMatchPauseStateChanged',
        handleMatchPauseStateChanged,
      );
    };
  }, [gameInstance]);

  useEffect(() => {
    if (roundPhase === StreamStateRoundPhase.ROUND_PHASE_UNSPECIFIED) {
      return;
    }

    setIsMatchPaused(false);
  }, [roundPhase]);

  return isMatchPaused;
}
