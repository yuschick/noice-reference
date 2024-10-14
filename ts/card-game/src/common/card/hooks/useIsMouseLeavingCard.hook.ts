import { useEffect, useRef, useState } from 'react';

import { MOUSE_IS_LEAVING_TRANSFORM_TRANSITION } from '@game-constants';

interface HookResult {
  isMouseLeaving: boolean;
}

interface Props {
  isHovering: boolean;
}

export function useIsMouseLeavingCard({ isHovering }: Props): HookResult {
  // This protects against initial renders or card never being hovered causing state updates
  const cardWasJustHoveredRef = useRef(false);

  const [isMouseLeaving, setIsMouseLeaving] = useState(false);

  useEffect(() => {
    if (isHovering) {
      setIsMouseLeaving(false);
      cardWasJustHoveredRef.current = true;
      return;
    }

    // If card wasn't just hovered, we are not interested and do nothing
    if (!cardWasJustHoveredRef.current) {
      return;
    }

    setIsMouseLeaving(true);

    // Clear mouse is leaving after time
    const leavingTimeout = setTimeout(() => {
      setIsMouseLeaving(false);
      cardWasJustHoveredRef.current = false;
    }, MOUSE_IS_LEAVING_TRANSFORM_TRANSITION);

    return () => {
      clearTimeout(leavingTimeout);
    };
  }, [isHovering]);

  return {
    isMouseLeaving,
  };
}
