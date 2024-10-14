import { gql } from '@apollo/client';
import { useAnalytics, useWallet } from '@noice-com/common-ui';
import {
  AnalyticsEventClientStorePage,
  Bundle,
  BundleItem,
} from '@noice-com/schemas/analytics/analytics.pb';
import { Nullable } from '@noice-com/utils';
import { useCallback, useEffect, useRef } from 'react';

import { useListenAppLocalStorageValue } from '@common/localstorage';
import { useSelectedUIState } from '@context';
import { StoreFrontCategoriesAnalyticsCategoryFragment, StoreV2ItemType } from '@gen';

gql`
  fragment StoreFrontCategoriesAnalyticsCategory on StoreV2StoreFrontCategory {
    itemType
    sellableItems {
      id
      signature
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
    }
  }
`;

const transformSellableItemToAnalytics = (
  sellableItem: StoreFrontCategoriesAnalyticsCategoryFragment['sellableItems'][number],
  revealedStoreBundles: string[],
): Required<Bundle> => {
  const isRevealed = revealedStoreBundles.includes(sellableItem.signature);

  const items = sellableItem.content.map<BundleItem>(({ value }) => ({
    itemId: value?.id,
    revealed: isRevealed,
  }));

  return {
    id: sellableItem.id,
    revealed: isRevealed,
    items,
  };
};

const transformCardBundleCategoriesToAnalytics = (
  categories: StoreFrontCategoriesAnalyticsCategoryFragment[],
  revealedStoreBundles: string[],
): AnalyticsEventClientStorePage => {
  const standardBundles = categories
    .find(({ itemType }) => itemType === StoreV2ItemType.ItemTypeStandardCardBundle)
    ?.sellableItems.map((sellableItem) =>
      transformSellableItemToAnalytics(sellableItem, revealedStoreBundles),
    );

  const premiumBundles = categories
    .find(({ itemType }) => itemType === StoreV2ItemType.ItemTypePremiumCardBundle)
    ?.sellableItems.map((sellableItem) =>
      transformSellableItemToAnalytics(sellableItem, revealedStoreBundles),
    );

  return {
    standardBundles,
    premiumBundles,
  };
};

interface Props {
  categories: StoreFrontCategoriesAnalyticsCategoryFragment[];
  channelId?: string;
}

export function useStoreFrontCategoriesAnalytics({ categories, channelId }: Props) {
  const { selectedGameId } = useSelectedUIState();
  const { trackEvent } = useAnalytics();
  const { currencies } = useWallet();

  const [revealedStoreBundles] = useListenAppLocalStorageValue('store.bundle.revealed');

  const pageEventSentRef = useRef(false);
  const previousGameId = useRef<string>();
  const clientStorePageEventMetaData =
    useRef<Nullable<AnalyticsEventClientStorePage>>(null);

  const isDataAvailable = !!currencies.length && !!selectedGameId && !!categories.length;

  useEffect(() => {
    if (!isDataAvailable) {
      return;
    }

    const cardBundleAnalytics = transformCardBundleCategoriesToAnalytics(
      categories,
      revealedStoreBundles,
    );

    clientStorePageEventMetaData.current = {
      ...cardBundleAnalytics,
      wallet: currencies.map((currency) => ({
        ...currency,
        currencyAmount: `${currency.currencyAmount}`,
      })),
      gameId: selectedGameId ?? undefined,
      channelId,
    };
  }, [
    categories,
    channelId,
    currencies,
    isDataAvailable,
    revealedStoreBundles,
    selectedGameId,
  ]);

  const senStoreFrontCategoriesPageEvent = useCallback(() => {
    if (!clientStorePageEventMetaData.current) {
      throw new Error(
        'Store analytics event used without having access to required metadata',
      );
    }

    trackEvent({
      clientStorePage: clientStorePageEventMetaData.current,
    });
  }, [trackEvent]);

  // send event on page load
  useEffect(() => {
    if (!isDataAvailable) {
      return;
    }

    if (pageEventSentRef.current) {
      return;
    }

    senStoreFrontCategoriesPageEvent();
    pageEventSentRef.current = true;
  }, [isDataAvailable, senStoreFrontCategoriesPageEvent]);

  // Initial set for previous game
  useEffect(() => {
    if (!isDataAvailable || previousGameId.current) {
      return;
    }

    // Save previous game id when data is ready
    previousGameId.current = selectedGameId;
  }, [isDataAvailable, selectedGameId]);

  useEffect(() => {
    // Do nothing if the previous or current game id is not set
    if (!previousGameId.current || !selectedGameId) {
      return;
    }

    // Do nothing if the previous game id is the same as the current game id
    if (previousGameId.current === selectedGameId) {
      return;
    }

    // Save previous game when game id is toggled
    previousGameId.current = selectedGameId;

    // Clear page event sent tracker if game id is toggled
    pageEventSentRef.current = false;

    // Send switch store event when game id is toggled
    trackEvent({
      clientSwitchStore: {
        gameId: selectedGameId,
        channelId,
      },
    });
  }, [channelId, selectedGameId, trackEvent]);
}
