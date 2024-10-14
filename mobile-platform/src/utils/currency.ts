import { gql } from '@apollo/client';
import { EnumUtils } from '@noice-com/utils';

import { AvailableRewardsFragment } from '@gen/graphql';

export enum WalletCurrencyId {
  SoftCurrency = 'soft-currency',
  HardCurrency = 'hard-currency',
  ReshuffleToken = 'reshuffle-token',
  ChannelCurrency = 'channel-currency',
}

export interface Wallet {
  [WalletCurrencyId.ChannelCurrency]: number;
  [WalletCurrencyId.HardCurrency]: number;
  [WalletCurrencyId.ReshuffleToken]: number;
  [WalletCurrencyId.SoftCurrency]: number;
}

export function getWalletCurrencyId(
  stringId: string | undefined,
): WalletCurrencyId | null {
  if (!stringId) {
    return null;
  }

  const currencyIdKey = EnumUtils.getEnumKeyByEnumValue(WalletCurrencyId, stringId);

  if (!currencyIdKey) {
    return null;
  }

  return WalletCurrencyId[currencyIdKey];
}

gql`
  fragment AvailableRewards on AdsRewardDescription {
    readyAt
  }
`;

export const filterAvailableRewards = (rewards: AvailableRewardsFragment[]) =>
  rewards.filter((reward) => new Date(reward.readyAt).getTime() < Date.now());
