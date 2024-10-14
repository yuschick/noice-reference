import { Nullable } from '@noice-com/utils';

import { CGChallengesSystem } from '../CGChallengesSystem';

import { useStreamGame } from '@game-logic/game/context';

export function useChallengesSystem(): Nullable<CGChallengesSystem> {
  const { gameInstance } = useStreamGame();

  return gameInstance?.challengesSystem ?? null;
}
