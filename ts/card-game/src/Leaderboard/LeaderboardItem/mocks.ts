import { StoryHelpers } from '@noice-com/common-ui';

import { mockLeaderboardItem as mockLeaderboardItemFunc } from './mocks/story-mocks';

export interface MockProps {
  playerIds: string[];
}

export const mockLeaderboardItem = ({
  playerIds,
}: MockProps): StoryHelpers.Apollo.GraphqlMock[] => [mockLeaderboardItemFunc(playerIds)];
