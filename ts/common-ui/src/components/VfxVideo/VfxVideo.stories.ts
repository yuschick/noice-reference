import { CoreAssets } from '@noice-com/assets-core';

import { VfxVideo } from './VfxVideo';

export default {
  title: 'VfxVideo',
  component: VfxVideo,
};

export const Default = {
  args: {
    src: CoreAssets.VFX.CardSuccess,
    isPlaying: true,
  },
};

export const Loop = {
  args: {
    src: CoreAssets.VFX.CardSuccess,
    isPlaying: true,
    loop: true,
  },
};

export const Delay = {
  args: {
    src: CoreAssets.VFX.CardSuccess,
    isPlaying: true,
    loop: true,
    delay: 2000,
  },
};
