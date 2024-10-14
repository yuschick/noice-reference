import { useMountEffect } from '@noice-com/common-react-core';
import { SoundAssetLoader, useSoundController } from '@noice-com/common-ui';
import { useEffect, useState } from 'react';

import { getGameSoundConfig, getGameSounds } from '@game-utils';

export function useGameSoundLoader(): void {
  const soundController = useSoundController();
  const [soundAssetLoader, setSoundAssetLoader] = useState<SoundAssetLoader | null>(null);

  useMountEffect(() => {
    const initLoader = async () => {
      const instance = new SoundAssetLoader('game');
      getGameSoundConfig(instance);
      await getGameSounds(instance);
      setSoundAssetLoader(instance);
    };

    initLoader();
  });

  useEffect(() => {
    if (!soundAssetLoader) {
      return;
    }

    soundController.registerActiveLoader(soundAssetLoader);

    return () => {
      soundController.detachActiveLoader();
    };
  }, [soundController, soundAssetLoader]);
}
