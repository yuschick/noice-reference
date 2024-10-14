import { StoryHelpers } from '@noice-com/common-ui';

// Using direct path to avoid circular dependency
// eslint-disable-next-line import/no-restricted-paths
import { getNewBooster } from '../../../story-helpers/data/booster-data';
// eslint-disable-next-line import/no-restricted-paths
import { getNewGraphQLGameCard } from '../../../story-helpers/data/card-data';

import { GameStateBoostersDocument } from '@game-gen';

export const mockGameStateBoosters = (id: number, repeatMockResponse?: boolean) =>
  StoryHelpers.Apollo.createMock(
    GameStateBoostersDocument,
    { id },
    {
      booster: {
        ...getNewBooster(),
        id,
      },
    },
    repeatMockResponse,
  );

export const mockGameStateGameCard = (cardId: string, repeatMockResponse?: boolean) =>
  StoryHelpers.Apollo.createMock(
    GameStateBoostersDocument,
    { ids: [cardId] },
    {
      gameCards: {
        cards: [
          {
            ...getNewGraphQLGameCard(),
            activeStreamerCard: null,
            id: cardId,
          },
        ],
      },
    },
    repeatMockResponse,
  );
