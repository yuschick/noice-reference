// ! IMPORTANT ! Make sure that you keep this in alphabetical order so they are easier to compare to the directory.
// 1. These are batched so that we dont have to asyncronously import each path.
// 2. This gets imported via the individual sound loaders.
// 3. Try to always make sure the exported variable is named the same as the imports! ex:
// export <soundname> = [<soundname>Mp3, <soundname>Webm>];
// This makes tweaking these and adding new ones MUCH easier.

import ShopCardRevealMp3 from './ui_shop_card_reveal.mp3';
import ShopCardRevealWebm from './ui_shop_card_reveal.webm';
import ShopCardRevealEpicLegendaryMp3 from './ui_shop_card_reveal_epic_legendary.mp3';
import ShopCardRevealEpicLegendaryWebm from './ui_shop_card_reveal_epic_legendary.webm';
import ShopInsufficientCurrencyMp3 from './ui_shop_insufficient_currency.mp3';
import ShopInsufficientCurrencyWebm from './ui_shop_insufficient_currency.webm';
import ShopPurchaseGenericMp3 from './ui_shop_purchase_generic.mp3';
import ShopPurchaseGenericWebm from './ui_shop_purchase_generic.webm';
import ShopPurchasePremiumBundleMp3 from './ui_shop_purchase_premium_bundle.mp3';
import ShopPurchasePremiumBundleWebm from './ui_shop_purchase_premium_bundle.webm';
import ShopPurchaseStandardBundleMp3 from './ui_shop_purchase_standard_bundle.mp3';
import ShopPurchaseStandardBundleWebm from './ui_shop_purchase_standard_bundle.webm';

export const ShopCardRevealEpicLegendary = [
  ShopCardRevealEpicLegendaryWebm,
  ShopCardRevealEpicLegendaryMp3,
];
export const ShopCardReveal = [ShopCardRevealWebm, ShopCardRevealMp3];
export const ShopInsufficientCurrency = [
  ShopInsufficientCurrencyWebm,
  ShopInsufficientCurrencyMp3,
];
export const ShopPurchaseGeneric = [ShopPurchaseGenericWebm, ShopPurchaseGenericMp3];
export const ShopPurchasePremiumBundle = [
  ShopPurchasePremiumBundleWebm,
  ShopPurchasePremiumBundleMp3,
];
export const ShopPurchaseStandardBundle = [
  ShopPurchaseStandardBundleWebm,
  ShopPurchaseStandardBundleMp3,
];
