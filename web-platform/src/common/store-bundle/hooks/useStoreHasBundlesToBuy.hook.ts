import { gql } from '@apollo/client';
import { WalletCurrencyId, useWallet } from '@noice-com/common-ui';
import { useEffect, useMemo } from 'react';

import { useSelectedUIState } from '@context';
import { StoreV2ItemType, useStoreHasBundlesToBuyStoreFrontLazyQuery } from '@gen';

gql`
  query StoreHasBundlesToBuyStoreFront($gameId: ID!) {
    platformStoreFront(gameId: $gameId) {
      id
      gameId
      categories {
        id
        itemType
        sellableItems {
          id
          igcPrices {
            currencyId
            amount
          }
          name
        }
      }
    }
  }
`;

interface HookResult {
  canBuyPremiumBundles: boolean;
  canBuyStandardBundles: boolean;
  loading: boolean;
}

export function useStoreHasBundlesToBuy(): HookResult {
  const { selectedGameId } = useSelectedUIState();
  const { wallet } = useWallet();

  const [fetchStoreFront, { data, loading }] = useStoreHasBundlesToBuyStoreFrontLazyQuery(
    {
      fetchPolicy: 'cache-first',
      // Store front is updated only when going to store and cache is updated on that case
      // so we do not need to refetch it
      nextFetchPolicy: 'cache-only',
    },
  );

  useEffect(() => {
    if (!selectedGameId) {
      return;
    }

    // Fetch store front when wallet changes
    fetchStoreFront({
      variables: { gameId: selectedGameId },
    });

    // We do not want to refetch store front when selected game changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchStoreFront, wallet]);

  const canBuyStandardBundles = useMemo(() => {
    if (!data?.platformStoreFront?.categories) {
      return false;
    }

    return !!data?.platformStoreFront?.categories
      // Filter to only standard bundles categories
      .filter(({ itemType }) => itemType === StoreV2ItemType.ItemTypeStandardCardBundle)
      // Flat to have only sellable items (== bundles)
      .flatMap((category) => category.sellableItems)
      // Find some bundle that user can afford
      .some(({ igcPrices }) =>
        igcPrices?.some(
          ({ currencyId, amount }) => amount <= wallet[currencyId as WalletCurrencyId],
        ),
      );
  }, [data?.platformStoreFront?.categories, wallet]);

  const canBuyPremiumBundles = useMemo(() => {
    if (!data?.platformStoreFront?.categories) {
      return false;
    }

    return !!data?.platformStoreFront?.categories
      // Filter to only standard bundles categories
      .filter(({ itemType }) => itemType === StoreV2ItemType.ItemTypePremiumCardBundle)
      // Flat to have only sellable items (== bundles)
      .flatMap((category) => category.sellableItems)
      // Find some bundle that user can afford
      .some(({ igcPrices }) =>
        igcPrices?.some(
          ({ currencyId, amount }) => amount <= wallet[currencyId as WalletCurrencyId],
        ),
      );
  }, [data?.platformStoreFront?.categories, wallet]);

  return {
    canBuyPremiumBundles,
    canBuyStandardBundles,
    loading: loading || !wallet,
  };
}
