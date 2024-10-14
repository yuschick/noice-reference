import { WalletCurrencyId, Wallet } from '@noice-com/common-ui';
import { EnumUtils, Nullable } from '@noice-com/utils';

export function canWalletBuyItem(
  wallet: Nullable<Wallet>,
  item?: Nullable<{ currencyId: string; currencyAmount: number }>,
): boolean {
  if (wallet && item && item.currencyId && item.currencyAmount) {
    const currencyKey = EnumUtils.getEnumKeyByEnumValue(
      WalletCurrencyId,
      item.currencyId,
    );

    if (!currencyKey) {
      return false;
    }

    const currencyType = WalletCurrencyId[currencyKey];
    const walletFundsForItem = wallet[currencyType];
    const requiredFundsForItem = item.currencyAmount;

    if (!isNaN(walletFundsForItem) && !isNaN(requiredFundsForItem)) {
      return walletFundsForItem >= requiredFundsForItem;
    }
  }

  return false;
}
