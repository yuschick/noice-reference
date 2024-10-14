import { Nullable } from '@noice-com/utils';

import { CGHighScoringCardsSystem } from '../CGHighScoringCardsSystem';

import { useStreamGame } from '@game-logic/game/context';

export function useHighScoringCardsSystem(): Nullable<CGHighScoringCardsSystem> {
  const { gameInstance } = useStreamGame();

  return gameInstance?.highScoringCardsSystem ?? null;
}
