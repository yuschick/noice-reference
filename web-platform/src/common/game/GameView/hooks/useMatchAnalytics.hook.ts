import { useAnalytics } from '@noice-com/common-ui';
import { StreamStateMatchState } from '@noice-com/schemas/game-logic/game_logic.pb';
import { useCallback, useEffect } from 'react';

import { useStreamGame } from '@common/stream';

let hasSendMatchStartedEvent = false;

export function useMatchAnalytics() {
  const { trackEvent } = useAnalytics();
  const { gameInstance, streamId, matchGroupId, channelId } = useStreamGame();

  const sendMatchStartedEvent = useCallback(() => {
    if (hasSendMatchStartedEvent) {
      return;
    }

    hasSendMatchStartedEvent = true;

    trackEvent({
      clientFirstMatchStart: {
        streamId: streamId || '',
        matchGroupId: matchGroupId || '',
        channelId: channelId || '',
      },
    });
  }, [trackEvent, streamId, matchGroupId, channelId]);

  useEffect(() => {
    if (gameInstance?.matchState === StreamStateMatchState.MATCH_STATE_ACTIVE) {
      sendMatchStartedEvent();
    }

    gameInstance?.addListener('onMatchStarted', sendMatchStartedEvent);
    return () => {
      gameInstance?.removeListener('onMatchStarted', sendMatchStartedEvent);
    };
  }, [gameInstance, sendMatchStartedEvent]);
}
