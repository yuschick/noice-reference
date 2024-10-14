import { CoreAssets } from '@noice-com/assets-core';
import {
  RewardDescriptionPrizeDescription,
  RewardDescriptionPrizeDescriptionKind,
} from '@noice-com/schemas/ads/ads.pb';

import { TimedAdsVideoRewardFragment } from '@gen';

export function convertRewardsForAnalytics(
  reward: TimedAdsVideoRewardFragment,
): RewardDescriptionPrizeDescription[] {
  return reward.prizes.map((reward) => {
    return {
      amount: '0',
      max: `${reward.max}`,
      min: `${reward.min}`,
      value: reward.value,
      kind: RewardDescriptionPrizeDescriptionKind.KIND_CURRENCY,
    };
  });
}

export function getCurrencyIcon(currencyId: string | undefined) {
  switch (currencyId) {
    case 'hard-currency':
      return CoreAssets.Images.CreditXl;
    case 'soft-currency':
      return CoreAssets.Images.CoinXl;
    case 'reshuffle-token':
      return CoreAssets.Images.ReshuffleTokenXl;
    default:
      return null;
  }
}
