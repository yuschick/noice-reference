import { StoryHelpers } from '@noice-com/common-ui';

import { SpectatorPlayerDisplayProfileDocument } from '@game-gen';

export const getPlayerDisplayMock = (playerId = 'example-player') =>
  StoryHelpers.Apollo.createMock(
    SpectatorPlayerDisplayProfileDocument,
    { id: playerId },
    {
      profile: {
        __typename: 'ProfileProfile',
        userId: playerId,
        displayName: 'bengsfort',
        avatars: {
          avatar2D:
            'https://storage.googleapis.com/noice-client-assets-a0767e54/proto/noice-avatars/BasicSets_0.0.0.4/Basic01-Set-Female_Face-fs8.png',
        },
      },
    },
  );

export const loadingPlayerDisplayMock = StoryHelpers.Apollo.createDelayedMock(
  SpectatorPlayerDisplayProfileDocument,
  { id: 'example-player' },
  null,
  1000000,
);
