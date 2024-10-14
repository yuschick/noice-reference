import { useCardGamePlayer } from '@noice-com/card-game';
import { useAuthenticatedUser } from '@noice-com/common-ui';
import { useState, useEffect } from 'react';

import { useStreamGame } from '@common/stream';
import { MicroSurveyEvent, useMicroSurveys } from '@context';

interface HookResult {
  amount: number;
}

export function useCardsPlayed({ gameName }: { gameName?: string }): HookResult {
  const { gameInstance } = useStreamGame();
  const { userId } = useAuthenticatedUser();
  const player = useCardGamePlayer(userId);
  const [amount, setAmount] = useState(0);
  const { sendEvent } = useMicroSurveys();

  useEffect(() => {
    if (!gameInstance || !player) {
      return;
    }

    const reset = () => {
      setAmount(0);
    };

    const updateAmount = ({ cardId }: { cardId: string }) => {
      sendEvent(MicroSurveyEvent.UserSelectedCard, {
        cardId,
        cardsPlayedInMatch: amount + 1,
        ...(gameName ? { gamePlayedInMatch: gameName } : {}),
      });
      setAmount((prev) => prev + 1);
    };

    player.addListener('onCardSelected', updateAmount);
    gameInstance.addListener('onMatchStarted', reset);

    return () => {
      player.removeListener('onCardSelected', updateAmount);
      gameInstance.removeListener('onMatchStarted', reset);
    };
  }, [amount, gameInstance, gameName, player, sendEvent]);

  return {
    amount,
  };
}
