import { StoryHelpers } from '@noice-com/common-ui';

import { createHighScoringCardDataMock } from './mocks/storybook-mocks';

import { mockGameCard } from '@game-card';

interface Props {
  cardId: string;
  playerId: string;
  isStreamerCard?: boolean;
}

export const mockHighScoringCard = ({
  cardId,
  playerId,
  isStreamerCard,
}: Props): StoryHelpers.Apollo.GraphqlMock[] => [
  createHighScoringCardDataMock(cardId, playerId, isStreamerCard),
  ...mockGameCard(),
];
