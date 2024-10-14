import { useCallback, useEffect, useState } from 'react';

import { CGPlayerOnHandShuffled, CGPlayerOnHandUpdated } from '../types';

import { useCardGamePlayer } from './useCardGamePlayer.hook';

interface HookResult {
  initialLoading: boolean;
  availableCards: string[];
  availableMatchCards: string[];
  disabledCards: string[];
  requestHand(): Promise<void>;
  shuffleHand(): Promise<void>;
}

export function usePlayerHand(playerId: string): HookResult {
  const [initialLoading, setInitialLoading] = useState(false);

  const player = useCardGamePlayer(playerId);
  const [availableCards, setAvailableCards] = useState(player?.currentHand ?? []);
  const [availableMatchCards, setAvailableMatchCards] = useState(
    player?.availableMatchCards ?? [],
  );
  const [disabledCards, setDisabledCards] = useState<string[]>(
    player?.disabledCards ?? [],
  );

  useEffect(() => {
    const onShuffled = ({ cardIds, matchCardIds }: CGPlayerOnHandShuffled) => {
      setAvailableCards(cardIds);
      setAvailableMatchCards(matchCardIds);
    };

    player?.addListener('onHandShuffled', onShuffled);

    return () => {
      player?.removeListener('onHandShuffled', onShuffled);
    };
  }, [player]);

  useEffect(() => {
    const onHandUpdated = ({ disabledCardIds }: CGPlayerOnHandUpdated) => {
      setDisabledCards(disabledCardIds);
    };

    player?.addListener('onHandUpdated', onHandUpdated);

    return () => {
      player?.removeListener('onHandUpdated', onHandUpdated);
    };
  }, [player]);

  // Initial hand request loading done
  useEffect(() => {
    if (!availableCards.length) {
      return;
    }

    setInitialLoading(false);
  }, [availableCards]);

  const requestHand = useCallback(async () => {
    if (!player) {
      throw new Error("Trying to request hand when player doesn't exist");
    }

    // If player has no cards, we need to show loading state
    if (player.currentHand.length === 0) {
      setInitialLoading(true);
    }

    await player.requestHand();
  }, [player]);

  const shuffleHand = useCallback(async () => {
    if (!player) {
      throw new Error("Trying to shuffle hand when player doesn't exist");
    }

    await player.requestHand(true);
  }, [player]);

  return {
    initialLoading,
    availableCards,
    availableMatchCards,
    disabledCards,
    requestHand,
    shuffleHand,
  };
}
