import { GameSoundKeys } from '@noice-com/card-game';
import { CommonSoundKeys } from '@noice-com/common-ui';
import { SocialSoundKeys } from '@noice-com/social';

enum AppOnlySoundKeys {
  // Web
  ShopCardReveal = 'ShopCardReveal',
  ShopCardRevealEpicLegendary = 'ShopCardRevealEpicLegendary',
  ShopInsufficientCurrency = 'ShopInsufficientCurrency',
  ShopPurchaseGeneric = 'ShopPurchaseGeneric',
  ShopPurchasePremiumBundle = 'ShopPurchasePremiumBundle',
  ShopPurchaseStandardBundle = 'ShopPurchaseStandardBundle',
}

// merge enums
export type AppSoundKeys =
  | AppOnlySoundKeys
  | CommonSoundKeys
  | GameSoundKeys
  | SocialSoundKeys;
export const AppSoundKeys = {
  ...AppOnlySoundKeys,
  ...CommonSoundKeys,
  ...GameSoundKeys,
  ...SocialSoundKeys,
};
