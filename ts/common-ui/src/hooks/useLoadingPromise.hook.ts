import { useCallback, useState } from 'react';

interface HookOptions {
  onStarted?: () => void;
  onCompleted?: () => void;
}

type HookResult<A, R> = [fn: (...args: A[]) => Promise<R>, loading: boolean];

export function useLoadingPromise<A, R>(
  fn: (...args: A[]) => Promise<R>,
  options?: HookOptions,
): HookResult<A, R> {
  const { onCompleted, onStarted } = options || {};

  const [loading, setLoading] = useState(false);

  const fnWrapper = useCallback(
    async (...args: A[]) => {
      setLoading(true);

      if (onStarted) {
        onStarted();
      }

      const result = await fn(...args);
      setLoading(false);

      if (onCompleted) {
        onCompleted();
      }

      return result;
    },
    [fn, onCompleted, onStarted],
  );

  return [fnWrapper, loading];
}
