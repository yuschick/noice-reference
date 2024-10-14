import debounce from 'lodash/debounce';
import { RefObject, useEffect, useRef, useState } from 'react';

/**
 *
 * This is a custom hook that returns the size of the observed container.
 *
 * Inspiration: https://usehooks-ts.com/react-hook/use-resize-observer
 * @param ref ref of the container to observe
 * @returns { inlineSize, boxSize } of the observed container
 */
export function useContainerSize<T extends HTMLElement = HTMLElement>(ref: RefObject<T>) {
  const [{ inlineSize, boxSize }, setSize] = useState<Size>(initialSize);

  const onResize = debounce(setSize, 100, { leading: true, trailing: true });

  useResizeObserver({
    ref,
    onResize,
  });

  return {
    inlineSize: inlineSize === undefined ? null : inlineSize,
    boxSize: boxSize === undefined ? null : boxSize,
  };
}

type Size = {
  inlineSize: number | undefined;
  boxSize: number | undefined;
};

type UseResizeObserverOptions<T extends HTMLElement = HTMLElement> = {
  ref: RefObject<T>;
  onResize?: (size: Size) => void;
};

const initialSize: Size = {
  inlineSize: undefined,
  boxSize: undefined,
};

function useResizeObserver<T extends HTMLElement = HTMLElement>(
  options: UseResizeObserverOptions<T>,
): Size {
  const { ref } = options;
  const [{ inlineSize, boxSize }, setSize] = useState<Size>(initialSize);
  const isMounted = useRef(false);
  const previousSize = useRef<Size>({ ...initialSize });
  const onResize = useRef<((size: Size) => void) | undefined>(undefined);
  onResize.current = options.onResize;

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    if (typeof window === 'undefined' || !('ResizeObserver' in window)) {
      return;
    }

    const observer = new ResizeObserver(([entry]) => {
      const newWidth = extractSize(entry, 'inlineSize');
      const newHeight = extractSize(entry, 'blockSize');

      const hasChanged =
        previousSize.current.inlineSize !== newWidth ||
        previousSize.current.boxSize !== newHeight;

      if (hasChanged) {
        const newSize: Size = { inlineSize: newWidth, boxSize: newHeight };
        previousSize.current.inlineSize = newWidth;
        previousSize.current.boxSize = newHeight;

        if (onResize.current) {
          onResize.current(newSize);
        } else {
          if (isMounted.current) {
            setSize(newSize);
          }
        }
      }
    });

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [ref, isMounted]);

  return { inlineSize, boxSize };
}

function extractSize(
  entry: ResizeObserverEntry,
  sizeType: keyof ResizeObserverSize,
): number | undefined {
  const box = 'borderBoxSize';
  if (!entry[box]) {
    return;
  }

  return Array.isArray(entry[box])
    ? entry[box][0][sizeType]
    : // @ts-ignore Support Firefox's non-standard behavior
      (entry[box][sizeType] as number);
}
