import { CommonSoundKeys } from '@noice-com/common-ui';

import { usePlaySound, AppSoundKeys } from '@common/sound';

interface HookResult {
  playBundleNavigationSound: () => void;
  playBundleCloseSound: () => void;
  playRevealStreamerCardSound(): void;
  playRevealEpicLegendaryCardSound(): void;
  playRevealCardSound(): void;
}

export function useStoreItemSounds(): HookResult {
  const [playButtonClickConfirmSound] = usePlaySound(AppSoundKeys.ButtonClickConfirm);
  const [playMenuCloseSound] = usePlaySound(AppSoundKeys.MenuClose);
  const [playRevealStreamerCardSound] = usePlaySound(CommonSoundKeys.AssetReveal);
  const [playRevealEpicLegendaryCardSound] = usePlaySound(
    AppSoundKeys.ShopCardRevealEpicLegendary,
  );
  const [playRevealCardSound] = usePlaySound(AppSoundKeys.ShopCardReveal);

  return {
    playBundleNavigationSound: playButtonClickConfirmSound,
    playBundleCloseSound: playMenuCloseSound,
    playRevealStreamerCardSound,
    playRevealEpicLegendaryCardSound,
    playRevealCardSound,
  };
}
