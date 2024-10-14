import { useEffect } from 'react';

import { useListenAppLocalStorageValue } from '@common/localstorage';
import { useStoreHasBundlesToBuy } from '@common/store-bundle';

export function useShouldVisitStore() {
  const [storeUpdatedTimestamp, setStoreUpdatedTimestamp] = useListenAppLocalStorageValue(
    'store.updated.timestamp',
  );
  const [storeVisitedTimestamp] = useListenAppLocalStorageValue(
    'store.visited.timestamp',
  );
  const { canBuyStandardBundles, canBuyPremiumBundles } = useStoreHasBundlesToBuy();

  useEffect(() => {
    // If user can buy any bundle, update the store timestamp
    if (canBuyPremiumBundles || canBuyStandardBundles) {
      setStoreUpdatedTimestamp(Date.now());
    }
  }, [canBuyPremiumBundles, canBuyStandardBundles, setStoreUpdatedTimestamp]);

  return storeUpdatedTimestamp > storeVisitedTimestamp;
}
