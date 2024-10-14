import { useEffect, useState } from 'react';

import { useChallengesSystem } from '@game-logic/challenges/hooks';

interface HookResult {
  isEnabled: boolean;
}

export function useIsChallengesEnabled(): HookResult {
  const [isEnabled, setIsEnabled] = useState(false);

  const challengesSystem = useChallengesSystem();

  useEffect(() => {
    if (!challengesSystem) {
      return;
    }

    const updateEnabled = () => {
      setIsEnabled(challengesSystem.isChallengesEnabled ?? false);
    };

    updateEnabled();

    challengesSystem.addListener('onChallengesEnabledUpdated', updateEnabled);

    return () => {
      challengesSystem.removeListener('onChallengesEnabledUpdated', updateEnabled);
    };
  }, [challengesSystem]);

  return {
    isEnabled,
  };
}
