import { StoryHelpers } from '@noice-com/common-ui';

import { PlayerScoreProfileDocument } from '@game-gen';

export const mockPlayerInfoProfile = (playerId = 'example-player') =>
  StoryHelpers.Apollo.createMock(
    PlayerScoreProfileDocument,
    { playerId },
    {
      profile: {
        __typename: 'ProfileProfile',
        ...StoryHelpers.getNewProfile(),
        userId: playerId,
      },
    },
    true,
  );

export const mockPlayerInfoProfileLoading = (playerId = 'example-player') =>
  StoryHelpers.Apollo.createDelayedMock(
    PlayerScoreProfileDocument,
    { playerId },
    null,
    1000000,
  );
