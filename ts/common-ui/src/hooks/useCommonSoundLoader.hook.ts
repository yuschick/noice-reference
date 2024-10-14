import { useMountEffect } from '@noice-com/common-react-core';
import { useState } from 'react';

import { SoundAssetLoader } from '@common-classes';
import { addCommonSoundConfig, addCommonSounds } from '@common-config';

export function useCommonSoundLoader(): SoundAssetLoader | null {
  const [soundAssetLoader, setSoundAssetLoader] = useState<SoundAssetLoader | null>(null);

  useMountEffect(() => {
    const initLoader = async () => {
      const instance = new SoundAssetLoader('common');
      addCommonSoundConfig(instance);
      await addCommonSounds(instance);
      setSoundAssetLoader(instance);
    };

    initLoader();
  });

  return soundAssetLoader;
}
