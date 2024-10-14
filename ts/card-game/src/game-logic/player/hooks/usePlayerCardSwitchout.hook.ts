import { StreamStateRoundPhase } from '@noice-com/schemas/game-logic/game_logic.pb';
import { Nullable } from '@noice-com/utils';
import { useEffect, useState } from 'react';

import type { GameTimer } from '../../timer';
import { CGPlayerOnSwitchoutTimer } from '../types';

import { useCardGamePlayer } from './useCardGamePlayer.hook';

import { useCardGameState } from '@game-logic/game/context';

interface HookResult {
  timer: Nullable<GameTimer>;
  isReady: boolean;
}

export function usePlayerCardSwitchout(playerId: string): HookResult {
  const gameInstance = useCardGameState();
  const player = useCardGamePlayer(playerId);
  const [timer, setTimer] = useState<Nullable<GameTimer>>(null);
  const [isReady, setReady] = useState<boolean>(false);

  useEffect(() => {
    if (!player) {
      return;
    }

    const onReady = () => {
      setTimer(null);
      setReady(true);
    };

    const onTimer = ({ timer }: CGPlayerOnSwitchoutTimer) => {
      setTimer(timer);
      setReady(false);
    };

    setTimer(player.switchoutTimer ?? null);
    setReady(player.switchoutTimer === null || player.switchoutTimer.isCompleted);

    player.addListener('onSwitchoutReady', onReady);
    player.addListener('onSwitchoutTimer', onTimer);

    return () => {
      player.removeListener('onSwitchoutReady', onReady);
      player.removeListener('onSwitchoutTimer', onTimer);
    };
  }, [player]);

  // Handle round based games switch out logic
  useEffect(() => {
    if (
      !gameInstance ||
      gameInstance.roundPhase === StreamStateRoundPhase.ROUND_PHASE_UNSPECIFIED
    ) {
      return;
    }

    const handleRoundPhaseCompetition = () => {
      setTimer(null);
      setReady(false);
    };

    const handleRoundPhasePreparation = () => {
      setReady(true);
      setTimer(null);
    };

    setTimer(null);
    setReady(gameInstance.roundPhase === StreamStateRoundPhase.ROUND_PHASE_PREPARATION);

    gameInstance.addListener('onRoundPhaseCompetition', handleRoundPhaseCompetition);
    gameInstance.addListener('onRoundPhasePreparation', handleRoundPhasePreparation);

    return () => {
      gameInstance.removeListener('onRoundPhaseCompetition', handleRoundPhaseCompetition);
      gameInstance.removeListener('onRoundPhasePreparation', handleRoundPhasePreparation);
    };
  }, [gameInstance]);

  return {
    timer,
    isReady,
  };
}
