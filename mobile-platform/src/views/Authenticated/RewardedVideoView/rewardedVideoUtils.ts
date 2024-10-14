import { ImageSourcePropType } from 'react-native';

import { colors } from '@constants/styles';
import { RarityRarity } from '@gen/graphql';
import { WalletCurrencyId } from '@utils/currency';
import { ImageAssets } from '@utils/image';

export const TIMED_REWARDS_PLACEMENT_ID = 'timed-reward';

export const rewardRarityLabel: Record<RarityRarity, string> = {
  [RarityRarity.RarityCommon]: 'Common',
  [RarityRarity.RarityUncommon]: 'Uncommon',
  [RarityRarity.RarityRare]: 'Rare',
  [RarityRarity.RarityEpic]: 'Epic',
  [RarityRarity.RarityLegendary]: 'Legendary',
  [RarityRarity.RarityUnspecified]: 'Unspecified',
} as const;

export const rewardRarityLabelColor: Record<RarityRarity, keyof typeof colors> = {
  [RarityRarity.RarityCommon]: 'white',
  [RarityRarity.RarityUncommon]: 'white',
  [RarityRarity.RarityRare]: 'tealMain',
  [RarityRarity.RarityEpic]: 'violet200',
  [RarityRarity.RarityLegendary]: 'yellowGreen200',
  [RarityRarity.RarityUnspecified]: 'white',
} as const;

export const currencyImageMap: Record<WalletCurrencyId, ImageSourcePropType> = {
  [WalletCurrencyId.SoftCurrency]: ImageAssets.CoinLg,
  [WalletCurrencyId.ReshuffleToken]: ImageAssets.ReshuffleTokenLg,
  [WalletCurrencyId.HardCurrency]: ImageAssets.CreditLg,
  [WalletCurrencyId.ChannelCurrency]: ImageAssets.CoinLg,
} as const;

export const chestSpriteSheetImageMap: Record<RarityRarity, ImageSourcePropType> = {
  [RarityRarity.RarityCommon]: ImageAssets.commonChestSpriteSheet,
  [RarityRarity.RarityUncommon]: ImageAssets.uncommonChestSpriteSheet,
  [RarityRarity.RarityRare]: ImageAssets.rareChestSpriteSheet,
  [RarityRarity.RarityEpic]: ImageAssets.epicChestSpriteSheet,
  [RarityRarity.RarityLegendary]: ImageAssets.legendaryChestSpriteSheet,
  [RarityRarity.RarityUnspecified]: ImageAssets.commonChestSpriteSheet,
} as const;

export const chestFxSheetImageMap: Record<RarityRarity, ImageSourcePropType> = {
  [RarityRarity.RarityCommon]: ImageAssets.commonChestFxSpriteSheet,
  [RarityRarity.RarityUncommon]: ImageAssets.uncommonChestFxSpriteSheet,
  [RarityRarity.RarityRare]: ImageAssets.rareChestFxSpriteSheet,
  [RarityRarity.RarityEpic]: ImageAssets.epicChestFxSpriteSheet,
  [RarityRarity.RarityLegendary]: ImageAssets.legendaryChestFxSpriteSheet,
  [RarityRarity.RarityUnspecified]: ImageAssets.commonChestFxSpriteSheet,
} as const;

export const chestStaticImageMap: Record<RarityRarity, ImageSourcePropType> = {
  [RarityRarity.RarityCommon]: ImageAssets.commonChest,
  [RarityRarity.RarityUncommon]: ImageAssets.uncommonChest,
  [RarityRarity.RarityRare]: ImageAssets.rareChest,
  [RarityRarity.RarityEpic]: ImageAssets.epicChest,
  [RarityRarity.RarityLegendary]: ImageAssets.legendaryChest,
  [RarityRarity.RarityUnspecified]: ImageAssets.commonChest,
} as const;

export const currencyRewardGlow: Record<WalletCurrencyId, ImageSourcePropType> = {
  [WalletCurrencyId.SoftCurrency]: ImageAssets.softCurrencyRewardGlow,
  [WalletCurrencyId.HardCurrency]: ImageAssets.hardCurrencyRewardGlow,
  [WalletCurrencyId.ReshuffleToken]: ImageAssets.reshuffleCurrencyRewardGlow,
  [WalletCurrencyId.ChannelCurrency]: ImageAssets.hardCurrencyRewardGlow,
};
