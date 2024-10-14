import { useCallback, useEffect } from 'react';

import { isReactNativeWebView } from '../utils/embed';

interface HookResult {
  enable(): void;
  disable(): void;
}

interface Props {
  isActive: boolean;
}

export function useStableBodyOverflow({ isActive }: Props): HookResult {
  const enable = useCallback(() => {
    if (document.body.scrollHeight > window.innerHeight) {
      document.documentElement.style.scrollbarGutter = 'stable';
    }

    // Embeded views sometimes handels navigation on the native side
    // and because of this we cannot disable overflow on the body or it will break scrolling
    if (!isReactNativeWebView()) {
      document.body.style.overflow = 'hidden';
    }
  }, []);

  const disable = useCallback(() => {
    document.body.style.overflow = '';
    document.documentElement.style.scrollbarGutter = '';
  }, []);

  useEffect(() => {
    // Clear the overflow when the component unmounts
    return () => {
      if (isActive) {
        disable();
      }
    };
  }, [disable, isActive]);

  return {
    disable,
    enable,
  };
}
