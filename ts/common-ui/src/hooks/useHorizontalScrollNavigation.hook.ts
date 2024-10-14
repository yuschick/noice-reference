import { RefObject, useEffect, useRef, useState } from 'react';

interface HookResult {
  containerRef: RefObject<HTMLDivElement>;
  leftNavVisible: boolean;
  rightNavVisible: boolean;
  onLeftNavClick: () => void;
  onRightNavClick: () => void;
}

export function useHorizontalScrollNavigation(): HookResult {
  const containerRef = useRef<HTMLDivElement>(null);
  const [leftNavVisible, setLeftNavVisible] = useState(false);
  const [rightNavVisible, setRightNavVisible] = useState(false);

  useEffect(() => {
    const updateState = () => {
      if (!containerRef.current) {
        return;
      }

      const { scrollLeft, clientWidth, scrollWidth } = containerRef.current;

      setLeftNavVisible(!!scrollLeft);

      setRightNavVisible(scrollLeft + clientWidth < scrollWidth);
    };

    updateState();

    window.addEventListener('resize', updateState);

    return () => {
      window.removeEventListener('resize', updateState);
    };
  }, []);

  useEffect(() => {
    const containerElement = containerRef.current;

    if (!containerElement) {
      return;
    }

    const onScroll = (event: Event) => {
      const { scrollLeft, clientWidth, scrollWidth } = event.target as HTMLDivElement;

      setLeftNavVisible(!!scrollLeft);
      // round up the current scroll position because (scrollLeft + clientWidth) may differ from scrollWidth for less than 1 px
      // and scrollBy doesn't scroll containers for anything less that 1 px, so the nav component gets stuck in UI
      setRightNavVisible(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
    };

    containerElement.addEventListener('scroll', onScroll);

    return () => {
      containerElement.removeEventListener('scroll', onScroll);
    };
  }, []);

  const scrollTo = (dir = 1) => {
    if (!containerRef.current) {
      return;
    }

    const { clientWidth } = containerRef.current;
    containerRef.current.scrollBy({ left: (clientWidth / 2) * dir });
  };

  const onLeftNavClick = () => {
    scrollTo(-1);
  };

  const onRightNavClick = () => {
    scrollTo(1);
  };

  return {
    containerRef,
    leftNavVisible,
    rightNavVisible,
    onLeftNavClick,
    onRightNavClick,
  };
}
