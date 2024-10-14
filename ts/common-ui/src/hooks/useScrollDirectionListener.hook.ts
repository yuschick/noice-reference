import { RefObject, useEffect, useRef, useState } from 'react';

import { SetTimeoutId } from '@common-types';

interface HookResult {
  scrollDirection?: 'up' | 'down';
}

interface Props {
  scrollElementRef: RefObject<HTMLElement>;
  skip?: boolean;
}

export function useScrollDirectionListener({
  scrollElementRef,
  skip,
}: Props): HookResult {
  const [scrollDirection, setScrollDirection] = useState<HookResult['scrollDirection']>();
  const [y, setY] = useState(scrollElementRef.current?.scrollTop ?? 0);

  const debounceTimeout = useRef<SetTimeoutId>();

  useEffect(() => {
    if (skip) {
      return;
    }

    const element = scrollElementRef.current;

    if (!element) {
      return;
    }

    const onScroll = (e: Event) => {
      const scrollElement = e.currentTarget as HTMLElement;

      if (scrollElement.scrollTop > y) {
        setScrollDirection('down');
      } else if (scrollElement.scrollTop < y) {
        setScrollDirection('up');
      }

      setY(element.scrollTop);

      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }

      debounceTimeout.current = setTimeout(() => {
        setScrollDirection(undefined);
      }, 100);
    };

    element.addEventListener('scroll', onScroll);

    return () => {
      element.removeEventListener('scroll', onScroll);
    };
  }, [scrollElementRef, skip, y]);

  return { scrollDirection };
}
