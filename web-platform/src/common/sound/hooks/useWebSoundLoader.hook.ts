import { useMountEffect } from '@noice-com/common-react-core';
import { SoundAssetLoader } from '@noice-com/common-ui';
import { useState } from 'react';

import { getWebSoundConfig, getWebSounds } from '../utils';

export function useWebSoundLoader(): SoundAssetLoader | null {
  const [soundAssetLoader, setSoundAssetLoader] = useState<SoundAssetLoader | null>(null);

  useMountEffect(() => {
    const initLoader = async () => {
      const instance = new SoundAssetLoader('web');
      getWebSoundConfig(instance);
      await getWebSounds(instance);
      setSoundAssetLoader(instance);
    };

    initLoader();
  });

  return soundAssetLoader;
}
