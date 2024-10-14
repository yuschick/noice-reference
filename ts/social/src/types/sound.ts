import { CommonSoundKeys } from '@noice-com/common-ui';

// merge enums
export type SocialSoundKeys = CommonSoundKeys; // add | SocialSoundKeys etc. when needed ;
export const SocialSoundKeys = {
  ...CommonSoundKeys,
};
