import { useAnalytics } from '@noice-com/common-ui';
import { useCallback, useEffect, useState } from 'react';

import { useCardGameAPIInternal } from '@game-context';
import { useStreamGame } from '@game-logic/game/context';
import { useMatchStarted } from '@game-logic/game/hooks';

interface Props {
  showMatchEnd?: boolean;
  hideContent?: boolean;
}

interface HookResult {
  showMatchEnd: boolean;
  showMatchEndCompleted: boolean;
  onMatchEndCompleted: () => void;
}

export function useShowMatchEnd({ showMatchEnd, hideContent }: Props): HookResult {
  const [matchEndOngoing, setMatchEndOngoing] = useState(false);
  const [matchEndCompleted, setMatchEndCompleted] = useState(false);
  const { trackEvent } = useAnalytics();
  const { emitAPIEvent } = useCardGameAPIInternal();

  const reset = useCallback(() => {
    setMatchEndOngoing(false);
    setMatchEndCompleted(false);
  }, []);

  const { gameInstance } = useStreamGame();

  // Start to show match end sequence
  useEffect(() => {
    if (matchEndCompleted) {
      return;
    }

    if (!showMatchEnd) {
      return;
    }

    setMatchEndOngoing(true);
    setMatchEndCompleted(false);
    gameInstance?.setCinematicActive(true);
  }, [showMatchEnd, matchEndCompleted, gameInstance]);

  useMatchStarted(reset);

  const onMatchEndCompleted = useCallback(() => {
    setMatchEndOngoing(false);
    setMatchEndCompleted(true);
    trackEvent({
      clientMatchEndSequenceCompleted: {
        hideContent: hideContent ?? false,
      },
    });
    gameInstance?.setCinematicActive(false);
    emitAPIEvent('onMatchEndSequenceCompleted');
  }, [emitAPIEvent, gameInstance, hideContent, trackEvent]);

  // Reset match end sequence in case of content is hidden
  useEffect(() => {
    if (!hideContent) {
      return;
    }

    if (!matchEndOngoing) {
      return;
    }

    onMatchEndCompleted();
  }, [hideContent, matchEndOngoing, onMatchEndCompleted]);

  return {
    showMatchEnd: !gameInstance?.matchRunning && matchEndOngoing && !matchEndCompleted,
    showMatchEndCompleted: matchEndCompleted,
    onMatchEndCompleted,
  };
}
