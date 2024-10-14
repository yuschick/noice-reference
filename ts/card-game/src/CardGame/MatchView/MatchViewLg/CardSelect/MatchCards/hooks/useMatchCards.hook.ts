import { gql } from '@apollo/client';
import { useAuthenticatedUser } from '@noice-com/common-ui';
import { useEffect } from 'react';

import { GameCardFragment, useCardSelectMatchCardsQuery } from '@game-gen';
import { usePlayerHand } from '@game-logic/player/hooks';

gql`
  query CardSelectMatchCards($cardIds: [String!]!) {
    gameCards(cardIds: $cardIds) {
      cards {
        ...GameCard
      }
    }
  }
`;

interface HookResult {
  matchCards: GameCardFragment[];
  disabledCards: string[];
}

export function useMatchCards(onMatchCardToggle: (show: boolean) => void): HookResult {
  const { userId } = useAuthenticatedUser();
  const { availableMatchCards, disabledCards } = usePlayerHand(userId);

  const { data: cardSelectMatchCards } = useCardSelectMatchCardsQuery({
    variables: {
      cardIds: availableMatchCards,
    },
    skip: availableMatchCards.length === 0,
  });

  useEffect(() => {
    if (cardSelectMatchCards?.gameCards?.cards?.length) {
      return;
    }

    onMatchCardToggle(false);
  }, [cardSelectMatchCards?.gameCards?.cards?.length, onMatchCardToggle]);

  return {
    matchCards: cardSelectMatchCards?.gameCards?.cards ?? [],
    disabledCards,
  };
}
