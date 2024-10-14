import { gql } from '@apollo/client';
import { useWallet } from '@noice-com/common-ui';
import { Notification } from '@noice-com/schemas/notification/notification.pb';
import { OperationType, TransactionEvent } from '@noice-com/schemas/wallet/wallet.pb';
import { Nullable } from '@noice-com/utils';
import { useCallback } from 'react';

import { StoreItemNotificationContent } from '../../content';
import { Context } from '../NotificationProvider';

import { useSelectedUIState } from '@context';
import {
  StoreItemNotificationContentStoreV2SellableItemFragment,
  useNotificationsStoreFrontLazyQuery,
} from '@gen';

gql`
  query NotificationsStoreFront($gameId: ID!) {
    platformStoreFront(gameId: $gameId) {
      id
      gameId
      categories {
        id
        sellableItems {
          id
          igcPrices {
            currencyId
            amount
          }
          ...StoreItemNotificationContentStoreV2SellableItem
        }
      }
    }
  }
`;

interface HookResult {
  onWalletTransaction(ctx: Notification, ev: TransactionEvent): void;
}

type Props = Context['actions'];

export function useWalletTransactionNotification({
  addNotification,
  removeNotification,
}: Props): HookResult {
  const { selectedGameId } = useSelectedUIState();
  const { currencies } = useWallet();

  const [fetchStoreFront] = useNotificationsStoreFrontLazyQuery();

  const onWalletTransaction = useCallback(
    async (ctx: Notification, ev: TransactionEvent) => {
      const addTransactions = ev.transaction?.operations?.filter(
        (operation) => operation.type === OperationType.TYPE_ADD,
      );

      // Ignore if no add events or no selected game
      if (!addTransactions?.length || !selectedGameId) {
        return;
      }

      const { data } = await fetchStoreFront({
        variables: { gameId: selectedGameId },
      });

      const sellableItems = data?.platformStoreFront?.categories
        ? data.platformStoreFront.categories
            // Flat to have only sellable items (== bundles)
            .flatMap((category) => category.sellableItems)
        : [];

      addTransactions.forEach((transaction) => {
        if (!sellableItems) {
          return;
        }

        const transactionCurrencyId = transaction.currencyId;

        if (!transactionCurrencyId) {
          return;
        }

        const walletCurrency = currencies.find(
          (currency) => currency.currencyId === transactionCurrencyId,
        );

        if (!walletCurrency?.currencyAmount) {
          return;
        }

        const sortedStoreItems = sellableItems
          // Filter out sellable items with wrong price
          .filter(
            ({ igcPrices }) =>
              !!igcPrices?.some(({ currencyId }) => currencyId === transactionCurrencyId),
          )
          // Map to have currency amount
          .map((storeItem) => ({
            ...storeItem,
            currencyAmount:
              storeItem.igcPrices?.find(
                ({ currencyId }) => currencyId === transactionCurrencyId,
              )?.amount ?? 0,
          }))
          // Sort by currency amount
          .sort((a, b) => a.currencyAmount - b.currencyAmount);

        const addedCurrencyAmount = parseInt(transaction.currencyAmount ?? '0', 10);

        // Wallet has not updated yet at this point, so we need to calculate the new balance
        const currenctBalance = walletCurrency.currencyAmount + addedCurrencyAmount;
        const balanceBeforeTransaction = walletCurrency.currencyAmount;

        // Find first item that user can afford, but couldn't afford before the transaction
        const storeItem: Nullable<StoreItemNotificationContentStoreV2SellableItemFragment> =
          sortedStoreItems.find((item) => {
            // User can not afford this item, so return false
            if (currenctBalance < item.currencyAmount) {
              return false;
            }

            // If user afford this item before the transaction, return false
            if (balanceBeforeTransaction >= item.currencyAmount) {
              return false;
            }

            return true;
          }) ?? null;

        if (!storeItem || !ctx.id) {
          return;
        }

        addNotification({
          component: {
            type: StoreItemNotificationContent,
            props: {
              storeItem,
              onLinkClick(notificationId: string) {
                removeNotification(notificationId);
              },
            },
          },
        });
      });
    },
    [addNotification, currencies, fetchStoreFront, removeNotification, selectedGameId],
  );

  return {
    onWalletTransaction,
  };
}
