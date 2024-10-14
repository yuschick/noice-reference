import * as CoreImages from '@noice-com/assets-core/src/images';
import { ImageSourcePropType } from 'react-native';
const assetRegistry = {
  background: require('@assets/images/base-gradient.png'),
  bannerFallback: require('@assets/images/temp-banner-fallback.png'),
  rewardBoxGold: require('@assets/images/reward-box-gold.png'),

  /* These are not in assets-core, should they? */
  commonChestSpriteSheet: require('@assets/images/rewards/timed-ads-reward-box-common.png'),
  commonChestFxSpriteSheet: require('@assets/images/rewards/timed-ads-reward-box-common-fx.png'),
  uncommonChestSpriteSheet: require('@assets/images/rewards/timed-ads-reward-box-uncommon.png'),
  uncommonChestFxSpriteSheet: require('@assets/images/rewards/timed-ads-reward-box-uncommon-fx.png'),
  rareChestSpriteSheet: require('@assets/images/rewards/timed-ads-reward-box-rare.png'),
  rareChestFxSpriteSheet: require('@assets/images/rewards/timed-ads-reward-box-rare-fx.png'),
  epicChestSpriteSheet: require('@assets/images/rewards/timed-ads-reward-box-epic.png'),
  epicChestFxSpriteSheet: require('@assets/images/rewards/timed-ads-reward-box-epic-fx.png'),
  legendaryChestSpriteSheet: require('@assets/images/rewards/timed-ads-reward-box-legendary.png'),
  legendaryChestFxSpriteSheet: require('@assets/images/rewards/timed-ads-reward-box-legendary-fx.png'),

  commonChest: require('@assets/images/rewards/timed-ads-reward-chest-common-static.png'),
  uncommonChest: require('@assets/images/rewards/timed-ads-reward-chest-uncommon-static.png'),
  rareChest: require('@assets/images/rewards/timed-ads-reward-chest-rare-static.png'),
  epicChest: require('@assets/images/rewards/timed-ads-reward-chest-epic-static.png'),
  legendaryChest: require('@assets/images/rewards/timed-ads-reward-chest-legendary-static.png'),

  softCurrencyRewardGlow: require('@assets/images/rewards/timed-ads-reward-glow.png'),
  hardCurrencyRewardGlow: require('@assets/images/rewards/timed-ads-reward-glow-red.png'),
  reshuffleCurrencyRewardGlow: require('@assets/images/rewards/timed-ads-reward-glow-green.png'),

  arenaBackground: require('@assets/images/arena-background.jpg'),

  seasonRankBadgeGoldIdleVfx: require('@assets/images/badges/vfx/rank-badge-idle-vfx-gold.png'),
  seasonRankBadgeMagentaIdleVfx: require('@assets/images/badges/vfx/rank-badge-idle-vfx-magenta.png'),
  seasonRankBadgeSpectrumIdleVfx: require('@assets/images/badges/vfx/rank-badge-idle-vfx-spectrum.png'),
  seasonRankBadgeTealIdleVfx: require('@assets/images/badges/vfx/rank-badge-idle-vfx-teal.png'),
  seasonRankBadgeVioletIdleVfx: require('@assets/images/badges/vfx/rank-badge-idle-vfx-violet.png'),
  ...CoreImages,
} as const;

export const ImageAssets: Record<keyof typeof assetRegistry, ImageSourcePropType> = {
  ...assetRegistry,
} as const;
