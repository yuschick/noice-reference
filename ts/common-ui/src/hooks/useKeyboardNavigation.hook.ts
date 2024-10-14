/**
 * This hook facilitates keyboard navigation through a group of interactive elements using arrow keys.
 * Its significance becomes evident when you picture navigating a webpage using your keyboard and encountering a section with 10 tabs.
 * If each tab is treated as a button, you'd typically have to select the desired tab and then tab through all the remaining buttons just to access the specific content you selected.
 * With this hook, we manage the tab-index value and focus for each interactive element within a container, enabling navigation through the set using arrow keys. When you select the desired element, you can directly tab into it.
 * Furthermore, even if you don't require the content, you can quickly tab past the entire set of interactive elements.
 */

import { RefObject, useCallback, useEffect, useMemo, useState } from 'react';

import { useOnOutsideClick } from './useOnOutsideClick.hook';

export interface UseKeyboardNavigationResult {
  actions: {
    handleKeyboardNavigation: (event: KeyboardEvent) => void;
    setFocusedIndex: (index: number) => void;
  };
  state: {
    focusedIndex: number;
  };
}

interface Props {
  container: RefObject<HTMLElement>;
  items: RefObject<Element[]> | Element[];
  options?: {
    condition?: boolean;
    direction?: 'horizontal' | 'vertical';
    initialFocusIndex?: number;
    onEscape?: () => void;
    onTab?: () => void;
  };
}

const keysMap = {
  base: ['End', 'Home'],
  horizontal: ['ArrowLeft', 'ArrowRight'],
  vertical: ['ArrowUp', 'ArrowDown'],
};

export function useKeyboardNavigation({
  container,
  items,
  options,
}: Props): UseKeyboardNavigationResult {
  const [focusedIndex, setFocusedIndex] = useState(options?.initialFocusIndex || 0);
  const keys = useMemo(
    () => [...keysMap[options?.direction || 'horizontal'], ...keysMap.base],
    [options?.direction],
  );

  /**
   * This function moves the focus to the currently focused item.
   * It is called whenever the focused index changes.
   */
  const moveFocusToItem = useCallback(() => {
    const elements = Array.isArray(items) ? items : items.current;
    const item = elements?.find((_, index) => index === focusedIndex);

    if (!item) {
      return;
    }

    // @ts-ignore-next-line - https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus#parameters
    item.focus({ focusVisible: true });
  }, [focusedIndex, items]);

  /**
   * This function handles keyboard navigation through the interactive elements within the container.
   * It listens for specific key presses and updates the focused element accordingly.
   */
  const handleKeyboardNavigation = useCallback(
    (event: KeyboardEvent): void => {
      const key = event.code || event.key;

      if (options?.onTab || key === 'Tab') {
        options?.onTab?.();
        setFocusedIndex(options?.initialFocusIndex || 0);
      }

      if (options?.onEscape && key === 'Escape') {
        options?.onEscape();
      }

      const elements = Array.isArray(items) ? items : items.current;

      if (keys.includes(key) && elements) {
        event.preventDefault();

        const lastIndex = elements.length - 1;

        switch (key) {
          case 'ArrowDown':
          case 'ArrowRight':
            setFocusedIndex((i) => (i === lastIndex ? 0 : i + 1));
            break;
          case 'ArrowLeft':
          case 'ArrowUp':
            setFocusedIndex((i) => (i > 0 ? i - 1 : lastIndex));
            break;
          case 'End':
            setFocusedIndex(lastIndex);
            break;
          case 'Home':
            setFocusedIndex(0);
            break;
        }
      }
    },
    [items, keys, options],
  );

  /**
   * This function modifies the tab-index value for each interactive element within the container.
   * It sets the tab-index value to 0 for the focused element and -1 for all other elements.
   * This ensures that only the focused element is accessible via the keyboard.
   */
  const modifyItemAttributes = useCallback(() => {
    const elements = Array.isArray(items) ? items : items.current;

    if (!elements?.length) {
      return;
    }

    elements?.forEach((item, index) => {
      const element = item;

      if (!element) {
        return;
      }

      index !== focusedIndex
        ? element.setAttribute('tabindex', '-1')
        : element.setAttribute('tabindex', '0');
    });
  }, [focusedIndex, items]);

  useEffect(() => {
    modifyItemAttributes();

    if (!container.current?.contains(document.activeElement)) {
      return;
    }

    moveFocusToItem();
  }, [container, modifyItemAttributes, moveFocusToItem]);

  useEffect(() => {
    if (typeof options?.condition !== 'undefined' && !options.condition) {
      return;
    }

    const element = container.current;

    if (!element) {
      return;
    }

    element.addEventListener('keydown', handleKeyboardNavigation);

    return () => {
      element.removeEventListener('keydown', handleKeyboardNavigation);
    };
  }, [container, handleKeyboardNavigation, options?.condition]);

  useOnOutsideClick(container, () => setFocusedIndex(options?.initialFocusIndex || 0), {
    condition:
      (container.current?.contains(document.activeElement) && options?.condition) ??
      false,
  });

  return {
    actions: {
      handleKeyboardNavigation,
      setFocusedIndex,
    },
    state: {
      focusedIndex,
    },
  };
}
