import { gql } from '@apollo/client';
import { Nullable } from '@noice-com/utils';
import { useEffect, useState } from 'react';

import { useStoreItemRevealedAnalytics } from './useStoreItemRevealedAnalytics.hook';

import { useListenAppLocalStorageValue } from '@common/localstorage';
import { StoreItemRevealedItemsFragment } from '@gen';

interface HookResult {
  isStoreItemRevealed: boolean;
}

gql`
  fragment StoreItemRevealedItems on StoreV2SellableItem {
    id
    signature
    content {
      value {
        __typename
        ... on StoreV2ItemRef {
          id
          item {
            id
            details {
              __typename
              ... on GameLogicCard {
                id
                rarity
              }
            }
          }
        }
        ... on StoreV2CurrencyRef {
          id
        }
      }
    }
    ...StoreItemRevealedAnalyticsSellableItem
  }
`;

const STORAGE_BUNDLE_KEEP_AMOUNT = 9;

interface Props {
  sellableItem: Nullable<StoreItemRevealedItemsFragment>;
}

export function useRevealStoreItemOnMounthook({ sellableItem }: Props): HookResult {
  const [revealedBundles, setRevealedBundles] = useListenAppLocalStorageValue(
    'store.bundle.revealed',
  );
  const [revealedContentItems] = useState<Record<string, string[]>>({});

  const { signature } = sellableItem ?? { signature: '' };

  const { onRevealStoreItemAnalyticsEvent } = useStoreItemRevealedAnalytics({
    sellableItem,
    revealedContentItems: revealedContentItems?.[signature] ?? [],
  });

  const isStoreItemRevealed = revealedBundles.includes(signature);

  // If the store item is revealed, reveal all content items
  useEffect(() => {
    if (isStoreItemRevealed) {
      return;
    }

    setRevealedBundles([
      signature,
      ...revealedBundles.slice(0, STORAGE_BUNDLE_KEEP_AMOUNT),
    ]);
  }, [isStoreItemRevealed, revealedBundles, setRevealedBundles, signature]);

  onRevealStoreItemAnalyticsEvent();

  return {
    isStoreItemRevealed,
  };
}
