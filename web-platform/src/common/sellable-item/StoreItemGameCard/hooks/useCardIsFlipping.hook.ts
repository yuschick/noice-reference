import { useEffect, useRef, useState } from 'react';

export const FLIP_TRANSITION_TIME = 500;

export function useCardIsFlipping(showBackside?: boolean): boolean {
  const previousShowBackside = useRef(showBackside);
  const [cardIsFlipping, setCardIsFlipping] = useState(false);

  useEffect(() => {
    // If showBackside is same as it was, do nothing
    if (showBackside === previousShowBackside.current) {
      return;
    }

    previousShowBackside.current = showBackside;

    setCardIsFlipping(true);

    const timeout = setTimeout(() => {
      setCardIsFlipping(false);
    }, FLIP_TRANSITION_TIME);

    return () => {
      clearTimeout(timeout);
    };
  }, [showBackside]);

  return cardIsFlipping;
}
