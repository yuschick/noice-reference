import clamp from 'lodash/clamp';
import { MouseEvent, RefObject, useCallback, useEffect, useRef, useState } from 'react';

interface TargetIndices {
  backwards: number;
  forwards: number;
}

interface HookResult {
  nextScrollRef: RefObject<HTMLDivElement>;
  prevScrollRef: RefObject<HTMLDivElement>;
  scrollContainerRef: RefObject<HTMLDivElement>;
  targetIndices: TargetIndices;
  isDragScrolling: boolean;
  visibleIndices: number[];

  scrollForwards(): void;
  scrollBackwards(): void;
  startDragScroll(e: MouseEvent<HTMLDivElement>): void;
  endDragScroll(): void;
  dragScroll(e: MouseEvent<HTMLDivElement>): void;
}

interface Props {
  initialIndex: number;
  itemCount: number;
  totalCount: number;
}

export function useRewardTrackNavigation({
  initialIndex,
  itemCount,
  totalCount,
}: Props): HookResult {
  const nextScrollRef = useRef<HTMLDivElement>(null);
  const prevScrollRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const visibleIndices = useRef<number[]>([]);
  const intersectionObserver = useRef<IntersectionObserver>();

  const [isDragScrolling, setIsDragScrolling] = useState<boolean>(false);
  const [scrollStart, setScrollStart] = useState<number>(0);
  const [scrollStartPos, setScrollStartPos] = useState<number>(0);

  const [targetIndices, setTargetIndices] = useState<TargetIndices>({
    backwards: 0,
    forwards: 0,
  });

  const scrollForwards = useCallback(() => {
    if (!scrollContainerRef.current) {
      return;
    }

    nextScrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const scrollBackwards = useCallback(() => {
    if (!scrollContainerRef.current) {
      return;
    }

    prevScrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const startDragScroll = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if (!scrollContainerRef.current) {
      return;
    }

    setIsDragScrolling(true);
    setScrollStart(e.clientX);
    setScrollStartPos(scrollContainerRef.current.scrollLeft);
  }, []);

  const endDragScroll = useCallback(() => {
    setIsDragScrolling(false);
    setScrollStart(0);
    setScrollStartPos(0);
  }, []);

  const dragScroll = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (!isDragScrolling || !scrollContainerRef.current) {
        return;
      }

      const diff = -(e.clientX - scrollStart);
      scrollContainerRef.current.scrollLeft = scrollStartPos + diff;
    },
    [isDragScrolling, scrollStart, scrollStartPos],
  );

  // To understand basics of IntersectionObserver and IntersectionObserverCallback
  // please refer to this documentation: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
  const intersectionCallback = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (totalCount <= 0) {
        return;
      }

      // IF you read the documentation of IntersectionObserver, you will know that
      // the entries here contain elements which intersection status have changed, so
      // we luckily don't get all of the objects in the container every time.
      entries.forEach((entry) => {
        // We are adding the elements to the scroll container with a data-attribute with
        // the index of the element. This way we'll know the index of the element without
        // resolving it separately.
        const entryIndex = Number(entry.target.getAttribute('data-element-index'));

        if (isNaN(entryIndex)) {
          return;
        }

        // If the intersectionRatio of the element is smaller than 1 it is not completely
        // visible, so we remove it from the list of visible element indices (visibleIndices)
        if (entry.intersectionRatio < 1 && visibleIndices.current.includes(entryIndex)) {
          visibleIndices.current.splice(
            visibleIndices.current.findIndex((visible) => visible === entryIndex),
            1,
          );
        }
        // If the intersectionRatio is 1 the element is fully visible and we can add its
        // index to the visibleIndices list.
        else if (entry.intersectionRatio === 1) {
          visibleIndices.current.push(entryIndex);
        }
      });

      // Sort the vsibleIndices list in ascending order. This way we can easily
      // check now which index is the first visible and which one is the last
      visibleIndices.current.sort((a, b) => (a < b ? -1 : 1));

      if (!scrollContainerRef.current) {
        return;
      }

      // After we have processed the list of visibleIndices we can resolve which
      // indices are the next ones to be scrollIntoView targets for the backwards
      // and forwards scroll buttons.
      const backwards = clamp(
        visibleIndices.current[0] - itemCount,
        0,
        scrollContainerRef.current.children.length,
      );

      const forwards = clamp(
        visibleIndices.current[visibleIndices.current.length - 1] + itemCount,
        0,
        scrollContainerRef.current.children.length - 1,
      );

      setTargetIndices({ backwards, forwards });
    },
    [itemCount, totalCount],
  );

  useEffect(() => {
    if (intersectionObserver.current) {
      intersectionObserver.current.disconnect();
      visibleIndices.current = [];
    }

    // If we don't have everything we need OR we already have an observer, exit.
    if (!scrollContainerRef.current || !intersectionCallback) {
      return;
    }

    // Setup options for the observer
    const options: IntersectionObserverInit = {
      root: scrollContainerRef.current,
      threshold: 1,
    };

    // Create the observer
    intersectionObserver.current = new IntersectionObserver(
      intersectionCallback,
      options,
    );

    // Add the elements from the scroll container to the observer
    for (let i = 0; i < scrollContainerRef.current.children.length; i++) {
      intersectionObserver.current.observe(scrollContainerRef.current.children[i]);
    }

    // We could do a return here with: observer.disconnect, but for some reason
    // it generates an error. Maybe the observer is trying to use the root element
    // and it is already removed or so, but it is theoretically possible that the
    // observer is leaking here until a solution is found.
  }, [intersectionCallback]);

  useEffect(() => {
    if (!scrollContainerRef.current) {
      return;
    }

    let scrollLeft = 0;

    for (let i = 0; i < initialIndex; i++) {
      scrollLeft += scrollContainerRef.current.children[i].clientWidth + 8;
    }

    scrollContainerRef.current.scrollLeft = scrollLeft;
  }, [initialIndex]);

  return {
    nextScrollRef,
    prevScrollRef,
    scrollContainerRef,
    targetIndices,
    isDragScrolling,
    visibleIndices: visibleIndices.current,

    scrollForwards,
    scrollBackwards,
    startDragScroll,
    endDragScroll,
    dragScroll,
  };
}
