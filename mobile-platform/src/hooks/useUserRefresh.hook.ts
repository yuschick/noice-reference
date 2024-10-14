import { useCallback, useState } from 'react';

export const useUserRefresh = (
  refetchCallback: (() => Promise<unknown>)[] | (() => Promise<unknown>),
  timeout = 2000,
) => {
  const [isUserRefresh, setIsUserRefresh] = useState(false);

  const refresh = useCallback(async () => {
    setIsUserRefresh(true);

    const startTime = Date.now();

    try {
      if (typeof refetchCallback === 'function') {
        await refetchCallback();
      } else {
        await Promise.all(refetchCallback);
      }
    } catch (error) {
      // We don't need no warnings.
    }

    const elapsedTime = Date.now() - startTime;
    const remainingTime = Math.max(timeout - elapsedTime, 0);

    // If the refetch was faster than the timeout, wait for the remaining time
    if (remainingTime > 0) {
      await new Promise<void>((resolve) => setTimeout(resolve, remainingTime));
    }

    setIsUserRefresh(false);
  }, [refetchCallback, timeout]);

  return { refresh, isUserRefresh };
};
