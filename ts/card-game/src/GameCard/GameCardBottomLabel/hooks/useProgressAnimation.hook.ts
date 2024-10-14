import { Nullable } from '@noice-com/utils';
import { RefObject, useLayoutEffect, useRef } from 'react';

import { GameTimer } from '@game-logic/timer';

interface HookResult {
  ref: RefObject<HTMLDivElement>;
}

export const useProgressAnimation = (
  nextPointsTimer: Nullable<GameTimer>,
): HookResult => {
  const ref = useRef<HTMLDivElement>(null);
  const cardHidden = useRef(false);

  useLayoutEffect(() => {
    if (!ref.current || !nextPointsTimer || !nextPointsTimer.hasTimeLeft) {
      return;
    }

    const animationElement = ref.current;

    const disableAnimation = () => {
      animationElement.style.animationName = 'none';
      animationElement.style.animationDelay = '0ms';
      animationElement.style.animationDuration = '0ms';
    };

    const enableAnimation = () => {
      if (cardHidden.current) {
        return;
      }

      // trigger reflow
      void animationElement.offsetHeight;
      animationElement.style.animationName = '';
      animationElement.style.animationDelay = `-${nextPointsTimer.timeLeft}ms`;
      animationElement.style.animationDuration = `${nextPointsTimer.duration}ms`;
    };

    enableAnimation();

    // This is so we handle animation correctly when user has been in other tabs and return
    const onTabNotVisible = () => {
      cardHidden.current = !!document.hidden;

      if (document.hidden) {
        disableAnimation();
        return;
      }
      enableAnimation();
    };

    document.addEventListener('visibilitychange', onTabNotVisible);

    return () => {
      document.removeEventListener('visibilitychange', onTabNotVisible);

      disableAnimation();
    };
  }, [nextPointsTimer]);

  return { ref };
};
