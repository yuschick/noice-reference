import { MouseEventHandler, useCallback } from 'react';

import { usePlaySound } from './usePlaySound.hook';

import { CommonSoundKeys } from '@common-types';

export function useMouseClickWithSound(onClick?: MouseEventHandler) {
  const [playButtonClickConfirmSound] = usePlaySound(CommonSoundKeys.ButtonClickConfirm, {
    preserveOnUnmount: true,
  });

  const onMouseClickWithSound: MouseEventHandler = useCallback(
    (event) => {
      playButtonClickConfirmSound();

      onClick?.(event);
    },
    [playButtonClickConfirmSound, onClick],
  );

  return onMouseClickWithSound;
}
