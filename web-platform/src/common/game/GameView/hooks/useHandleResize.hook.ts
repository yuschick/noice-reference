import { RefObject, TransitionEvent, useRef } from 'react';

interface HookResult {
  wrapperRef: RefObject<HTMLDivElement>;
  onTransitionEnd: (event: TransitionEvent<HTMLDivElement>) => void;
}

export function useHandleResize(): HookResult {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const onTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
    if (!wrapperRef.current) {
      return;
    }

    // Make sure we are triggered by wrapper related transitions, not by children (bubbling events)
    if (event.target !== wrapperRef.current) {
      return;
    }

    window.dispatchEvent(new Event('resize'));
  };

  return {
    wrapperRef,
    onTransitionEnd,
  };
}
