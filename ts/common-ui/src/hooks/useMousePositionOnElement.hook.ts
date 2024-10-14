import { Nullable } from '@noice-com/utils';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Point2D } from '@common-types';

interface HookResult {
  mousePosition: Point2D;
  isHovering: boolean;
}

interface Props {
  elementRef: React.RefObject<HTMLElement | undefined>;
  preventHoverEffects?: boolean;
  actAsHovered?: boolean;
  resizeBoundingRectDelay?: number;
  resizeCalculationDependencies?: unknown[];
}

export function useMousePositionOnElement({
  elementRef,
  preventHoverEffects,
  actAsHovered,
  resizeBoundingRectDelay,
  resizeCalculationDependencies = [],
}: Props): HookResult {
  const [isHovering, setIsHovering] = useState(false);
  const elRectRef = useRef<Nullable<DOMRect>>(null);
  const [positionOnEl, setPositionOnEl] = useState<Point2D>({
    x: 0.5,
    y: 0.5,
  });

  const resizeTimeout = useRef(0);

  const onMouseEnter = useCallback(() => {
    setIsHovering(true);

    if (!elementRef.current) {
      return;
    }

    elRectRef.current = elementRef.current.getBoundingClientRect();
  }, [elementRef]);

  const onMouseMove = useCallback((event: MouseEvent) => {
    if (!elRectRef.current) {
      return;
    }

    const x = event.clientX - elRectRef.current.x;
    const y = event.clientY - elRectRef.current.y;

    if (x < 0 || y < 0) {
      return;
    }

    setPositionOnEl({
      x: x / elRectRef.current.width,
      y: y / elRectRef.current.height,
    });
  }, []);

  const onMouseLeave = useCallback(() => {
    setIsHovering(false);
    setPositionOnEl({ x: 0.5, y: 0.5 });
  }, []);

  useEffect(() => {
    const element = elementRef.current;

    if (!element) {
      return;
    }

    // Return data to init state if hover effects are prevented
    if (preventHoverEffects) {
      setPositionOnEl({ x: 0.5, y: 0.5 });
      setIsHovering(false);
      clearTimeout(resizeTimeout.current);
      return;
    }

    elRectRef.current = element.getBoundingClientRect();

    element.addEventListener('mousemove', onMouseMove);
    element.addEventListener('mouseenter', onMouseEnter);
    element.parentElement?.addEventListener('mouseleave', onMouseLeave);

    return () => {
      clearTimeout(resizeTimeout.current);
      element.removeEventListener('mousemove', onMouseMove);
      element.removeEventListener('mouseenter', onMouseEnter);
      element.parentElement?.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [onMouseEnter, onMouseMove, onMouseLeave, elementRef, preventHoverEffects]);

  const resizeDepsStr = JSON.stringify(resizeCalculationDependencies);
  useEffect(() => {
    // clean the old one if exists
    if (resizeTimeout.current) {
      clearTimeout(resizeTimeout.current);
    }

    // After size transition has happened, get the new card position
    resizeTimeout.current = window.setTimeout(() => {
      if (!elementRef.current) {
        return;
      }

      elRectRef.current = elementRef.current.getBoundingClientRect();
    }, resizeBoundingRectDelay);
  }, [elementRef, resizeBoundingRectDelay, resizeDepsStr]);

  return { mousePosition: positionOnEl, isHovering: isHovering || actAsHovered || false };
}
