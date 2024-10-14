import { WalletWalletCurrency } from '@gen';

export interface CurrencyUpdate {
  currency: WalletWalletCurrency;
  amount: number;
  reason: string;
}
