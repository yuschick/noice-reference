import { useCallback, useEffect, useState } from 'react';

import { useChallengesSystem } from '@game-logic/challenges/hooks';

interface HookResult {
  pickRatePercentages: Record<string, number>;
  resetPickRates: () => void;
}

export function usePickRates(): HookResult {
  const [pickRatePercentages, setPickRatePercentages] = useState<Record<string, number>>(
    {},
  );
  const reset = useCallback(() => setPickRatePercentages({}), []);

  const challengesSystem = useChallengesSystem();

  // onChallengePickRatesUpdate
  useEffect(() => {
    if (!challengesSystem) {
      return;
    }

    const pickRateUpdate = () => {
      setPickRatePercentages(challengesSystem.challengePickRates);
    };

    if (challengesSystem) {
      setPickRatePercentages(challengesSystem.challengePickRates);
    }

    challengesSystem.addListener('onChallengePickRatesUpdated', pickRateUpdate);

    return () => {
      challengesSystem.removeListener('onChallengePickRatesUpdated', pickRateUpdate);
    };
  }, [challengesSystem]);

  return {
    pickRatePercentages,
    resetPickRates: reset,
  };
}
