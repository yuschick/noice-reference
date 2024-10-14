import { MouseEventHandler, useCallback } from 'react';

import { usePlaySound } from './usePlaySound.hook';

import { CommonSoundKeys } from '@common-types';

export function useMouseEnterWithSound(onMouseEnter?: MouseEventHandler) {
  const [playGenericHoverSound] = usePlaySound(CommonSoundKeys.GenericHover);

  const onMouseEnterWithSound: MouseEventHandler = useCallback(
    (event) => {
      playGenericHoverSound();

      onMouseEnter?.(event);
    },
    [playGenericHoverSound, onMouseEnter],
  );

  return onMouseEnterWithSound;
}
