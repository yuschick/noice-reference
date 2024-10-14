import { CoreAssets } from '@noice-com/assets-core';
import {
  Button,
  WithChildren,
  useAnalytics,
  useScrollListener,
} from '@noice-com/common-ui';
import classNames from 'classnames';
import { useCallback, useEffect, useRef, useState } from 'react';

import styles from './WidgetScrollWrapper.module.css';

type ScrollState = 'auto' | 'paused';
type LatestItemDirection = 'top' | 'bottom';

interface Props {
  className?: string;
  items: object[];
  label: string;
  latestItemDirection?: LatestItemDirection;
  onScrollToEnd?: () => void;
  preventScrollToNewItems?: boolean;
}

const SCROLL_OFFSET = 40;

// @todo: Generalize this messaging since it won't always be 'events'
function getUnreadItemsText(unreadCount: number): string {
  if (unreadCount === 1) {
    return '1 New event';
  }

  if (unreadCount > 1 && unreadCount <= 10) {
    return `${unreadCount} New events`;
  }

  if (unreadCount > 10) {
    return '10+ New events';
  }

  return 'No new events';
}

export function WidgetScrollWrapper({
  children,
  className,
  items,
  label,
  latestItemDirection = 'top',
  onScrollToEnd,
  preventScrollToNewItems,
}: WithChildren<Props>) {
  const { trackEvent } = useAnalytics();

  const [scrollState, setScrollState] = useState<ScrollState>('auto');
  const [unreadItems, setUnreadItems] = useState<number>(0);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef<boolean>(false);
  const itemsRef = useRef<object[]>([]);

  const { isScrolling } = useScrollListener({ scrollElementRef: scrollContainerRef });

  const handleScrollToEnd = useCallback(() => {
    onScrollToEnd?.();
  }, [onScrollToEnd]);

  const updateToLatestItem = useCallback(() => {
    if (preventScrollToNewItems) {
      return;
    }

    setUnreadItems(0);

    // Handle scrolling to the latest event when the scroll state is auto
    if (scrollState === 'auto') {
      if (latestItemDirection === 'top') {
        scrollContainerRef.current?.scrollTo(0, 0);
        return;
      }

      if (latestItemDirection === 'bottom') {
        scrollContainerRef.current?.scrollTo(0, scrollContainerRef.current.scrollHeight);
        return;
      }
    }
  }, [latestItemDirection, preventScrollToNewItems, scrollState]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) {
      return;
    }

    if (isScrolling) {
      // We store a reference to isScrolling to we can detect changing from true to false
      isScrollingRef.current = true;
      return;
    }

    // When isScrolling is false and isScrollingRef is true, that means
    // we have finished scrolling and can now determine our scroll states
    if (!isScrolling && isScrollingRef.current) {
      isScrollingRef.current = false;

      const { clientHeight, scrollHeight, scrollTop } = container;

      if (latestItemDirection === 'top') {
        if (scrollTop + clientHeight >= scrollHeight - SCROLL_OFFSET) {
          handleScrollToEnd();

          if (!preventScrollToNewItems) {
            scrollContainerRef.current?.scrollTo(0, scrollTop);
          }
          return;
        }

        if (scrollTop >= SCROLL_OFFSET) {
          setScrollState('paused');
          return;
        }

        if (scrollTop < SCROLL_OFFSET) {
          setScrollState('auto');
          setUnreadItems(0);
          return;
        }
      }

      if (latestItemDirection === 'bottom') {
        if (scrollTop <= SCROLL_OFFSET) {
          handleScrollToEnd();
          return;
        }

        if (scrollTop >= scrollHeight - clientHeight - SCROLL_OFFSET) {
          setScrollState('auto');
          return;
        }

        if (scrollTop < scrollHeight + clientHeight + SCROLL_OFFSET) {
          setScrollState('paused');
          setUnreadItems(0);
          return;
        }
      }
    }
  }, [handleScrollToEnd, isScrolling, latestItemDirection, preventScrollToNewItems]);

  useEffect(() => {
    if (scrollState === 'paused') {
      if (items.at(-1) !== itemsRef.current.at(-1)) {
        setUnreadItems((prev) => prev + 1);
      }
      return;
    }

    itemsRef.current = items;
    updateToLatestItem();
  }, [items, scrollState, updateToLatestItem]);

  const handleNewMessagesButtonClick = () => {
    setScrollState('auto');
    updateToLatestItem();

    trackEvent({
      clientButtonClick: { action: 'studioActivityFeedNewEvents' },
    });
  };

  return (
    <div
      aria-label={label}
      className={className}
      ref={scrollContainerRef}
      role="region"
    >
      {children}

      {!!unreadItems && (
        <div
          className={classNames(
            styles.newMessagesBtnWrapper,
            styles[latestItemDirection],
          )}
        >
          <Button
            iconStart={
              latestItemDirection === 'top'
                ? CoreAssets.Icons.ChevronUp
                : CoreAssets.Icons.ChevronDown
            }
            size="sm"
            onClick={handleNewMessagesButtonClick}
          >
            {getUnreadItemsText(unreadItems)}
          </Button>
        </div>
      )}
    </div>
  );
}
