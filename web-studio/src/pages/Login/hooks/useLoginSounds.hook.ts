import { useCommonSoundLoader, useSoundController } from '@noice-com/common-ui';
import { useEffect } from 'react';

export function useLoginSounds() {
  const soundController = useSoundController();
  const soundLoader = useCommonSoundLoader();

  useEffect(() => {
    if (!soundLoader) {
      return;
    }

    soundController.registerActiveLoader(soundLoader);

    return () => {
      soundController.detachActiveLoader();
    };
  }, [soundController, soundLoader]);
}
