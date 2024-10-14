import { StoryHelpers } from '@noice-com/common-ui';

import { CardWithHighlightStateCardDocument } from '@game-gen';
import { getNewGraphQLGameCard } from '@game-story-helpers';

export const mockCardWithHighlightState = (cardId: string) =>
  StoryHelpers.Apollo.createMock(
    CardWithHighlightStateCardDocument,
    { cardId },
    {
      gameCards: {
        __typename: 'GameCardBatchGetGameCardsResponse',
        cards: [
          {
            ...getNewGraphQLGameCard(),
            id: cardId,
          },
        ],
      },
    },
    true,
  );
