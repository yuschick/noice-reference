import { useSoundController } from '@noice-com/common-ui';
import { useEffect } from 'react';

import { useWebSoundLoader } from './useWebSoundLoader.hook';

import { useStreamGame } from '@common/stream';

export function useAppSounds() {
  const soundController = useSoundController();

  const soundLoader = useWebSoundLoader();
  const { gameInstance } = useStreamGame();

  useEffect(() => {
    if (!soundLoader || gameInstance) {
      return;
    }

    soundController.registerActiveLoader(soundLoader);

    return () => {
      soundController.detachActiveLoader();
    };
  }, [soundController, soundLoader, gameInstance]);
}
