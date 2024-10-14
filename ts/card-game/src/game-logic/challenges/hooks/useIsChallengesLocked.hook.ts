import { useEffect, useState } from 'react';

import { useChallengesSystem } from '@game-logic/challenges/hooks';

interface HookResult {
  isChallengesLocked: boolean;
}

export function useIsChallengesLocked(): HookResult {
  const [isChallengesLocked, setIsChallengesLocked] = useState(false);

  const challengesSystem = useChallengesSystem();

  useEffect(() => {
    if (!challengesSystem) {
      return;
    }

    const checkLocked = () => {
      setIsChallengesLocked(challengesSystem.isChallengesLocked);
    };

    checkLocked();

    challengesSystem.addListener('onChallengesLockUpdated', checkLocked);

    return () => {
      challengesSystem.removeListener('onChallengesLockUpdated', checkLocked);
    };
  }, [challengesSystem]);

  return {
    isChallengesLocked,
  };
}
