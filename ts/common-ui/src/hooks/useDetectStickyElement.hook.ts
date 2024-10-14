import { useMountEffect } from '@noice-com/common-react-core';
import { RefObject, useState } from 'react';

interface Props {
  ref: RefObject<HTMLElement>;
  rootMargin?: string;
}

interface HookResult {
  elementIsStuck: boolean;
}

export function useDetectStickyElement({ ref, rootMargin }: Props): HookResult {
  const [elementIsStuck, setElementIsStuck] = useState<boolean>(false);

  useMountEffect(() => {
    if (!ref.current) {
      return;
    }

    const observer = new IntersectionObserver(
      ([e]) => {
        ref.current?.setAttribute('data-stuck', (e.intersectionRatio < 1).toString());
        setElementIsStuck(e.intersectionRatio < 1);
      },
      { rootMargin, threshold: [1] },
    );

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  });

  return {
    elementIsStuck,
  };
}
