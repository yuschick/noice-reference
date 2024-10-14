import { useEffect } from 'react';

import { usePlaySound } from './usePlaySound.hook';

import { GameSoundKeys } from '@game-types';

interface HookResult {
  playScoringPointsTickingUp: () => void;
  stopScoringPointsTickingUp: () => void;
  playScoringNewBestPlay: () => void;

  playScoringBoosterBonus: () => void;
}

export function useScoringSounds(): HookResult {
  const [playScoringPointsTickingUp, stopScoringPointsTickingUp] = usePlaySound(
    GameSoundKeys.ScoringPlayerScoreTickingUp,
    { loop: true, maxLoopDuration: 5000 },
  );

  const [playScoringNewBestPlay] = usePlaySound(GameSoundKeys.ScoringPlayerNewBestPlay);
  const [playScoringBoosterBonus] = usePlaySound(GameSoundKeys.ScoringBoosterBonus);

  useEffect(() => {
    () => {
      stopScoringPointsTickingUp();
    };
  }, [stopScoringPointsTickingUp]);

  return {
    playScoringPointsTickingUp,
    stopScoringPointsTickingUp,
    playScoringNewBestPlay,
    playScoringBoosterBonus,
  };
}
