import { StoryHelpers } from '@noice-com/common-ui';

import { CardSelectSmCardsDocument } from '@game-gen';
import { getNewGraphQLGameCard } from '@game-story-helpers';

export const mockCardsData = (cardIds: string[]) =>
  StoryHelpers.Apollo.createMock(
    CardSelectSmCardsDocument,
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
