import { useEffect, useState } from 'react';

import { useChallengesSystem } from '@game-logic/challenges/hooks';

interface HookResult {
  challengeIds: string[];
}

export function useChallenges(): HookResult {
  const [challengeIds, setChallengeIds] = useState<string[]>([]);

  const challengesSystem = useChallengesSystem();

  useEffect(() => {
    if (!challengesSystem) {
      return;
    }

    const updateChallenges = () => {
      setChallengeIds(challengesSystem.challengeIds);
    };

    updateChallenges();
    challengesSystem.addListener('onNewChallengesReceived', updateChallenges);

    return () => {
      challengesSystem.removeListener('onNewChallengesReceived', updateChallenges);
    };
  }, [challengesSystem]);

  return {
    challengeIds,
  };
}
