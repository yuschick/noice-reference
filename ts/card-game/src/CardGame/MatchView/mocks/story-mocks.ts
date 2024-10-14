import { StoryHelpers } from '@noice-com/common-ui';

import { ProgressionPausedSeasonDocument } from '@game-gen';

export const mockProgressionIsPaused = (channelId: string) =>
  StoryHelpers.Apollo.createMock(
    ProgressionPausedSeasonDocument,
    { channelId },
    {
      channel: {
        __typename: 'ChannelChannel',
        id: channelId,
        game: {
          __typename: 'GameGame',
          id: 'fortnite',
          activeSeason: {
            __typename: 'GameSeason',
            id: 'season-1',
            progressionPaused: true,
            progressionPauseReason: 'Mocked reason',
          },
        },
      },
    },
  );
