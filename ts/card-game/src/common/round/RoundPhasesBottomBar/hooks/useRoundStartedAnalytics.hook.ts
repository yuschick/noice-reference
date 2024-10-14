import { useAnalytics, useAuthenticatedUser } from '@noice-com/common-ui';
import { StreamStateRoundPhase } from '@noice-com/schemas/game-logic/game_logic.pb';
import { Nullable } from '@noice-com/utils';
import { useEffect } from 'react';

import { CardGameRoundPhasePreparation } from '@game-logic/game';
import { useStreamGame } from '@game-logic/game/context';
import { useIsRoundBasedGame } from '@game-logic/game/hooks';
import { GameTimer } from '@game-logic/timer';

export function useRoundStartedAnalytics(): void {
  const { userId: localPlayerId } = useAuthenticatedUser();
  const isRoundBasedGame = useIsRoundBasedGame();
  const { gameInstance, channelId, streamId } = useStreamGame();
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    if (!isRoundBasedGame || !gameInstance || !channelId || !streamId) {
      return;
    }

    let roundPreparationTimer: Nullable<GameTimer> = null;
    let countdownStartedMs: Nullable<number> = null;

    if (gameInstance.roundPhase === StreamStateRoundPhase.ROUND_PHASE_PREPARATION) {
      roundPreparationTimer = gameInstance.roundPhaseCountdown;
      countdownStartedMs = Date.now();
    }

    const handleRoundPreparation = ({
      roundStartsTimer,
    }: CardGameRoundPhasePreparation) => {
      roundPreparationTimer = roundStartsTimer;
      countdownStartedMs = Date.now();
    };

    const handleRoundStarted = () => {
      if (!roundPreparationTimer || !countdownStartedMs) {
        return;
      }

      const durationToStarted = Date.now() - countdownStartedMs;
      const countdownDiff = durationToStarted - roundPreparationTimer.duration;

      trackEvent({
        clientRoundStarted: {
          channelId,
          streamId,
          currentCardId: gameInstance.getPlayerActiveCard(localPlayerId)?.cardId ?? '',
          uiCountdownDurationMs: roundPreparationTimer.duration,
          uiCountdownStartedToRoundStartedDurationMs: durationToStarted,
          uiCountdownFinishedToRoundStartedDifferenceMs: countdownDiff,
          gameId: gameInstance?.getGameId(),
          roundNumber: gameInstance.roundNumber,
        },
      });
    };

    gameInstance.addListener('onRoundPhasePreparation', handleRoundPreparation);
    gameInstance.addListener('onRoundPhaseCompetition', handleRoundStarted);

    return () => {
      gameInstance.removeListener('onRoundPhasePreparation', handleRoundPreparation);
      gameInstance.removeListener('onRoundPhaseCompetition', handleRoundStarted);
    };
  }, [isRoundBasedGame, channelId, streamId, gameInstance, localPlayerId, trackEvent]);
}
