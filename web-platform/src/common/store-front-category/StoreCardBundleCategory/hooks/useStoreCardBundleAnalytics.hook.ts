import { gql } from '@apollo/client';
import { useAnalytics, useWallet } from '@noice-com/common-ui';
import {
  AnalyticsEventClientStoreItemClicked,
  BundleItem,
} from '@noice-com/schemas/analytics/analytics.pb';
import { useCallback } from 'react';

import { storeV2ItemTypeToAnalyticsItemTypeMap } from '@common/analytics';
import { useListenAppLocalStorageValue } from '@common/localstorage';
import { getNullableSellableItemIgcPrice } from '@common/sellable-item';
import {
  StoreCardBundleAnalyticsIgcPriceFragment,
  StoreCardBundleAnalyticsSellableItemFragment,
} from '@gen';

gql`
  fragment StoreCardBundleAnalyticsSellableItem on StoreV2SellableItem {
    id
    signature
    type
    content {
      value {
        ... on StoreV2ItemRef {
          id
        }
        ... on StoreV2CurrencyRef {
          id
        }
        ... on StoreV2SubscriptionRef {
          id
        }
      }
    }
    igcPrices {
      ...StoreCardBundleAnalyticsIgcPrice
    }
  }

  fragment StoreCardBundleAnalyticsIgcPrice on StoreV2InGameCurrencyPrice {
    currencyId
    default
    amount
  }
`;

interface HookResult {
  onCardBundleLinkClick(sellableItem: StoreCardBundleAnalyticsSellableItemFragment): void;
}

export function useStoreCardBundleAnalytics(): HookResult {
  const { trackEvent } = useAnalytics();
  const { currencies } = useWallet();

  const [revealedStoreBundles] = useListenAppLocalStorageValue('store.bundle.revealed');

  const onCardBundleLinkClick = useCallback(
    (sellableItem: StoreCardBundleAnalyticsSellableItemFragment) => {
      const isRevealed = revealedStoreBundles.includes(sellableItem.signature);

      const items = sellableItem.content.map<BundleItem>(({ value }) => ({
        itemId: value?.id,
        revealed: isRevealed,
      }));

      const price =
        getNullableSellableItemIgcPrice<StoreCardBundleAnalyticsIgcPriceFragment>(
          sellableItem.igcPrices ?? [],
        );

      const eventMetaData: AnalyticsEventClientStoreItemClicked = {
        action: 'BundleClicked',
        bundle: {
          id: sellableItem.id,
          items,
          revealed: isRevealed,
        },
        itemType: storeV2ItemTypeToAnalyticsItemTypeMap[sellableItem.type],
        wallet: currencies.map((currency) => ({
          ...currency,
          currencyAmount: `${currency.currencyAmount}`,
        })),
        cost: {
          currencyId: price?.currencyId ?? '',
          currencyAmount: `${price?.amount ?? 0}`,
        },
      };

      trackEvent({
        clientStoreItemClicked: eventMetaData,
      });
    },
    [currencies, revealedStoreBundles, trackEvent],
  );

  return {
    onCardBundleLinkClick,
  };
}
