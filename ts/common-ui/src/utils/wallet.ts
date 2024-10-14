import { EnumUtils, Nullable } from '@noice-com/utils';

import { PaymentCurrency } from '@common-gen';
import { WalletCurrencyId } from '@common-types';

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

export const getWalletCurrencyIdName = (
  currencyId: Nullable<WalletCurrencyId>,
  plural = true,
): string => {
  if (currencyId === WalletCurrencyId.HardCurrency) {
    return plural ? 'Credits' : 'Credit';
  }

  if (currencyId === WalletCurrencyId.ReshuffleToken) {
    return plural ? 'Reshuffle tokens' : 'Reshuffle token';
  }

  if (currencyId === WalletCurrencyId.SoftCurrency) {
    return plural ? 'Coins' : 'Coin';
  }

  if (currencyId === WalletCurrencyId.ChannelCurrency) {
    return plural ? 'Channel currencies' : 'Channel currency';
  }

  return plural ? 'Currencies' : 'Currency';
};

type GetFormattedPrice = {
  currency: PaymentCurrency;
  locale?: string;
  price: number;
};

export function getFormattedPriceWithCurrency({
  currency,
  locale,
  price,
}: GetFormattedPrice): string {
  if (currency === PaymentCurrency.CurrencyUnspecified) {
    // If the currency is unspecified, we just format the price as a number
    return new Intl.NumberFormat(locale).format(price / 100);
  }

  const intlCurrency = currency.replace('CURRENCY_', '');

  // Locale defaults to undefined to use system locale
  try {
    const priceWithCurrency = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: intlCurrency,
    }).format(price / 100);

    return priceWithCurrency;
  } catch (e) {
    return new Intl.NumberFormat(locale).format(price / 100);
  }
}
