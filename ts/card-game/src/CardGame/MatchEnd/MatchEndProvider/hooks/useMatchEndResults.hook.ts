import { MatchEndedMsg } from '@noice-com/schemas/game-logic/game_logic.pb';
import { Nullable } from '@noice-com/utils';
import { useEffect, useState } from 'react';

import { useMatchResultSystem } from '@game-logic/systems/hooks/useMatchResultSystem.hook';

export function useMatchEndResults() {
  const [matchResults, setMatchResults] = useState<Nullable<MatchEndedMsg>>(null);
  const matchResultSystem = useMatchResultSystem();

  useEffect(() => {
    const onResults = () => {
      const endedMsg = matchResultSystem?.matchResults as MatchEndedMsg;
      setMatchResults(endedMsg);
    };

    matchResultSystem?.addListener('onMatchResultsAvailable', onResults);
    matchResultSystem?.addListener('onMatchResultsCleared', () => setMatchResults(null));
  }, [matchResultSystem]);

  return matchResults;
}
