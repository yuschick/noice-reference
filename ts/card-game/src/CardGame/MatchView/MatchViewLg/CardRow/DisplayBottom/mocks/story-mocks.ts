import { StoryHelpers } from '@noice-com/common-ui';

import { DisplayBottomLgPlayerDocument } from '@game-gen';

export const mockDisplayBottomProfile = (playerId = 'example-player') =>
  StoryHelpers.Apollo.createMock(
    DisplayBottomLgPlayerDocument,
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

export const mockDisplayBottomProfileLoading = (playerId = 'example-player') =>
  StoryHelpers.Apollo.createDelayedMock(
    DisplayBottomLgPlayerDocument,
    { playerId },
    null,
    1000000,
  );
