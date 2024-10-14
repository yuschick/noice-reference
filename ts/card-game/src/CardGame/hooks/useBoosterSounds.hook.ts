import { useEffect } from 'react';

import { usePlaySound } from '@game-common/sound/hooks';
import { GameSoundKeys } from '@game-types';

interface HookResult {
  playBoosterActiveSpeedUp: () => void;
  playBoosterActiveDoubt: () => void;
  playBoosterActiveScavenge: () => void;
  stopBoosterActivateSpeedUp: () => void;
  playBoosterUse: () => void;
  playBoosterReceive: () => void;
  playBoosterTeamReceive: () => void;
  playBoosterTeamUse: () => void;
}

export function useBoosterSounds(): HookResult {
  const [playBoosterActiveSpeedUp, stopBoosterActivateSpeedUp] = usePlaySound(
    GameSoundKeys.BoostersActivateSpeedUp,
    { loop: true, maxLoopDuration: 20000 },
  );
  const [playBoosterActiveDoubt] = usePlaySound(GameSoundKeys.BoostersActivateDoubt);
  const [playBoosterActiveScavenge] = usePlaySound(
    GameSoundKeys.BoostersActivateScavenge,
  );
  const [playBoosterUse] = usePlaySound(GameSoundKeys.BoostersUse);
  const [playBoosterReceive] = usePlaySound(GameSoundKeys.BoostersReceive);
  const [playBoosterTeamReceive] = usePlaySound(GameSoundKeys.BoostersTeamReceive);
  const [playBoosterTeamUse] = usePlaySound(GameSoundKeys.BoostersTeamUse);

  useEffect(() => {
    () => {
      stopBoosterActivateSpeedUp();
    };
  }, [stopBoosterActivateSpeedUp]);

  return {
    playBoosterActiveSpeedUp,
    stopBoosterActivateSpeedUp,
    playBoosterActiveDoubt,
    playBoosterActiveScavenge,
    playBoosterUse,
    playBoosterReceive,
    playBoosterTeamReceive,
    playBoosterTeamUse,
  };
}
