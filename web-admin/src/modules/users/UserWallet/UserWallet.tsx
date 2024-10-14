import { gql } from '@apollo/client';
import { useParams } from 'react-router';

import { CurrencyUpdate } from './types';
import styles from './UserWallet.module.css';
import { WalletCurrency } from './WalletCurrency';

import {
  useUserWalletQuery,
  useUserWalletAddCurrencyMutation,
  useUserWalletSubtractCurrencyMutation,
} from '@gen';

gql`
  query UserWallet($userId: ID) {
    wallet(userId: $userId) {
      wallet {
        userId
        currencies {
          currencyId
          currencyAmount
        }
      }
    }
  }
`;

gql`
  mutation UserWalletAddCurrency(
    $userId: ID
    $currencies: [WalletWalletCurrencyInput!]
    $reason: ReasonReasonInput!
  ) {
    addWalletCurrencies(userId: $userId, currencies: $currencies, reason: $reason) {
      emptyTypeWorkaround
    }
  }
`;

gql`
  mutation UserWalletSubtractCurrency(
    $userId: ID
    $currencies: [WalletWalletCurrencyInput!]
    $reason: ReasonReasonInput!
  ) {
    subtractWalletCurrencies(userId: $userId, currencies: $currencies, reason: $reason) {
      emptyTypeWorkaround
    }
  }
`;

export function UserWallet() {
  const { userId } = useParams();
  const { data, refetch: refetchWalletCurrencies } = useUserWalletQuery({
    variables: { userId },
  });
  const [addWalletCurrencies] = useUserWalletAddCurrencyMutation({
    onCompleted() {
      refetchWalletCurrencies();
    },
  });
  const [subtractWalletCurrencies] = useUserWalletSubtractCurrencyMutation({
    onCompleted() {
      refetchWalletCurrencies();
    },
  });

  const addWalletCurrency = async ({
    currency,
    amount,
    reason,
  }: CurrencyUpdate): Promise<void> => {
    await addWalletCurrencies({
      variables: {
        currencies: [{ ...currency, currencyAmount: amount }],
        userId,
        reason: {
          administrative: {
            reason,
          },
        },
      },
    });
  };

  const subtractWalletCurrency = async ({
    currency,
    amount,
    reason,
  }: CurrencyUpdate): Promise<void> => {
    await subtractWalletCurrencies({
      variables: {
        currencies: [{ ...currency, currencyAmount: amount }],
        userId,
        reason: {
          administrative: {
            reason,
          },
        },
      },
    });
  };

  // Filter out channel currencies for now, until we know what we wan to do with them.
  const currencies =
    data?.wallet?.wallet.currencies.filter(
      ({ currencyId }) => !currencyId.includes('channel'),
    ) || [];

  return (
    <ul className={styles.currenciesList}>
      {currencies.map((currency) => (
        <WalletCurrency
          addWalletCurrency={addWalletCurrency}
          currency={currency}
          key={currency.currencyId}
          subtractWalletCurrency={subtractWalletCurrency}
        />
      ))}
    </ul>
  );
}
