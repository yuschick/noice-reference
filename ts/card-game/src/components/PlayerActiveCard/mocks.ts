import { StoryHelpers } from '@noice-com/common-ui';

import {
  MockPlayerActiveCardProps,
  mockPlayerActiveCard as mockActiveCard,
} from './mocks/story-mocks';

import { mockGameCard } from '@game-card';

export const mockPlayerActiveCard = ({
  cardId,
  cardData,
}: MockPlayerActiveCardProps): StoryHelpers.Apollo.GraphqlMock[] => [
  mockActiveCard({ cardId, cardData }),
  ...mockGameCard(),
];
