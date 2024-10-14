import { SetTimeoutId } from '@noice-com/common-ui';
import {
  ActiveCardFailedMsgReason,
  StreamStateRoundPhase,
} from '@noice-com/schemas/game-logic/game_logic.pb';
import { Nullable } from '@noice-com/utils';
import { useEffect, useRef, useState } from 'react';

import { CardHighlightState, CardHighlightStateType } from '../types';

import { CARD_ROW_HIGHLIGHT_MINIMUM_DURATION } from '@game-constants';
import { usePlayerActiveCard } from '@game-logic/card/hooks';
import { CGActiveCardOnFailed, CGActiveCardOnSucceeded } from '@game-logic/card/types';
import { useIsRoundBasedGame, useRoundPhase } from '@game-logic/game/hooks';
import { CGPlayerOnAonPointsCollected, CGPlayerOnRemoved } from '@game-logic/player';
import { useCardGamePlayer } from '@game-logic/player/hooks';
import { BoosterType } from '@game-types';

interface HookResult {
  highlightState: Nullable<CardHighlightState>;
}

const notHighlightedBoosters = [BoosterType.SpeedUp];

export function useCardRowCardHighlightState(playerId: string): HookResult {
  const activeCard = usePlayerActiveCard(playerId);
  const player = useCardGamePlayer(playerId);
  const roundState = useRoundPhase();
  const isRoundBasedGame = useIsRoundBasedGame();

  const [state, setState] = useState<Nullable<CardHighlightState>>(null);
  const timeoutRef = useRef<Nullable<SetTimeoutId>>(null);

  // Aon points collected
  useEffect(() => {
    if (!player) {
      return;
    }

    setState(null);

    const onAonCollect = ({
      cardId,
      pointsTotal,
      isBestPlay,
    }: CGPlayerOnAonPointsCollected) => {
      setState({
        playerTotalPoints: player.score,
        type: isBestPlay
          ? CardHighlightStateType.BestPlay
          : CardHighlightStateType.Success,
        cardId,
        points: pointsTotal,
      });
    };

    player.addListener('onAonPointsCollected', onAonCollect);

    return () => {
      player.removeListener('onAonPointsCollected', onAonCollect);
    };
  }, [player]);

  // Clear on player left
  useEffect(() => {
    if (!player) {
      return;
    }

    setState(null);

    const onPlayerLeft = ({ isPermanent }: CGPlayerOnRemoved) => {
      if (!isPermanent) {
        return;
      }
      setState(null);
    };

    player.addListener('onRemoved', onPlayerLeft);

    return () => {
      player.removeListener('onRemoved', onPlayerLeft);
    };
  }, [player]);

  useEffect(() => {
    if (!activeCard || !player) {
      return;
    }

    setState(null);

    // We want to clear the timeout if a new card is set
    // (not in useEffect return since that happens always right away when card fails/succeeds)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const calculateHighlightTimings = (): NonNullable<
      CardHighlightState['boosterAnimationTimings']
    > => {
      const appliedBoostersAmount = activeCard.getActiveBoosters().length;

      // Root constants
      const playerScoreDuration = 800;
      const highlightBoosterDelay = 300;
      const highlightBoosterDuration = 1000;

      // Derived from the above constants
      const boosterScoreStartDelay = 1.25 * highlightBoosterDuration;
      const boosterLabelStartDelay = 0.65 * highlightBoosterDuration;
      const boosterScoreInternalDelay = 0.4 * highlightBoosterDuration;
      const boosterScoreInternalDuration = 0.6 * highlightBoosterDuration;

      // Booster score animation is the longest animation in the highlight regarding boosters,
      // so let's calculate it and use it in the total duration calculation.
      const boosterScoreAnimationTotal =
        appliedBoostersAmount > 0
          ? boosterScoreStartDelay +
            appliedBoostersAmount * highlightBoosterDuration +
            (appliedBoostersAmount - 1) * highlightBoosterDelay
          : 0;

      // Card highlight total duration depends on the amount of boosters applied on the card.
      // But the highlight duration should always be at least CARD_ROW_HIGHLIGHT_MINIMUM_DURATION.
      const totalDuration = Math.max(
        // Add little 700ms buffer breather in the end
        playerScoreDuration + boosterScoreAnimationTotal + 700,
        CARD_ROW_HIGHLIGHT_MINIMUM_DURATION,
      );

      return {
        totalDuration,
        playerScoreDuration,
        highlightBoosterDelay,
        highlightBoosterDuration,
        boosterScoreStartDelay,
        boosterLabelStartDelay,
        boosterScoreInternalDelay,
        boosterScoreInternalDuration,
      };
    };

    const onSucceeded = ({
      allOrNothing,
      isBestPlay,
      boosterPoints,
      pointsTotal,
    }: CGActiveCardOnSucceeded) => {
      // If AoN succeeded, it will be handled by `useAllOrNothing` hook
      if (allOrNothing && !isRoundBasedGame) {
        return;
      }

      const type = isBestPlay
        ? CardHighlightStateType.BestPlay
        : CardHighlightStateType.Success;

      const appliedBoosters = activeCard.getActiveBoosters().map((booster) => ({
        boosterId: booster.boosterId,
        donatorUserId: booster.givenById,
      }));

      const boosterAnimationTimings = calculateHighlightTimings();

      setState({
        playerTotalPoints: player.score,
        boosterAnimationTimings,
        type,
        cardId: activeCard.cardId,
        points: pointsTotal,
        boosters: appliedBoosters
          .map(({ boosterId }) => ({
            boosterId,
            points: boosterPoints.find(
              (boosterPoint) => boosterPoint.boosterId === boosterId,
            )?.points,
          }))
          .filter(({ boosterId }) => !notHighlightedBoosters.includes(boosterId)),
      });
    };

    const onFailed = ({ reason, pointsTotal, boosterPoints }: CGActiveCardOnFailed) => {
      if (reason !== ActiveCardFailedMsgReason.REASON_CARD_FAILED) {
        return;
      }
      const appliedBoosters = activeCard.getActiveBoosters().map((booster) => ({
        boosterId: booster.boosterId,
        donatorUserId: booster.givenById,
      }));

      const boosterAnimationTimings = calculateHighlightTimings();

      setState({
        playerTotalPoints: player.score,
        boosterAnimationTimings,
        type: CardHighlightStateType.Failure,
        points: pointsTotal,
        cardId: activeCard.cardId,
        boosters: appliedBoosters
          .map(({ boosterId }) => ({
            boosterId,
            points: boosterPoints.find(
              (boosterPoint) => boosterPoint.boosterId === boosterId,
            )?.points,
          }))
          .filter(({ boosterId }) => !notHighlightedBoosters.includes(boosterId)),
      });
    };

    activeCard.addListener('onSucceeded', onSucceeded);
    activeCard.addListener('onFailed', onFailed);

    return () => {
      activeCard.removeListener('onSucceeded', onSucceeded);
      activeCard.removeListener('onFailed', onFailed);
    };
  }, [activeCard, player, isRoundBasedGame]);

  // Round based games: Clear highlight state on preparation phase
  useEffect(() => {
    if (!state || !isRoundBasedGame) {
      return;
    }

    if (roundState !== StreamStateRoundPhase.ROUND_PHASE_PREPARATION) {
      return;
    }

    setState(null);
  }, [state, roundState, isRoundBasedGame]);

  // Non Round based games: Clear highlight state after the highlight animation
  useEffect(() => {
    if (!state || isRoundBasedGame) {
      return;
    }

    timeoutRef.current = setTimeout(() => {
      setState(null);
    }, state.boosterAnimationTimings?.totalDuration || CARD_ROW_HIGHLIGHT_MINIMUM_DURATION);
  }, [state, isRoundBasedGame]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    highlightState: state,
  };
}
