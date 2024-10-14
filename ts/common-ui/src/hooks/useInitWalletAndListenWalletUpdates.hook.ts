import { gql, useApolloClient } from '@apollo/client';
import { useClient } from '@noice-com/common-react-core';
import { useEffect, useState } from 'react';

import { useAuthenticatedUser } from '@common-context';
import {
  WalletCurrencyFragment,
  WalletDocument,
  WalletQuery,
  useWalletQuery,
} from '@common-gen';

gql`
  query Wallet($userId: ID!) {
    wallet(userId: $userId) {
      wallet {
        currencies {
          ...WalletCurrency
        }
      }
    }
  }

  fragment WalletCurrency on WalletWalletCurrency {
    currencyId
    currencyAmount
  }
`;

export function useInitWalletAndListenWalletUpdates() {
  const { userId } = useAuthenticatedUser();
  const client = useClient();
  const { cache } = useApolloClient();

  const [listenForNotifications, setListenForNotifications] = useState(false);

  useWalletQuery({
    variables: {
      userId,
    },
    onCompleted() {
      setListenForNotifications(true);
    },
  });

  useEffect(() => {
    // Do not listen notifications until we have fetched initial wallet data
    if (!listenForNotifications) {
      return;
    }

    return client.NotificationService.notifications({
      onWalletTransaction(_ctx, ev) {
        cache.updateQuery<WalletQuery>(
          {
            query: WalletDocument,
            variables: { userId },
          },
          (data) => {
            if (!data?.wallet?.wallet.currencies) {
              return data;
            }

            const currencies = data.wallet.wallet.currencies.reduce<
              WalletCurrencyFragment[]
            >((prev, curr) => {
              const currentCurrencyTransactions = ev.transaction?.operations?.filter(
                (operation) => operation.currencyId === curr.currencyId,
              );

              if (!currentCurrencyTransactions?.length) {
                return [...prev, curr];
              }

              const latestTransaction = currentCurrencyTransactions.at(-1);

              if (!latestTransaction?.currencyBalance) {
                return [...prev, curr];
              }

              return [
                ...prev,
                {
                  ...curr,
                  currencyAmount: parseInt(latestTransaction.currencyBalance, 10),
                },
              ];
            }, []);

            return {
              ...data,
              wallet: { ...data.wallet, wallet: { ...data.wallet.wallet, currencies } },
            };
          },
        );
      },
    });
  }, [cache, client.NotificationService, listenForNotifications, userId]);
}
