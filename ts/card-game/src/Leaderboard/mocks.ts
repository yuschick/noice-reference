import { StoryHelpers } from '@noice-com/common-ui';

import { LeaderboardItemMockProps, mockLeaderboardItem } from './LeaderboardItem';

export const mockLeaderboard = (
  props: LeaderboardItemMockProps,
): StoryHelpers.Apollo.GraphqlMock[] => mockLeaderboardItem(props);
