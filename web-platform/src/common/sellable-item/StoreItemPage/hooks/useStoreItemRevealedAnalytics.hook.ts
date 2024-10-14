import { gql } from '@apollo/client';
import { useAnalytics, useWallet } from '@noice-com/common-ui';
import {
  AnalyticsEventClientStoreItemClicked,
  BundleItem,
} from '@noice-com/schemas/analytics/analytics.pb';
import { Nullable } from '@noice-com/utils';

import { getNullableSellableItemIgcPrice } from '../../utils';

import { storeV2ItemTypeToAnalyticsItemTypeMap } from '@common/analytics';
import {
  StoreItemRevealedAnalyticsIgcPriceFragment,
  StoreItemRevealedAnalyticsSellableItemFragment,
} from '@gen';

interface HookResult {
  onRevealStoreItemAnalyticsEvent(): void;
  onRevealStoreItemContentItemAnalyticsEvent(
    id: string,
    isStoreItemRevealed: boolean,
  ): void;
}

gql`
  fragment StoreItemRevealedAnalyticsSellableItem on StoreV2SellableItem {
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
      ...StoreItemRevealedAnalyticsIgcPrice
    }
  }

  fragment StoreItemRevealedAnalyticsIgcPrice on StoreV2InGameCurrencyPrice {
    currencyId
    default
    amount
  }
`;

interface Props {
  sellableItem: Nullable<StoreItemRevealedAnalyticsSellableItemFragment>;
  revealedContentItems: string[];
}

export function useStoreItemRevealedAnalytics({
  sellableItem,
  revealedContentItems,
}: Props): HookResult {
  const { trackEvent } = useAnalytics();
  const { currencies } = useWallet();

  const onRevealStoreItemAnalyticsEvent = () => {
    if (!sellableItem) {
      return;
    }

    const items = sellableItem.content.map<BundleItem>(({ value }) => ({
      itemId: value?.id,
      revealed: true,
    }));

    const price =
      getNullableSellableItemIgcPrice<StoreItemRevealedAnalyticsIgcPriceFragment>(
        sellableItem.igcPrices ?? [],
      );

    const eventMetaData: AnalyticsEventClientStoreItemClicked = {
      action: 'RevealAllCards',
      bundle: {
        id: sellableItem.id,
        items,
        revealed: true,
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
  };

  const onRevealStoreItemContentItemAnalyticsEvent = (
    id: string,
    isStoreItemRevealed: boolean,
  ) => {
    if (!sellableItem) {
      return;
    }

    const items = sellableItem.content.map<BundleItem>(({ value }) => ({
      itemId: value?.id,
      revealed: value?.id === id ? true : revealedContentItems.includes(value?.id ?? ''),
    }));

    const price =
      getNullableSellableItemIgcPrice<StoreItemRevealedAnalyticsIgcPriceFragment>(
        sellableItem.igcPrices ?? [],
      );

    const eventMetaData: AnalyticsEventClientStoreItemClicked = {
      action: 'RevealCard',
      targetAttributes: {
        cardId: id,
      },
      bundle: {
        id: sellableItem.id,
        items,
        revealed: isStoreItemRevealed,
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
  };

  return {
    onRevealStoreItemAnalyticsEvent,
    onRevealStoreItemContentItemAnalyticsEvent,
  };
}
