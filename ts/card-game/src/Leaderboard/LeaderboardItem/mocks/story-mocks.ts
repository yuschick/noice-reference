import { StoryHelpers } from '@noice-com/common-ui';

import { LeaderboardItemPlayersDocument } from '@game-gen';

export const mockLeaderboardItem = (playerIds: string[]) =>
  StoryHelpers.Apollo.createMock(
    LeaderboardItemPlayersDocument,
    { playerIds },
    {
      profileBatch: {
        __typename: 'ProfileBatchGetProfilesResponse',
        profiles: playerIds.map((userId) => ({
          __typename: 'ProfileProfile',
          ...StoryHelpers.getNewProfile(),
          userId,
        })),
      },
    },
    true,
  );
