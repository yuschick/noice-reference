import {
  SoundConfig,
  // eslint-disable-next-line no-restricted-imports
  usePlaySound as usePlaySoundHook,
} from '@noice-com/common-ui';

import { GameSoundKeys } from '@game-types';

export function usePlaySound<
  Keys extends typeof GameSoundKeys & { [index: string]: string },
  Key extends keyof Keys & string,
>(sound: Key, opts?: Partial<SoundConfig>) {
  return usePlaySoundHook<Keys, Key>(sound, opts);
}
