import { StoryHelpers } from '@noice-com/common-ui';

import { CardSelectMatchCardsDocument } from '@game-gen';
import { getNewGraphQLGameCard } from '@game-story-helpers';

export const mockMatchCards = (cardIds: string[]) =>
  StoryHelpers.Apollo.createMock(
    CardSelectMatchCardsDocument,
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
