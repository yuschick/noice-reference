import { useEffect } from 'react';

import { KeyboardKeys } from '@common-types';

interface Options {
  isEnabled?: (ev: KeyboardEvent) => boolean;
}

/**
 * Adds a hook that will fire a callback whenever a key is pressed.
 *
 * @param {KeyboardKeys | string} key The key to trigger the callback with.
 * @param {Function<void>} callback The callback to trigger. This should be a memoized function, otherwise might cause extra re-renders
 *
 */
export function useKeyPress(
  key: KeyboardKeys | string,
  callback: (ev: KeyboardEvent) => void,
  options?: Options,
): void {
  const { isEnabled } = options || {};

  useEffect(() => {
    const cb = (ev: KeyboardEvent) => {
      if (ev.key !== key) {
        return;
      }

      if (isEnabled && !isEnabled(ev)) {
        return;
      }

      callback(ev);
    };

    window.addEventListener('keydown', cb);

    return () => {
      window.removeEventListener('keydown', cb);
    };
  }, [key, callback, isEnabled]);
}
