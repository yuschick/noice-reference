import { StoryHelpers } from '@noice-com/common-ui';

import { AllOrNothingPendingCardDocument } from '@game-gen';
import { getNewGraphQLGameCard } from '@game-story-helpers';

export const mockAllOrNothingPending = (cardId: string) =>
  StoryHelpers.Apollo.createMock(
    AllOrNothingPendingCardDocument,
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
