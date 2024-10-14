import { useEffect, useRef, useState } from 'react';

import { usePreviousValue } from './usePreviousValue.hook';

interface Props {
  duration: number | `--${string}`;
  isShown: boolean;
}

interface HookResult {
  isLeaving: boolean;
}

/**
 * This hook is used to animate elements that are leaving the DOM so that we can apply transition styles
 * when they are mounted and leaving. But don't have to keep the transition styles when they are out.
 */
export const useLeavingTransition = ({ isShown, duration }: Props): HookResult => {
  const leavingAboutToHappen = useRef<boolean>(false);
  const isShownTimestampRef = useRef<number>(0);
  const [isLeaving, setIsLeaving] = useState<boolean>(false);
  const durValue =
    typeof duration === 'number'
      ? duration
      : Number(
          getComputedStyle(document.documentElement)
            .getPropertyValue(duration)
            .replace(/\D+/g, ''),
        );
  const previousIsShown = usePreviousValue(isShown);
  const initiallyNotShown = previousIsShown === isShown && !isShown;

  useEffect(() => {
    if (isShown) {
      setIsLeaving(false);
      isShownTimestampRef.current = Date.now();
      leavingAboutToHappen.current = true;
      return;
    }

    // This hook is used to react for leaving, not to cause
    // leaving transition to initial render
    if (initiallyNotShown) {
      return;
    }

    setIsLeaving(true);

    // if user cancels the show state faster than the animation duration,
    // adjust the leaving animation duration to be the amount of time the element was shown.
    const diffSinceIsShown = Date.now() - isShownTimestampRef.current;
    const timeoutDuration = diffSinceIsShown > durValue ? durValue : diffSinceIsShown;

    const timeoutId = setTimeout(() => {
      setIsLeaving(false);
      leavingAboutToHappen.current = false;
    }, timeoutDuration);

    return () => {
      clearTimeout(timeoutId);
      leavingAboutToHappen.current = false;
    };
  }, [durValue, isShown, initiallyNotShown]);

  return {
    isLeaving: isLeaving || (!isShown && leavingAboutToHappen.current),
  };
};
