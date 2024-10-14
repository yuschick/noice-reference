import { SetTimeoutId } from '@noice-com/common-ui';
import { useEffect, useRef, useState } from 'react';

import { useCardGameUIState } from '@game-context';
import { useChallengesSystem } from '@game-logic/challenges/hooks';

const CHALLENGE_LOCK_DURATION = 2000;
export const CHALLENGE_CLOSE_TRANSITION_DURATION = 500;

interface HookResult {
  showLockedOverlay: boolean;
}

export function useHandleLockedOverlay(): HookResult {
  const overlayShown = useRef(false);
  const [showLockedOverlay, setShowLockedOverlay] = useState(false);

  const challengesSystem = useChallengesSystem();
  const { isChallengesDialogOpen, closeChallengesDialog } = useCardGameUIState();

  useEffect(() => {
    const reset = () => {
      overlayShown.current = false;
      setShowLockedOverlay(false);
    };

    if (!isChallengesDialogOpen || !challengesSystem) {
      reset();
      return;
    }

    const timeouts: SetTimeoutId[] = [];

    const handleLock = () => {
      if (!challengesSystem.isChallengesLocked) {
        reset();
        return;
      }

      if (overlayShown.current) {
        return;
      }

      setShowLockedOverlay(true);
      overlayShown.current = true;
      timeouts.push(
        setTimeout(() => {
          closeChallengesDialog();
        }, CHALLENGE_LOCK_DURATION),
      );
      timeouts.push(
        setTimeout(() => {
          setShowLockedOverlay(false);
        }, CHALLENGE_LOCK_DURATION + CHALLENGE_CLOSE_TRANSITION_DURATION),
      );
    };

    challengesSystem.addListener('onChallengesLockUpdated', handleLock);

    return () => {
      timeouts.forEach((timeout) => clearTimeout(timeout));
      challengesSystem.removeListener('onChallengesLockUpdated', handleLock);
    };
  }, [isChallengesDialogOpen, challengesSystem, closeChallengesDialog]);

  return {
    showLockedOverlay,
  };
}
