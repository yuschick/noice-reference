import { useSoundController } from '@noice-com/common-ui';
import { useEffect } from 'react';

import { useWebSoundLoader } from '@common/sound';

export function useSignupRoute() {
  // Load sounds for Signup
  const soundController = useSoundController();
  const soundLoader = useWebSoundLoader();

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
