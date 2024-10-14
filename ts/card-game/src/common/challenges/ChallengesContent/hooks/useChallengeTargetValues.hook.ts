import { useCallback, useEffect, useState } from 'react';

import { useChallengesSystem } from '@game-logic/challenges/hooks';
import { useMatchEnded } from '@game-logic/game/hooks';

interface HookResult {
  targetValues: Record<string, { label: string; value: number }[]>;
  resetTargetValues: () => void;
}

export function useChallengeTargetValues(): HookResult {
  const [targetValues, setTargetValues] = useState<
    Record<string, { label: string; value: number }[]>
  >({});
  const reset = useCallback(() => setTargetValues({}), []);

  const challengesSystem = useChallengesSystem();
  useMatchEnded(reset);

  useEffect(() => {
    if (!challengesSystem) {
      return;
    }

    setTargetValues(challengesSystem.challengeTargetValues ?? {});

    const updateChallengeTargetValues = () => {
      setTargetValues(challengesSystem.challengeTargetValues ?? {});
    };

    const resetTargetValues = () => {
      setTargetValues(challengesSystem.challengeTargetValues ?? {});
    };

    challengesSystem.addListener('onChallengesUpdated', updateChallengeTargetValues);
    challengesSystem.addListener('onNewChallengesReceived', resetTargetValues);
    return () => {
      challengesSystem.removeListener('onChallengesUpdated', updateChallengeTargetValues);
      challengesSystem.removeListener('onNewChallengesReceived', resetTargetValues);
    };
  }, [challengesSystem]);

  return {
    targetValues,
    resetTargetValues: reset,
  };
}
