import { StreamStateRoundPhase } from '@noice-com/schemas/game-logic/game_logic.pb';
import { Nullable } from '@noice-com/utils';
import { useEffect, useState } from 'react';

import type { GameTimer } from '../../timer';
import { CGActiveCardOnPointsUpdated } from '../types';

import { usePlayerActiveCard } from './usePlayerActiveCard.hook';

import { useRoundPhase } from '@game-logic/game/hooks';

interface HookResult {
  isMaxedOut: boolean;
  points: number;
  nextPointsTimer: GameTimer | null;
}

export function useCardPoints(playerID: string): HookResult {
  const card = usePlayerActiveCard(playerID);
  const roundPhase = useRoundPhase();
  const [points, setPoints] = useState(-1);
  const [nextPointsTimer, setNextPointsTimer] = useState<Nullable<GameTimer>>(null);
  const [isMaxedOut, setMaxedOut] = useState(false);

  useEffect(() => {
    if (!card) {
      return;
    }

    setPoints(card.currentPoints);
    // We set the timer if not round based game or round based game in competition phase
    setNextPointsTimer(
      roundPhase === StreamStateRoundPhase.ROUND_PHASE_UNSPECIFIED ||
        roundPhase === StreamStateRoundPhase.ROUND_PHASE_COMPETITION
        ? card.pointsUpdateTimer
        : null,
    );
    setMaxedOut(!card.pointsUpdateTimer);

    const onUpdated = ({
      pointsTotal,
      nextPointsTimer,
      isMaxedOut,
    }: CGActiveCardOnPointsUpdated) => {
      setPoints(pointsTotal);
      setNextPointsTimer(nextPointsTimer);
      setMaxedOut(isMaxedOut);
    };

    card.addListener('onPointsUpdated', onUpdated);

    return () => {
      card.removeListener('onPointsUpdated', onUpdated);
    };
  }, [card, roundPhase]);

  return {
    points,
    nextPointsTimer,
    isMaxedOut,
  };
}
