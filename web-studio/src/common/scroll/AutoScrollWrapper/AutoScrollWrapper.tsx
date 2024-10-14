import {
  useAnalytics,
  useMountTransition,
  WithChildren,
  Button,
} from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import classNames from 'classnames';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { FaArrowDown } from 'react-icons/fa';

import styles from './AutoScrollWrapper.module.css';

type TriggerValue = {
  id: string;
  forceShow?: boolean;
};

interface Props {
  ariaLabel?: string;
  autoScrollBuffer?: number;
  className?: string;
  itemName?: string;
  triggerValue: Nullable<TriggerValue>;
  itemsAmount: number;
}

/*
    Use the autoScrollBuffer prop to define how far the window can be scrolled
    before pausing and showing the new items button. This is beneficial to change
    in situations where the item font size or window itself changes.

    For example (chat):

    If the autoScrollBuffer is 40 the chat window can be scrolled up to 40px
    before pausing the chat and showing the new messages button. If the window is
    scrolled anywhere inside that buffer (<=40), the window will jump to every new message.
*/
export function AutoScrollWrapper({
  ariaLabel,
  autoScrollBuffer = 40,
  children,
  className,
  itemName = 'message',
  itemsAmount,
  triggerValue,
}: WithChildren<Props>) {
  const [isPaused, setIsPaused] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNewItemsButton, setShowNewItemsButton] = useState<boolean>(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<TriggerValue | null>(null);
  const itemsAmountRef = useRef(itemsAmount);

  const { trackEvent } = useAnalytics();
  const { showTransitionChild, withTransitionStyles } = useMountTransition({
    duration: '--noi-duration-quick',
    isShown: isPaused && showNewItemsButton,
  });

  function getUnreadItemsText(): string {
    if (unreadCount === 1) {
      return `1 New ${itemName}`;
    } else if (unreadCount > 1 && unreadCount <= 10) {
      return `${unreadCount} New ${itemName}s`;
    } else if (unreadCount > 10) {
      return `10+ New ${itemName}s`;
    } else {
      return `No new ${itemName}s`;
    }
  }

  const jumpToBottom = useCallback(() => {
    if (!scrollRef.current) {
      return;
    }

    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, []);

  const handleNewItemsBtnClick = useCallback(() => {
    if (!scrollRef.current) {
      return;
    }

    const scrollEl = scrollRef.current;

    // Transition the button out of view
    setShowNewItemsButton(false);

    // Scroll the window
    scrollEl.scrollTo({
      top: scrollEl.scrollHeight,
      behavior: 'smooth',
    });

    // Track the click event
    trackEvent({
      clientButtonClick: { action: 'chatNewMessages' },
    });
  }, [trackEvent]);

  const resetCounter = useCallback(() => {
    setUnreadCount(0);
    setShowNewItemsButton(false);
  }, []);

  const checkScrollPosition = useCallback(() => {
    if (!scrollRef.current) {
      return;
    }

    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const isWithinBottomBuffer =
      clientHeight + scrollTop >= scrollHeight - autoScrollBuffer;

    /*
    When we're outside of the autoScrollBuffer, we pause the chat from jumping
    to the bottom with every new message and show the New Messages button.
    */
    if (!isWithinBottomBuffer && !isPaused) {
      setIsPaused(true);
      return;
    }

    /*
    When within the autoScrollBuffer, the chat window is not paused
    meaning the chat will jump to the bottom with every new message
    */
    if (isWithinBottomBuffer && isPaused) {
      setIsPaused(false);
      resetCounter();
    }
  }, [autoScrollBuffer, isPaused, resetCounter]);

  useEffect(() => {
    if (itemsAmount < itemsAmountRef.current) {
      resetCounter();
    }

    itemsAmountRef.current = itemsAmount;
  }, [resetCounter, itemsAmount]);

  useEffect(() => {
    if (!scrollRef.current) {
      return;
    }

    const observer = new ResizeObserver(() => {
      resetCounter();
    });

    observer.observe(scrollRef.current);

    return () => observer.disconnect();
  }, [resetCounter, scrollRef]);

  useEffect(() => {
    if (!scrollRef.current) {
      return;
    }

    const scrollEl = scrollRef.current;

    scrollEl.addEventListener('scroll', checkScrollPosition, { passive: true });

    return () => {
      scrollEl.removeEventListener('scroll', checkScrollPosition);
    };
  }, [checkScrollPosition]);

  /** Trigger value change means that item list has changed */
  useLayoutEffect(() => {
    if (!triggerValue) {
      triggerRef.current = null;
      return;
    }

    if (triggerValue.id === triggerRef.current?.id) {
      return;
    }

    triggerRef.current = triggerValue;

    // Override the paused chat if the latest message is from the local player
    if (!isPaused || triggerValue.forceShow) {
      jumpToBottom();
    } else {
      setUnreadCount((prev) => prev + 1);

      if (!showNewItemsButton) {
        setShowNewItemsButton(true);
      }
    }
  }, [isPaused, jumpToBottom, triggerValue, showNewItemsButton]);

  return (
    <div
      aria-label={ariaLabel}
      className={classNames(styles.container, className)}
      ref={scrollRef}
      role="region"
    >
      {children}

      {showTransitionChild && (
        <div
          className={classNames(styles.newMessagesBtn, {
            [styles.intoView]: withTransitionStyles,
          })}
        >
          <Button
            iconStart={FaArrowDown}
            size="sm"
            variant="solid"
            onClick={handleNewItemsBtnClick}
          >
            {getUnreadItemsText()}
          </Button>
        </div>
      )}
    </div>
  );
}
