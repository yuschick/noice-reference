/*
  The useMountTransition hook allows elements to be transitioned 
  in and out of view without needing to be in the DOM beforehand.

  @return {
    showTransitionChild: boolean to toggle the element in/out of the DOM
    withTransitionStyles: boolean to control when transition styles are applied
  }

  Example:
  export function Sample(show: boolean) {
    const { showTransitionChild, withTransitionStyles } = useMountTransition({
      duration: 150, // transition duration in ms
      isShown: show, // element visibility boolean prop
    });

    return (
      showTransitionChild && (
        <div className={withTransitionStyles ? styles.transition : ''}>
          ...
        </div>
      )
    )
  }
*/

import { useEffect, useState } from 'react';

import { SetTimeoutId } from '@common-types';

interface Props {
  duration: number | `--${string}`;
  isShown: boolean;
}

interface HookResult {
  showTransitionChild: boolean;
  withTransitionStyles: boolean;
}

export const useMountTransition = ({ isShown, duration }: Props): HookResult => {
  const [hasTransitionedIn, setHasTransitionedIn] = useState<boolean>(false);
  const durValue =
    typeof duration === 'number'
      ? duration
      : Number(
          getComputedStyle(document.documentElement)
            .getPropertyValue(duration)
            .replace(/\D+/g, ''),
        );

  useEffect(() => {
    let timeoutId: SetTimeoutId;

    if (isShown && !hasTransitionedIn) {
      setHasTransitionedIn(true);
    } else if (!isShown && hasTransitionedIn) {
      timeoutId = setTimeout(() => setHasTransitionedIn(false), durValue);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [durValue, isShown, hasTransitionedIn]);

  return {
    showTransitionChild: hasTransitionedIn || isShown,
    withTransitionStyles: hasTransitionedIn && isShown,
  };
};
