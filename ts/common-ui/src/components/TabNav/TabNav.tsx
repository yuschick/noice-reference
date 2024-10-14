import { Nullable } from '@noice-com/utils';
import { CSSProperties, useEffect, useRef, useState } from 'react';

import style from './TabNav.module.css';
import { TabNavButton } from './TabNavButton/TabNavButton';
import { TabNavPaginationButton } from './TabNavPaginationButton/TabNavPaginationButton';

interface TabItem<T> {
  id: T;
  title: string;
  subtitle?: string;
  dataFtueAnchor?: string;
}

interface Props<T> {
  onSelect: (tabId: T) => void;
  selectedId: Nullable<T>;
  tabs: TabItem<T>[];
}

export function TabNav<T>({ onSelect, tabs, selectedId }: Props<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [leftNavVisible, setLeftNavVisible] = useState(false);
  const [rightNavVisible, setRightNavVisible] = useState(false);
  const [underline, setUnderline] = useState<{ offset: number; width: number }>();

  useEffect(() => {
    const updateTabState = () => {
      if (!containerRef.current) {
        return;
      }

      // Is nav buttons visible
      const { clientWidth, scrollWidth } = containerRef.current;
      setRightNavVisible(clientWidth < scrollWidth ? true : false);

      for (const child of containerRef.current.childNodes as NodeListOf<HTMLElement>) {
        // Set underline position and size
        if (child.id === selectedId) {
          setUnderline({ offset: child.offsetLeft, width: child.clientWidth });

          // Scroll to right tab item
          containerRef.current.scrollTo({
            left: child.offsetLeft - child.clientWidth / 2,
          });
        }
      }
    };

    updateTabState();

    window.addEventListener('resize', updateTabState);

    return () => {
      window.removeEventListener('resize', updateTabState);
    };
  }, [selectedId]);

  const onScroll = (event: React.UIEvent<HTMLDivElement, UIEvent>) => {
    const { scrollLeft, clientWidth, scrollWidth } = event.currentTarget;

    const firstChildWidth = event.currentTarget?.firstElementChild?.clientWidth ?? 0;
    const lastChildWidth = event.currentTarget?.firstElementChild?.clientWidth ?? 0;

    const leftPaddingBeforeNavIsVisible = firstChildWidth / 2;
    const rightPaddingBeforeNavIsVisible = lastChildWidth / 2;

    const hasScrollLeft = scrollLeft > leftPaddingBeforeNavIsVisible;

    if (hasScrollLeft !== leftNavVisible) {
      setLeftNavVisible(hasScrollLeft);
    }

    const hasScrollRight =
      scrollLeft + clientWidth < scrollWidth - rightPaddingBeforeNavIsVisible;

    if (hasScrollRight !== rightNavVisible) {
      setRightNavVisible(hasScrollRight);
    }
  };

  const scrollTo = (dir = 1) => {
    if (!containerRef.current) {
      return;
    }

    const { clientWidth } = containerRef.current;
    containerRef.current.scrollBy({ left: (clientWidth / 2) * dir });
  };

  const onClick = (tabId: T, event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    containerRef.current?.scrollTo({
      left: event.currentTarget.offsetLeft - event.currentTarget.clientWidth / 2,
    });

    setUnderline({
      width: event.currentTarget.clientWidth,
      offset: event.currentTarget.offsetLeft,
    });

    onSelect(tabId);
  };

  return (
    <div className={style.container}>
      <TabNavPaginationButton
        aria-hidden={leftNavVisible ? undefined : true}
        disabled={!leftNavVisible}
        onClick={() => scrollTo(-1)}
      />
      <div
        className={style.innerContainer}
        ref={containerRef}
        onScroll={onScroll}
      >
        <div
          className={style.underline}
          style={
            {
              '--underline-width': `${underline?.width}px`,
              '--underline-offset': `${underline?.offset}px`,
            } as CSSProperties
          }
        />

        {tabs?.map((tab) => (
          <TabNavButton
            dataFtueAnchor={tab.dataFtueAnchor}
            id={`${tab.id}`}
            key={`${tab.id}`}
            selected={tab.id === selectedId}
            subtitle={tab.subtitle}
            title={tab.title}
            onClick={(e) => onClick(tab.id, e)}
          />
        ))}
      </div>
      <TabNavPaginationButton
        aria-hidden={rightNavVisible ? undefined : true}
        direction="next"
        disabled={!rightNavVisible}
        onClick={() => scrollTo()}
      />
    </div>
  );
}

TabNav.loading = () => {
  return (
    <div className={style.container}>
      <div className={style.innerContainer}>
        {[...Array(4)].map((_, i) => (
          <div
            className={style.loadingContainer}
            key={`tab-loading-${i}`}
          />
        ))}
      </div>
    </div>
  );
};
