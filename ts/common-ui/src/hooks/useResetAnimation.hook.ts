import { RefObject, useEffect } from 'react';

import { SetTimeoutId } from '@common-types';

interface Props {
  ref: RefObject<HTMLElement>;
  triggerDependencies?: unknown[];
}

export function useResetAnimation({ ref, triggerDependencies = [] }: Props): void {
  useEffect(() => {
    if (!ref.current) {
      return;
    }
    const element = ref.current;

    element.style.animationName = 'none';

    let timeout: SetTimeoutId;
    requestAnimationFrame(() => {
      // Timeout is because cross-browser quirks. Read more here:
      // https://forum.kirupa.com/t/restarting-a-css-animation/650724/8?u=kirupa
      timeout = setTimeout(() => {
        element.style.animationName = '';
      }, 0);
    });

    return () => {
      clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, ...triggerDependencies]);
}
