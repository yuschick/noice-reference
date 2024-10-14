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
