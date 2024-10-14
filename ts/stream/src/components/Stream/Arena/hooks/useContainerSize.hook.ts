import { RefObject, useCallback, useEffect, useRef, useState } from 'react';

type Size = {
  width: number;
  height: number;
};

export function useContainerSize(): [RefObject<HTMLDivElement>, Size] {
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number | null>(null);

  const onResize = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const container = containerRef.current;

    timeoutRef.current = window.setTimeout(() => {
      const width = container?.clientWidth ?? window.innerWidth;
      const height = container?.clientHeight ?? window.innerHeight;

      setSize({ width, height });
    }, 50);
  }, [containerRef]);

  useEffect(() => {
    window.addEventListener('resize', onResize);
    const resizeObserver = new ResizeObserver(() => {
      onResize();
    });

    resizeObserver.observe(containerRef.current as Element);

    onResize();

    return () => {
      window.removeEventListener('resize', onResize);
      resizeObserver.disconnect();
    };
  }, [onResize]);

  return [containerRef, size];
}
