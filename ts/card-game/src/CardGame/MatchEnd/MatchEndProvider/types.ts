import { WalletCurrencyId } from '@noice-com/common-ui';

export interface PostMatchLevelReward {
  oldLevel: number;
  newLevel: number;
  levelThresholds: number[];
}

export interface PostMatchXPReward {
  newTotal: number;
  received: number;
  receivedExcludingBonuses: number;
  remainingDailyBoost: number;
  dailyBoost: number;
  teamPlayerBonus: number;
  participationBonus: number;
}

export interface PostMatchWalletReward {
  currencyType: WalletCurrencyId;
  received: number;
  receivedExcludingBonuses: number;
  participationBonus: number;
  teamPlayerBonus: number;
}

export interface MatchRewards {
  levelRewards: PostMatchLevelReward;
  xpRewards: PostMatchXPReward;
  walletRewards: PostMatchWalletReward;
}
