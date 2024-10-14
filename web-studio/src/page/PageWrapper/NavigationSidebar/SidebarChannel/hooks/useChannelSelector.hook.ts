import { FocusEvent, KeyboardEvent, RefObject, useEffect, useRef, useState } from 'react';

import { useChannelContext } from '@common/channel';
import { ChannelSelectorOptionChannelFragment } from '@gen';

interface HookResult {
  activeIndex: number;
  isExpanded: boolean;
  wrapperRef: RefObject<HTMLDivElement>;
  onBlur(event?: FocusEvent<HTMLElement, Element>): void;
  onFocus(): void;
  onMouseDown(): void;
  onKeyDown(event: KeyboardEvent): void;
  onOptionMouseEnter(index: number): void;
  onOptionMouseDown(): void;
  onOptionClick(channelId: string): void;
}

interface Props {
  results: ChannelSelectorOptionChannelFragment[];
  onBlur?(): void;
  onExpand(): void;
}

export function useChannelSelector({
  results,
  onBlur: onBlurProp,
  onExpand,
}: Props): HookResult {
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isExpanded, setIsExpanded] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const preventBlur = useRef(false);

  const { setChannelId } = useChannelContext();

  const onSelect = (channelId: string) => {
    setChannelId(channelId);
    onBlur();
  };

  const onBlur = (event?: FocusEvent<HTMLElement, Element>) => {
    // When new target is inside search box, do nothing
    if (event?.relatedTarget && wrapperRef.current?.contains(event.relatedTarget)) {
      return;
    }

    // When blur is prevented, do nothing
    if (preventBlur.current) {
      preventBlur.current = false;
      return;
    }
    setIsExpanded(false);
    setActiveIndex(-1);
    onBlurProp?.();
  };

  const onFocus = () => {
    setIsExpanded(true);
  };

  const onMouseDown = () => {
    setIsExpanded((prev) => !prev);
  };

  useEffect(() => {
    if (isExpanded) {
      onExpand();
    }
  }, [isExpanded, onExpand]);

  const onKeyDown = (event: KeyboardEvent) => {
    if (!isExpanded) {
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();

      if (results[activeIndex]) {
        onSelect(results[activeIndex].id);
      }
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((prev) => {
        // If last one is active, do nothing
        if (prev === results.length - 1) {
          return prev;
        }

        // Active index is the next one
        return prev + 1;
      });
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((prev) => {
        // If no natural number is active, return -1 to be non-active value
        if (prev < 0) {
          return -1;
        }

        // Active index is the previous one
        return prev - 1;
      });
    }

    // Go to the first item whit home key
    if (event.key === 'Home') {
      setActiveIndex(0);
      return;
    }

    // Go to the last item with end key
    if (event.key === 'End') {
      setActiveIndex(results.length - 1);
      return;
    }

    // Esc does some thing as blur
    if (event.key === 'Escape') {
      onBlur();
      return;
    }
  };

  const onOptionMouseEnter = (index: number) => {
    setActiveIndex(index);
  };

  const onOptionMouseDown = () => {
    preventBlur.current = true;
  };

  return {
    activeIndex,
    isExpanded,
    wrapperRef,
    onBlur,
    onFocus,
    onMouseDown,
    onKeyDown,
    onOptionMouseEnter,
    onOptionMouseDown,
    onOptionClick: onSelect,
  };
}
