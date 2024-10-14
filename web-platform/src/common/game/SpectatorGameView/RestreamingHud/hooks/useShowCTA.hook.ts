import { AnimationEvent, RefObject, useEffect, useRef, useState } from 'react';

interface HookResult {
  ctaContainerRef: RefObject<HTMLDivElement>;
  showCTA: boolean;
  onAnimationEnd: (event: AnimationEvent) => void;
}

export function useShowCTA(): HookResult {
  const ctaContainerRef = useRef<HTMLDivElement>(null);
  const initialCTARenderRef = useRef(true);
  const [showCTA, setShowCTA] = useState(true);

  // When animation ends, hide the CTA from dom
  const onAnimationEnd = (event: AnimationEvent) => {
    if (event.target !== ctaContainerRef.current) {
      return;
    }

    setShowCTA(false);
  };

  useEffect(() => {
    if (initialCTARenderRef.current) {
      initialCTARenderRef.current = false;
      return;
    }

    if (showCTA) {
      return;
    }

    // When CTA is hidden, show it again after 60 seconds
    const timeout = setTimeout(() => setShowCTA(true), 60000);

    return () => clearTimeout(timeout);
  }, [showCTA]);

  return {
    ctaContainerRef,
    showCTA,
    onAnimationEnd,
  };
}
