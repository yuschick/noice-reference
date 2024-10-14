import { RefObject, useEffect, useMemo, useRef, useState } from 'react';

import { useKeyboardNavigation } from './useKeyboardNavigation.hook';

import { SliderDirection } from '@common-types';
import { isTouchDevice } from '@common-utils';

interface Props {
  container: RefObject<HTMLElement>;
  options?: {
    condition?: boolean;
  };
}

interface UseSliderNavigationResult {
  hasOverflow: SliderDirection[];
  scrollTo: (direction: SliderDirection) => void;
}

const scrollIntoViewOptions: ScrollIntoViewOptions = {
  behavior: 'instant',
  block: 'nearest',
  inline: 'start',
};

/**
 *
 * The useSliderNavigation hook is used for elements that have overflow and need to be scrolled into view.
 * This is used for components like CategoryFilter and Tabs where the horizontal overflow conditionally needs
 * to be scrolled when it exceeds the container.
 *
 * @returns
 * - hasOverflow: An array of strings that represent the overflow direction. Possible values are 'next' and 'prev'. Used for styling the parent component.
 * - scrollTo: A function that scrolls the container to the next or previous item.
 */
export function useSliderNavigation({
  container,
  options,
}: Props): UseSliderNavigationResult {
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const [hasOverflow, setHasOverflow] = useState<SliderDirection[]>([]);

  const observerRef = useRef<IntersectionObserver | null>(null);

  const items: Element[] = useMemo(() => [], []);
  const visibleItemIndexes = useMemo(() => new Set<number>(), []);

  const conditionMet =
    typeof options?.condition === 'undefined' ? true : options.condition;

  useKeyboardNavigation({
    container,
    items,
    options: {
      condition: conditionMet && !!items.length,
    },
  });

  const scrollTo = (direction: SliderDirection) => {
    const indexes = Array.from(visibleItemIndexes);
    let itemToScrollTo: Element | null = null;

    indexes.sort();

    if (direction === 'next') {
      itemToScrollTo = items[(indexes.at(-1) ?? 0) + 1];
    }

    if (direction === 'prev') {
      itemToScrollTo = items[indexes[0] - 1];
    }

    itemToScrollTo?.scrollIntoView({
      ...scrollIntoViewOptions,
      inline: 'center',
    });
  };

  useEffect(() => {
    if (!conditionMet || !container.current || items.length) {
      return;
    }

    const getKeyboardFocusableElements = (element: HTMLElement) => {
      const elements = [...element.querySelectorAll('a, button')];
      const activeIndex = elements?.findIndex(
        (element) =>
          element.getAttribute('aria-current') === 'true' ||
          element.getAttribute('aria-current') === 'page' ||
          element.getAttribute('aria-selected') === 'true',
      );
      setSelectedItemIndex(activeIndex);

      items.push(...elements);
    };

    getKeyboardFocusableElements(container.current);
  }, [container, items, conditionMet]);

  useEffect(() => {
    if (!conditionMet) {
      return;
    }

    if (isTouchDevice()) {
      return;
    }

    const observer = observerRef.current;
    const sliderContainer = container.current;

    if (!observer) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((item) => {
            const index = items.indexOf(item.target);

            if (item.isIntersecting) {
              visibleItemIndexes.add(index);

              /* We have reached the end of the list */
              if (index === items.length - 1) {
                setHasOverflow((prev) => prev.filter((item) => item !== 'next'));
              }

              /* We have reached the beginning of the list */
              if (!index) {
                setHasOverflow((prev) => prev.filter((item) => item !== 'prev'));
              }

              return;
            }

            visibleItemIndexes.delete(index);

            /* We have prev overflow */
            if (!index) {
              setHasOverflow((prev) =>
                prev.includes('prev') ? prev : [...prev, 'prev'],
              );
            }

            /* We have next overflow */
            setHasOverflow((prev) => (prev.includes('next') ? prev : [...prev, 'next']));
          });
        },
        {
          root: sliderContainer,
          rootMargin: '100% 0% 100% 0%',
          threshold: 0.25,
        },
      );

      items.forEach((item) => {
        observerRef.current?.observe(item);
      });

      sliderContainer?.addEventListener('scroll', () => {
        items.forEach((item) => {
          observerRef.current?.observe(item);
        });
      });

      window.addEventListener('resize', () => {
        items.forEach((item) => {
          observerRef.current?.observe(item);
        });

        const selectedItem = items[selectedItemIndex];

        selectedItem?.scrollIntoView(scrollIntoViewOptions);
      });

      return;
    }

    return () => {
      observer.disconnect();

      sliderContainer?.removeEventListener('scroll', () => {
        items.forEach(() => {
          observer.disconnect();
        });
      });

      window.removeEventListener('resize', () => {
        items.forEach((item) => {
          observerRef.current?.observe(item);
        });

        const selectedItem = items[selectedItemIndex];

        selectedItem?.scrollIntoView(scrollIntoViewOptions);
      });
    };
  }, [container, items, conditionMet, selectedItemIndex, visibleItemIndexes]);

  useEffect(() => {
    const element = container.current;
    const selectedItem = items[selectedItemIndex];

    if (
      !selectedItemIndex ||
      !conditionMet ||
      !selectedItem ||
      !(selectedItem instanceof HTMLElement)
    ) {
      return;
    }

    element?.scrollTo({
      left: selectedItem.offsetLeft,
      behavior: 'instant',
    });
  }, [conditionMet, container, items, selectedItemIndex]);

  return {
    hasOverflow,
    scrollTo,
  };
}
