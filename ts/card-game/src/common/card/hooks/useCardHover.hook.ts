import { useLeavingTransition } from '@noice-com/common-ui';
import { useEffect, useState } from 'react';

import { useIsBoosterTarget, usePlayerBoosterApply } from '@game-logic/boosters/hooks';

interface Props {
  playerId: string;
  preventHover?: boolean;
}

interface HookResult {
  isHovered: boolean;
  isLeavingHovered: boolean;
  setHovered: (hovered: boolean) => void;
}

export function useCardHover({ playerId, preventHover }: Props): HookResult {
  const [isHovered, setHovered] = useState(false);
  const { applyModeActive } = usePlayerBoosterApply();
  const { isBoosterTarget } = useIsBoosterTarget(playerId);

  const updateHoverState = (hovered: boolean) => {
    if (preventHover) {
      setHovered(false);
      return;
    }

    if (applyModeActive && !isBoosterTarget) {
      return;
    }

    setHovered(hovered);
  };

  useEffect(() => {
    setHovered(false);
  }, [applyModeActive]);

  const { isLeaving: isLeavingHovered } = useLeavingTransition({
    isShown: isHovered,
    duration: '--game-card-hover-transition-duration',
  });

  return {
    isHovered,
    isLeavingHovered,
    setHovered: updateHoverState,
  };
}
