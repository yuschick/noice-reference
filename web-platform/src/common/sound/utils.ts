import { SoundAssetLoader, CommonConfig } from '@noice-com/common-ui';

import { AppSoundKeys } from './types';

export function getWebSoundConfig(loader: SoundAssetLoader): void {
  CommonConfig.addCommonSoundConfig(loader);
  loader.config({
    [AppSoundKeys.ShopCardReveal]: { volume: 0.15 },
    [AppSoundKeys.ShopCardRevealEpicLegendary]: { volume: 0.15 },
    [AppSoundKeys.ShopInsufficientCurrency]: { volume: 0.25 }, // has not been refined
    [AppSoundKeys.ShopPurchaseGeneric]: { volume: 0.15 },
    [AppSoundKeys.ShopPurchasePremiumBundle]: { volume: 0.15 },
    [AppSoundKeys.ShopPurchaseStandardBundle]: { volume: 0.15 },
  });
}

export async function getWebSounds(loader: SoundAssetLoader): Promise<void> {
  const [web] = await Promise.all([
    import('@assets/audio/v2/app/assets'),
    CommonConfig.addCommonSounds(loader),
  ]);

  loader.add(AppSoundKeys.ShopCardReveal, web.ShopCardReveal);
  loader.add(AppSoundKeys.ShopCardRevealEpicLegendary, web.ShopCardRevealEpicLegendary);
  loader.add(AppSoundKeys.ShopInsufficientCurrency, web.ShopInsufficientCurrency);
  loader.add(AppSoundKeys.ShopPurchaseGeneric, web.ShopPurchaseGeneric);
  loader.add(AppSoundKeys.ShopPurchasePremiumBundle, web.ShopPurchasePremiumBundle);
  loader.add(AppSoundKeys.ShopPurchaseStandardBundle, web.ShopPurchaseStandardBundle);
}
