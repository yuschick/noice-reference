import { WalletCurrencyId } from '@noice-com/common-ui';

export type PlatformStoreItemType =
  | WalletCurrencyId.HardCurrency
  | WalletCurrencyId.ReshuffleToken
  | 'standard-card-bundle';
