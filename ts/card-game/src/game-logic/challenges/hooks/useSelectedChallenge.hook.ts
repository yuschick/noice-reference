import { Nullable } from '@noice-com/utils';
import { useEffect, useState } from 'react';

import { useChallengesSystem } from './useChallengesSystem.hook';

interface HookResult {
  selectedChallengeId: Nullable<string>;
}

export function useSelectedChallenge(): HookResult {
  const [selectedChallengeId, setSelectedChallengeId] = useState<Nullable<string>>(null);

  const challengesSystem = useChallengesSystem();

  useEffect(() => {
    if (!challengesSystem) {
      return;
    }

    const updateSelectedChallenge = () => {
      if (!challengesSystem.selectedChallengeId) {
        return;
      }
      setSelectedChallengeId(challengesSystem.selectedChallengeId);
    };

    updateSelectedChallenge();

    challengesSystem.addListener('onChallengeSelected', updateSelectedChallenge);

    return () => {
      challengesSystem.removeListener('onChallengeSelected', updateSelectedChallenge);
    };
  }, [challengesSystem]);

  return {
    selectedChallengeId,
  };
}
