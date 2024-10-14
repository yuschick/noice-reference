import { ChallengeState } from '@noice-com/schemas/game-logic/game_logic.pb';
import { useEffect, useState } from 'react';

import { useChallengesSystem } from './useChallengesSystem.hook';

export type ChallengeStatus = 'success' | 'failure' | 'unresolved';

interface HookResult {
  statuses: Record<string, ChallengeStatus>;
}

export function useChallengeStatuses(): HookResult {
  const [statuses, setStatuses] = useState<Record<string, ChallengeStatus>>({});

  const challengesSystem = useChallengesSystem();

  useEffect(() => {
    if (!challengesSystem) {
      return;
    }

    function getChallengeStatus(challengeState: ChallengeState): ChallengeStatus {
      return challengeState === ChallengeState.CHALLENGE_STATE_SUCCESS
        ? 'success'
        : challengeState === ChallengeState.CHALLENGE_STATE_FAILURE
        ? 'failure'
        : 'unresolved';
    }

    const updateChallengesStatus = () => {
      const statuses: Record<string, ChallengeStatus> = {};
      Object.entries(challengesSystem.challengeStatuses).forEach(([id, status]) => {
        statuses[id] = getChallengeStatus(status);
      });

      setStatuses(statuses);
    };

    updateChallengesStatus();

    challengesSystem.addListener('onNewChallengesReceived', updateChallengesStatus);
    challengesSystem.addListener('onChallengesUpdated', updateChallengesStatus);

    return () => {
      challengesSystem.removeListener('onNewChallengesReceived', updateChallengesStatus);
      challengesSystem.removeListener('onChallengesUpdated', updateChallengesStatus);
    };
  }, [challengesSystem]);

  return {
    statuses,
  };
}
