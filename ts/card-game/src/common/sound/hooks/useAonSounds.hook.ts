import { useEffect } from 'react';

import { usePlaySound } from './usePlaySound.hook';

import { GameSoundKeys } from '@game-types';

interface HookResult {
  playAonCloseToSucceeding: () => void;
  playAonAllOrNothing: () => void;
  playAonDoubleDown: () => void;
}

export function useAonSounds(): HookResult {
  const [playCloseToSucceeding, stopCloseToSucceeding] = usePlaySound(
    GameSoundKeys.CardsAonCloseToSucceeding,
  );
  const [playAllOrNothing, stopAllOrNothing] = usePlaySound(
    GameSoundKeys.CardsAonCountDown,
  );
  const [playDoubleDown, stopDoubleDown] = usePlaySound(GameSoundKeys.CardsAonDoubleDown);

  useEffect(() => {
    () => {
      stopAllOrNothing();
      stopCloseToSucceeding();
      stopDoubleDown();
    };
  });

  return {
    playAonCloseToSucceeding: playCloseToSucceeding,
    playAonAllOrNothing: playAllOrNothing,
    playAonDoubleDown: playDoubleDown,
  };
}
