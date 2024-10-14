import { StoryHelpers } from '@noice-com/common-ui';

import { PlayerActiveCardDocument } from '@game-gen';
import { GameCard, getNewGraphQLGameCard } from '@game-story-helpers';

export interface MockPlayerActiveCardProps {
  cardId: string;
  cardData?: Partial<GameCard>;
}

export const mockPlayerActiveCard = ({ cardId, cardData }: MockPlayerActiveCardProps) =>
  StoryHelpers.Apollo.createMock(
    PlayerActiveCardDocument,
    { cardId },
    {
      gameCards: {
        __typename: 'GameCardBatchGetGameCardsResponse',
        cards: [
          {
            ...getNewGraphQLGameCard(),
            ...(cardData ?? {}),
            id: cardId,
          },
        ],
      },
    },
    true,
  );
