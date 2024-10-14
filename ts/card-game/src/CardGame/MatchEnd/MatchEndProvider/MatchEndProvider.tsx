import { MatchEndedMsg } from '@noice-com/schemas/game-logic/game_logic.pb';
import { Nullable } from '@noice-com/utils';
import { PropsWithChildren, createContext, useContext } from 'react';

import { useMatchEndPlayerRewards } from './hooks/useMatchEndPlayerRewards.hook';
import { useMatchEndResults } from './hooks/useMatchEndResults.hook';
import { MatchRewards } from './types';

export interface MatchEndData {
  rawResults: MatchEndedMsg;
  rewards: Nullable<MatchRewards>;
}

const MatchEndContext = createContext<Nullable<MatchEndData>>(null);

export function useMatchEnd() {
  return useContext(MatchEndContext);
}

export function MatchEndProvider({ children }: PropsWithChildren) {
  const rawResults = useMatchEndResults();
  const rewards = useMatchEndPlayerRewards();
  const matchEndData = rawResults ? { rawResults, rewards } : null;

  return (
    <MatchEndContext.Provider value={matchEndData}>{children}</MatchEndContext.Provider>
  );
}

interface MockProps {
  matchEndMsg?: MatchEndedMsg;
  matchRewards?: MatchRewards;
}

export function MockMatchEndProvider({
  matchEndMsg,
  matchRewards,
  children,
}: PropsWithChildren<MockProps>) {
  let value: Nullable<MatchEndData> = null;
  if (matchEndMsg && matchRewards) {
    value = {
      rawResults: matchEndMsg,
      rewards: matchRewards,
    };
  }

  return <MatchEndContext.Provider value={value}>{children}</MatchEndContext.Provider>;
}
