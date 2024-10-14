import { SetTimeoutId, useAuthenticatedUser } from '@noice-com/common-ui';
import { StreamStateRoundPhase } from '@noice-com/schemas/game-logic/game_logic.pb';
import { Nullable } from '@noice-com/utils';
import { useCallback, useEffect, useRef, useState } from 'react';

import { AllOrNothingState } from '../types';

import { useAonSounds } from '@game-common/sound/hooks';
import { AON_DECISION_DURATION } from '@game-constants';
import { usePlayerActiveCard } from '@game-logic/card/hooks';
import { CGActiveCardOnSucceeded } from '@game-logic/card/types';
import { useRoundPhase } from '@game-logic/game/hooks';
import { CGPlayerOnRemoved } from '@game-logic/player';
import { useCardGamePlayer } from '@game-logic/player/hooks';
import { GameTimer } from '@game-logic/timer';

interface HookResult {
  allOrNothing: Nullable<AllOrNothingState>;
  onPlayAgainAllOrNothing: () => void;
  onCollectAllOrNothing: () => void;
}

interface Options {
  onAonStateChange: (state: Nullable<AllOrNothingState>) => void;
}

export function useAllOrNothing(playerId: string, options?: Options): HookResult {
  const { onAonStateChange } = options ?? {};
  const roundPhase = useRoundPhase();
  const showAoNState =
    roundPhase === StreamStateRoundPhase.ROUND_PHASE_UNSPECIFIED ||
    roundPhase === StreamStateRoundPhase.ROUND_PHASE_PREPARATION;

  const { userId } = useAuthenticatedUser();
  const activeCard = usePlayerActiveCard(playerId);
  const player = useCardGamePlayer(playerId);
  const isLocalPlayer = userId === playerId;

  // Pre state is set when the card succeeds
  //
  // Motivation for having two states: Since with round based games
  // the AoN dialog with autocollect timer is shown much later after card succeed,
  // we need to initiate it only when we are actually ready to show it.
  const [preRenderState, setPreRenderState] =
    useState<Nullable<Omit<AllOrNothingState, 'timer'>>>(null);
  // But readyToRenderState is set when the card is ready to be rendered
  const [readyToRenderState, setReadyToRenderState] =
    useState<Nullable<AllOrNothingState>>(null);
  const timeoutRef = useRef<Nullable<SetTimeoutId>>(null);

  // Clear the AoN state
  useEffect(() => {
    if (!player) {
      return;
    }

    const clear = () => {
      setPreRenderState(null);
      setReadyToRenderState(null);
    };

    clear();

    const onPlayerLeft = ({ isPermanent }: CGPlayerOnRemoved) => {
      if (!isPermanent) {
        return;
      }
      clear();
    };

    player.addListener('onRemoved', onPlayerLeft);
    player.addListener('onAonPointsCollected', clear);

    return () => {
      player.removeListener('onRemoved', onPlayerLeft);
      player.removeListener('onAonPointsCollected', clear);
    };
  }, [player]);

  // Set AoN state on succeed
  useEffect(() => {
    if (!activeCard || !player) {
      return;
    }

    setPreRenderState(null);
    setReadyToRenderState(null);

    // We want to clear the timeout if a new card is set
    // (not in useEffect return since that happens always right away when card fails/succeeds)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    const onSucceeded = ({ allOrNothing, boosterPoints }: CGActiveCardOnSucceeded) => {
      if (!allOrNothing) {
        return;
      }

      setPreRenderState({
        cardId: activeCard.cardId,
        allOrNothing,
        boosterPoints,
      });
    };

    activeCard.addListener('onSucceeded', onSucceeded);

    return () => {
      activeCard.removeListener('onSucceeded', onSucceeded);
    };
  }, [activeCard, player, isLocalPlayer]);

  // Render AoN state
  useEffect(() => {
    if (!isLocalPlayer || !preRenderState || !player || !showAoNState) {
      return;
    }

    // Since okay to show AoN, update states with autocollect timer
    setPreRenderState(null);
    setReadyToRenderState({
      ...preRenderState,
      timer: GameTimer.FromNow(AON_DECISION_DURATION),
    });

    // Let's autocollect the points after a certain duration
    timeoutRef.current = setTimeout(() => {
      player.collectAONPoints();
    }, AON_DECISION_DURATION);
  }, [player, preRenderState, showAoNState, isLocalPlayer]);

  const { playAonDoubleDown } = useAonSounds();

  const onPlayAgainAllOrNothing = () => {
    if (!readyToRenderState || !readyToRenderState.allOrNothing) {
      return;
    }

    if (!player) {
      throw new Error('useAllOrNothing - onPlayAgain: no player');
    }

    player.setActiveCard(readyToRenderState.cardId);
    playAonDoubleDown();
  };

  const onCollectAllOrNothing = useCallback(() => {
    if (!player) {
      throw new Error('useAllOrNothing - onCollect: no player');
    }

    player.collectAONPoints();

    // Clear the auto collect timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, [player]);

  useEffect(() => {
    onAonStateChange?.(readyToRenderState);
  }, [readyToRenderState, onAonStateChange]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    allOrNothing: readyToRenderState,
    onPlayAgainAllOrNothing,
    onCollectAllOrNothing,
  };
}
