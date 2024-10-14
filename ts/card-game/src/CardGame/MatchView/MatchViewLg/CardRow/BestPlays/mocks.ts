import { StoryHelpers } from '@noice-com/common-ui';

import { createBestPlaysDataQueryMock } from './mocks/storybook-mocks';

import { mockGameCard } from '@game-card';

interface Props {
  cardIds: string[];
  userIds: string[];
}

export const mockBestPlays = ({
  cardIds,
  userIds,
}: Props): StoryHelpers.Apollo.GraphqlMock[] => [
  createBestPlaysDataQueryMock(userIds, cardIds),
  ...mockGameCard(),
];
