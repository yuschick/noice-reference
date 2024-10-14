import { SetTimeoutId } from '@noice-com/common-ui';
import {
  MatchBonusType,
  StreamStateMatchState,
} from '@noice-com/schemas/game-logic/game_logic.pb';
import { useEffect, useRef, useState } from 'react';

import { CardGameOnMatchBonusReceived } from '@game-logic/game';
import { useStreamGame } from '@game-logic/game/context';

export function useMatchState(): StreamStateMatchState {
  const { gameInstance } = useStreamGame();

  const [matchState, setMatchState] = useState<StreamStateMatchState>(
    () => gameInstance?.matchState ?? StreamStateMatchState.MATCH_STATE_UNSPECIFIED,
  );
  // If any of the users have Victory Royale Bonus, we have to delay the match end to
  // allow the users to see them. Victory Royale displays are NOT here, they exist
  // in player displays, because they have to be seen in place of the cards.
  const matchEndDelayRef = useRef(0);

  useEffect(() => {
    if (!gameInstance) {
      return;
    }

    const onMatchBonusReceived = ({
      points,
      bonusType,
    }: CardGameOnMatchBonusReceived) => {
      if (!points) {
        return;
      }

      if (bonusType !== MatchBonusType.MATCH_BONUS_TYPE_VICTORY_ROYAL) {
        return;
      }

      // If someone got a victory royale bonus, delay the matchend for this amount
      // because the card game is showing the victory royale bonus for this duration
      // REMOVE THIS at some point, very ugly hack
      matchEndDelayRef.current = 2250;
    };

    let timeout: SetTimeoutId;
    const onMatchEnded = () => {
      timeout = setTimeout(
        () => setMatchState(gameInstance.matchState),
        matchEndDelayRef.current,
      );
    };

    const handleMatchStateChange = () => setMatchState(gameInstance.matchState);

    handleMatchStateChange();

    gameInstance.addListener('onGameInit', handleMatchStateChange);
    gameInstance.addListener('onMatchStarted', handleMatchStateChange);
    gameInstance.addListener('onMatchEnded', onMatchEnded);
    gameInstance.addListener('onMatchPauseStateChanged', handleMatchStateChange);
    gameInstance.addListener('onMatchPauseStateChanged', handleMatchStateChange);
    gameInstance.addListener('onMatchBonusReceived', onMatchBonusReceived);

    return () => {
      gameInstance.removeListener('onGameInit', handleMatchStateChange);
      gameInstance.removeListener('onMatchStarted', handleMatchStateChange);
      gameInstance.removeListener('onMatchEnded', onMatchEnded);
      gameInstance.removeListener('onMatchPauseStateChanged', handleMatchStateChange);
      gameInstance.removeListener('onMatchPauseStateChanged', handleMatchStateChange);
      gameInstance.removeListener('onMatchBonusReceived', onMatchBonusReceived);
      clearTimeout(timeout);
    };
  }, [gameInstance]);

  return matchState;
}
