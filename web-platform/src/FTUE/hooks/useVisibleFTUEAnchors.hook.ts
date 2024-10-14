import { useMountEffect } from '@noice-com/common-react-core';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface HookResult {
  visibleFTUEIds: string[];
  anchorsById: Record<string, HTMLElement>;
}

const FTUE_DATA_ATTRIBUTE = 'data-ftue-anchor';

export function useVisibleFTUEAnchors(activeIds: string[]): HookResult {
  const [renderedAnchors, setRenderedAnchors] = useState<HTMLElement[]>([]);
  const [visibleFTUEIds, setVisibleFTUEIds] = useState<string[]>([]);

  const mutationObserver = useRef<MutationObserver>();
  const intersectionObserver = useRef<IntersectionObserver>();
  const observedAnchors = useRef<HTMLElement[]>([]);

  useMountEffect(() => {
    // Create intersection observer on mount to prevent it be created multiple times
    intersectionObserver.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const FTUEId = entry.target.getAttribute(FTUE_DATA_ATTRIBUTE);

        if (!FTUEId) {
          return;
        }

        const isIntersecting = entry.isIntersecting;

        // Hide FTUE id
        if (!isIntersecting) {
          setVisibleFTUEIds((prev) => [...prev.filter((id) => id !== FTUEId)]);
          return;
        }

        // Set FTUE id to be visible
        setVisibleFTUEIds((prev) => {
          if (prev.findIndex((id) => id === FTUEId) >= 0) {
            return prev;
          }

          return [...prev, FTUEId];
        });
      });
    });

    return () => {
      mutationObserver.current?.disconnect();
      intersectionObserver.current?.disconnect();
    };
  });

  const mutationCallback = useCallback(() => {
    // Get all FTUE anchors
    const ftueAnchors = document.body.querySelectorAll(`[${FTUE_DATA_ATTRIBUTE}]`);

    // Get reach portal
    const reachPortal = document.body.querySelector('reach-portal');

    const anchors: HTMLElement[] = [];

    ftueAnchors.forEach((anchor) => {
      // Do nothing if id is not active
      const id = anchor.getAttribute(FTUE_DATA_ATTRIBUTE);

      if (!id || !activeIds.includes(id)) {
        return;
      }

      // Do nothing if anchor is not in reach portal
      if (reachPortal && !reachPortal.contains(anchor)) {
        return;
      }

      // Get all anchor elements
      anchors.push(anchor as HTMLElement);
    });

    setRenderedAnchors((prev) => {
      // Get all new anchors
      const anchorsToAdd = anchors.filter(
        (anchor) => prev.findIndex((el) => el === anchor) < 0,
      );

      // Get all anchors that does not exist anymore
      const anchorsToRemove = prev.filter(
        (el) => anchors.findIndex((anchor) => el === anchor) < 0,
      );

      // If no new to add or old to remove, do nothing
      if (!anchorsToAdd.length && !anchorsToRemove.length) {
        return prev;
      }

      // Set as rendered previous and new anchors, removing non-existing
      return [...new Set([...prev, ...anchorsToAdd])].filter(
        (el) => anchorsToRemove.findIndex((anchorToRemove) => el === anchorToRemove) < 0,
      );
    });
  }, [activeIds]);

  useEffect(() => {
    // Stop observing if no active ids
    if (!activeIds.length) {
      mutationObserver.current?.disconnect();
      intersectionObserver.current?.disconnect();
      return;
    }

    // Do nothing if there is already observer
    if (mutationObserver.current) {
      return;
    }

    // Get renderer anchors on init
    mutationCallback();

    mutationObserver.current = new MutationObserver(mutationCallback);

    // Observer DOM changes on body
    mutationObserver.current?.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: false,
    });
  }, [activeIds.length, mutationCallback]);

  useEffect(() => {
    if (!intersectionObserver.current) {
      return;
    }

    const observer = intersectionObserver.current;

    const currentObservedAnchors = observedAnchors.current;

    // Get all new anchors that should be observed
    const anchorsToObserve = renderedAnchors.filter(
      (anchor) => currentObservedAnchors.findIndex((el) => el === anchor) < 0,
    );

    // Get all anchors that should not be observed anymore
    const anchorsToUnobserve = currentObservedAnchors.filter(
      (el) => renderedAnchors.findIndex((anchor) => el === anchor) < 0,
    );

    // Observer all new that should
    anchorsToObserve.forEach((anchor) => observer.observe(anchor));

    // Unobserve all anchors that should
    anchorsToUnobserve.forEach((anchor) => observer.unobserve(anchor));

    // Remove unobserved anchors form visible anchor array
    const nonVisibleAnchorIds = anchorsToUnobserve.map((anchor) =>
      anchor.getAttribute(FTUE_DATA_ATTRIBUTE),
    );

    if (nonVisibleAnchorIds.length) {
      setVisibleFTUEIds((prev) =>
        prev.filter((anchorId) => !nonVisibleAnchorIds.includes(anchorId)),
      );
    }

    // Save observed anchors
    observedAnchors.current = [
      ...new Set([...currentObservedAnchors, ...anchorsToObserve]),
    ].filter(
      (anchor) =>
        anchorsToUnobserve.findIndex(
          (anchorToUnobserve) => anchor === anchorToUnobserve,
        ) < 0,
    );
  }, [renderedAnchors]);

  const anchorsById = useMemo(() => {
    const anchors: Record<string, HTMLElement> = {};

    renderedAnchors.forEach((anchor) => {
      const id = anchor.getAttribute(FTUE_DATA_ATTRIBUTE);

      if (!id) {
        return;
      }

      anchors[id] = anchor;
    });

    return anchors;
  }, [renderedAnchors]);

  return { visibleFTUEIds, anchorsById };
}
