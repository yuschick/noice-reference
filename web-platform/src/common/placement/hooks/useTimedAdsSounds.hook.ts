import { CommonSoundKeys } from '@noice-com/common-ui';

import { usePlaySound, AppSoundKeys } from '@common/sound';

interface HookResult {
  playOpenRewardsSound(): void;
  playCloseAdSound(): void;
  playClickSound(): void;
  playHoverSound(): void;
  playShowAdSound(): void;
}

export function useTimedAdsSounds(): HookResult {
  const [playOpenRewardsSound] = usePlaySound(CommonSoundKeys.AssetReveal, {
    delay: 600,
  });
  const [playCloseAdSound] = usePlaySound(AppSoundKeys.MenuClose);
  const [playClickSound] = usePlaySound(AppSoundKeys.ButtonClickConfirm);
  const [playHoverSound] = usePlaySound(AppSoundKeys.GenericHover);
  const [playShowAdSound] = usePlaySound(AppSoundKeys.MenuOpen);

  return {
    playOpenRewardsSound,
    playCloseAdSound,
    playClickSound,
    playHoverSound,
    playShowAdSound,
  };
}
