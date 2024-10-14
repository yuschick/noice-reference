import { StoryHelpers } from '@noice-com/common-ui';

import { AllOrNothingDialogCardDocument } from '@game-gen';
import { getNewGraphQLGameCard } from '@game-story-helpers';

export const mockAllOrNothing = (cardId: string) =>
  StoryHelpers.Apollo.createMock(
    AllOrNothingDialogCardDocument,
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
