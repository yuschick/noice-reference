import { StoryHelpers } from '@noice-com/common-ui';

import { CardSelectCardsDocument } from '@game-gen';
import { getNewGraphQLGameCard } from '@game-story-helpers';

export const mockCardSelectHand = (cardIds: string[]) =>
  StoryHelpers.Apollo.createMock(
    CardSelectCardsDocument,
    { cardIds },
    {
      gameCards: {
        __typename: 'GameCardBatchGetGameCardsResponse',
        cards: cardIds.map((cardId) => ({
          ...getNewGraphQLGameCard(),
          id: cardId,
        })),
      },
    },
    true,
  );
