import { useMountEffect } from '@noice-com/common-react-core';

import { useListenAppLocalStorageValue } from '@common/localstorage';

export function useStoreTracking() {
  const [_storeVisitedTimestamp, setStoreVisitedTimestamp] =
    useListenAppLocalStorageValue('store.visited.timestamp');

  useMountEffect(() => {
    // Update visited timestamp on mount
    setStoreVisitedTimestamp(Date.now());
  });
}
