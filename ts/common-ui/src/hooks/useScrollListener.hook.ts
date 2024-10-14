import { RefObject, useEffect, useRef, useState } from 'react';

import { SetTimeoutId } from '@common-types';

interface HookResult {
  isScrolling: boolean;
}

interface Props {
  scrollElementRef: RefObject<HTMLElement>;
  skip?: boolean;
}

export function useScrollListener({ scrollElementRef, skip }: Props): HookResult {
  const [isScrolling, setIsScrolling] = useState(false);

  const debounceTimeout = useRef<SetTimeoutId>();

  useEffect(() => {
    if (skip) {
      return;
    }

    const element = scrollElementRef.current;

    if (!element) {
      return;
    }

    const onScroll = () => {
      setIsScrolling(true);
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }

      debounceTimeout.current = setTimeout(() => {
        setIsScrolling(false);
      }, 100);
    };

    element.addEventListener('scroll', onScroll);

    return () => {
      element.removeEventListener('scroll', onScroll);
    };
  }, [scrollElementRef, skip]);

  return { isScrolling };
}
