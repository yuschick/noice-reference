import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import { useMemo } from 'react';

import { useAuthentication } from '@common-context';
import { WalletCurrencyFragment, useWalletQuery } from '@common-gen';
import { Wallet, WalletCurrencyId } from '@common-types';

const defaultWallet = {
  [WalletCurrencyId.ChannelCurrency]: 0,
  [WalletCurrencyId.HardCurrency]: 0,
  [WalletCurrencyId.ReshuffleToken]: 0,
  [WalletCurrencyId.SoftCurrency]: 0,
};

interface HookResult {
  wallet: Wallet;
  currencies: WalletCurrencyFragment[];
}

export function useWallet(): HookResult {
  const { userId, isImplicitAccount } = useAuthentication();

  const { data } = useWalletQuery({
    ...variablesOrSkip({ userId }),
    fetchPolicy: 'cache-only',
  });

  const currencies = useMemo(() => {
    if (!userId) {
      return [
        {
          currencyId: WalletCurrencyId.HardCurrency,
          currencyAmount: 0,
        },
        {
          currencyId: WalletCurrencyId.SoftCurrency,
          currencyAmount: 0,
        },
      ];
    }

    if (!isImplicitAccount) {
      return data?.wallet?.wallet.currencies ?? [];
    }

    return (
      data?.wallet?.wallet.currencies.map((currency) => {
        if (currency.currencyId !== WalletCurrencyId.HardCurrency) {
          return currency;
        }

        return {
          ...currency,
          // For implicit accounts, reduce 250 hard currency from the wallet
          // so it feels like they get 250 hard currency for free when they sign up
          // (but show at least 0)
          currencyAmount: Math.max(currency.currencyAmount - 250, 0),
        };
      }) ?? []
    );
  }, [data?.wallet?.wallet.currencies, isImplicitAccount, userId]);

  const wallet = useMemo(
    () =>
      currencies.reduce<Wallet>(
        (prev, curr) => ({
          ...prev,
          [curr.currencyId]: curr.currencyAmount,
        }),
        defaultWallet,
      ) ?? defaultWallet,
    [currencies],
  );

  return { wallet, currencies };
}
