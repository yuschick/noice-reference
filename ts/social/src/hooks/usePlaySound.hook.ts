import {
  SoundConfig,
  // eslint-disable-next-line no-restricted-imports
  usePlaySound as usePlaySoundHook,
} from '@noice-com/common-ui';

import { SocialSoundKeys } from '@social-types';

export function usePlaySound<
  Keys extends typeof SocialSoundKeys & { [index: string]: string },
  Key extends keyof Keys & string,
>(sound: Key, opts?: Partial<SoundConfig>) {
  return usePlaySoundHook<Keys, Key>(sound, opts);
}
