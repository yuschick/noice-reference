import { StoryHelpers } from '@noice-com/common-ui';

import { SwitchOutCardDetailsDocument } from '@game-gen';
import { getNewGraphQLGameCard } from '@game-story-helpers';

export const mockSwitchOutCardDetails = (activeCardId: string) =>
  StoryHelpers.Apollo.createMock(
    SwitchOutCardDetailsDocument,
    { activeCardId },
    {
      gameCards: {
        __typename: 'GameCardBatchGetGameCardsResponse',
        cards: [
          {
            ...getNewGraphQLGameCard(),
            id: activeCardId,
            activeStreamerCard: null,
          },
        ],
      },
    },
  );
