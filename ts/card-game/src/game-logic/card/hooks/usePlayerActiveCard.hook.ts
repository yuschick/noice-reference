import { useConversionEvents } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import { useEffect, useState } from 'react';

import { useCardGameState } from '../../game/context';
import { useCardGamePlayer } from '../../player/hooks';
import type { CGActiveCard } from '../CGActiveCard';
import { CGActiveCardOnSucceeded } from '../types';

/**
 * Provides the current active card (if any) for the given player.
 * Automatically updates if it changes.
 *
 * @param playerId The player ID.
 * @returns The current active card or null.
 */
export function usePlayerActiveCard(playerId: string): Nullable<CGActiveCard> {
  const gameState = useCardGameState();
  const player = useCardGamePlayer(playerId);
  const { sendGameCardScoredConversionEvent } = useConversionEvents();

  const [currentCard, setCurrentCard] = useState<Nullable<CGActiveCard>>(null);

  // Subscribe for changes.
  useEffect(() => {
    if (!currentCard) {
      return;
    }

    const onCardSucceeded = (data: CGActiveCardOnSucceeded) => {
      if (data?.pointsTotal > 0) {
        sendGameCardScoredConversionEvent({ pointsTotal: data.pointsTotal });
      }
      setCurrentCard(null);
    };

    const onCardFailed = () => {
      setCurrentCard(null);
    };

    // @todo: This should likely be changed in the future so we expose card info
    // as we react to these specific events.
    currentCard.addListener('onSucceeded', onCardSucceeded);
    currentCard.addListener('onFailed', onCardFailed);

    return () => {
      currentCard.removeListener('onSucceeded', onCardSucceeded);
      currentCard.removeListener('onFailed', onCardFailed);
    };
  }, [currentCard, sendGameCardScoredConversionEvent]);

  // Make sure we handle if the playerId changes.
  useEffect(() => {
    if (!player) {
      return;
    }

    const playerCard = gameState?.getPlayerActiveCard(player.playerID) ?? null;
    setCurrentCard(playerCard);

    const onCardChanged = () => {
      setCurrentCard(gameState?.getPlayerActiveCard(player.playerID) ?? null);
    };

    player.addListener('onCardSelected', onCardChanged);

    return () => {
      player.removeListener('onCardSelected', onCardChanged);
    };
  }, [player, gameState]);

  return currentCard;
}
