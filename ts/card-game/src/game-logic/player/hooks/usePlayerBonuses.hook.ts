import { SetTimeoutId } from '@noice-com/common-ui';
import {
  MatchBonusReceivedMsg,
  MatchBonusType,
} from '@noice-com/schemas/game-logic/game_logic.pb';
import { Nullable } from '@noice-com/utils';
import { useEffect, useState } from 'react';

import { useCardGamePlayer } from './useCardGamePlayer.hook';

interface HookResult {
  gameEventBonusPoints: Nullable<number>;
}

export function usePlayerBonuses(playerId: string): HookResult {
  const [gameEventBonusPoints, setGameEventBonusPoints] =
    useState<Nullable<number>>(null);
  const player = useCardGamePlayer(playerId);

  useEffect(() => {
    if (!player) {
      return;
    }

    let timeout: SetTimeoutId;

    const onMatchBonusReceived = (msg: MatchBonusReceivedMsg) => {
      if (!msg.points) {
        return;
      }

      if (msg.bonusType !== MatchBonusType.MATCH_BONUS_TYPE_VICTORY_ROYAL) {
        return;
      }

      setGameEventBonusPoints(msg.points);

      // clear the bonus points after a short delay
      timeout = setTimeout(() => setGameEventBonusPoints(null), 5000);
    };

    player.addListener('onMatchBonusReceived', onMatchBonusReceived);

    return () => {
      player.removeListener('onMatchBonusReceived', onMatchBonusReceived);
      clearTimeout(timeout);
    };
  }, [player, playerId]);

  return {
    gameEventBonusPoints,
  };
}
