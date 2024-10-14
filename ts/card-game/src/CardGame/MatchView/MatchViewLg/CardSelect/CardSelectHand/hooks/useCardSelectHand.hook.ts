import { gql } from '@apollo/client';
import { useAuthenticatedUser } from '@noice-com/common-ui';
import { useEffect, useMemo } from 'react';

import { usePlaySound } from '@game-common/sound/hooks';
import { CARD_DEALING_ANIMATION_DURATION_PER_CARD } from '@game-constants';
import { useCardGameUIState } from '@game-context';
import { GameCardFragment, useCardSelectCardsQuery } from '@game-gen';
import { usePlayerHand } from '@game-logic/player/hooks';
import { GameSoundKeys } from '@game-types';

gql`
  query CardSelectCards($cardIds: [String!]!) {
    gameCards(cardIds: $cardIds) {
      cards {
        ...GameCard
      }
    }
  }
`;

interface HookResult {
  cards: GameCardFragment[];
  disabledCards: string[];
  loading: boolean;
}

export function useCardSelectHand(): HookResult {
  const { isCardSelectOpen } = useCardGameUIState();
  const { userId } = useAuthenticatedUser();
  const { availableCards, disabledCards, initialLoading, requestHand } =
    usePlayerHand(userId);

  useEffect(() => {
    // Fetch hand only in when card select is open
    if (!isCardSelectOpen) {
      return;
    }

    requestHand();
  }, [requestHand, isCardSelectOpen]);

  const {
    data,
    previousData,
    loading: dataLoading,
  } = useCardSelectCardsQuery({
    variables: {
      cardIds: availableCards,
    },
    skip: availableCards.length === 0,
  });

  // We want to show the previous hand until the new hand has been fetched in reshuffle
  // scenario. The data is undefined between queries.
  const cards = useMemo(
    () => data?.gameCards?.cards ?? previousData?.gameCards?.cards ?? [],
    [data, previousData],
  );

  const [playDealingCards] = usePlaySound(GameSoundKeys.DealingCards);

  useEffect(() => {
    cards.forEach((_card, i) =>
      setTimeout(playDealingCards, (i + 1) * CARD_DEALING_ANIMATION_DURATION_PER_CARD),
    );
  }, [playDealingCards, cards]);

  return {
    cards,
    disabledCards,
    loading: initialLoading || dataLoading,
  };
}
