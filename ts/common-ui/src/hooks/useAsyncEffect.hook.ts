import { makeLoggers } from '@noice-com/utils';
import { useEffect } from 'react';

const { logWarn } = makeLoggers('AsyncEffects');

export type AsyncEffect = (
  isMounted: () => boolean,
) => VoidFunction | Promise<VoidFunction> | void | Promise<void>;
type AsyncEffectHook = (callback: AsyncEffect) => void;

export const useAsyncEffect: AsyncEffectHook = (callback) => {
  useEffect(() => {
    let mounted = true;
    const isMounted = () => mounted;

    const cleanup = callback(isMounted);

    return () => {
      mounted = false;

      if (!cleanup) {
        return;
      }

      if (typeof cleanup === 'function') {
        cleanup();
      } else if (cleanup instanceof Promise) {
        // Handle promises as well.
        cleanup
          .then((result) => typeof result === 'function' && result())
          .catch(() => logWarn('Something went wrong cleaning up useAsyncEffect!'));
      }
    };
  }, [callback]);
};
