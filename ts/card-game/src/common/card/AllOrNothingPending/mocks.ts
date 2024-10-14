import { StoryHelpers } from '@noice-com/common-ui';

import { mockAllOrNothingPending as mockAllOrNothingPendingFunc } from './mocks/story-mocks';

import { mockGameCard } from '@game-card';

interface Props {
  cardId: string;
}

export const mockAllOrNothingPending = ({
  cardId,
}: Props): StoryHelpers.Apollo.GraphqlMock[] => [
  mockAllOrNothingPendingFunc(cardId),
  ...mockGameCard(),
];
