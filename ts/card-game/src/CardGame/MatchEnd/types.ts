import { WalletCurrencyId } from '@noice-com/common-ui';

export type MatchEndCurrencyRewardsList = {
  currencyId: WalletCurrencyId;
  amount: number;
}[];

export type MatchEndSeasonProgressionRewards = {
  level: number;
  currentLevelXp: number;
  nextLevelXp: number;
  currentXp: number;
  rankUp: boolean;
};

export type MatchEndBonusRewards = {
  participation: boolean;
  teamPlayer: boolean;
};

export type MatchEndRewards = {
  currency: MatchEndCurrencyRewardsList;
  seasonProgresion: MatchEndSeasonProgressionRewards;
  bonuses: MatchEndBonusRewards;
};
