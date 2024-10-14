import { StoryHelpers } from '@noice-com/common-ui';

import { GameCardBackgroundArtSeasonDocument } from '@game-gen';
import { cardBackgroundUrls, DEFAULT_SEASON_ID } from '@game-story-helpers';

export const mockGameCardBackroundArt = (seasonId = DEFAULT_SEASON_ID) =>
  StoryHelpers.Apollo.createMock(
    GameCardBackgroundArtSeasonDocument,
    { seasonId },
    {
      season: {
        __typename: 'GameSeason',
        id: seasonId,
        cardBackgroundUrls,
      },
    },
    true,
  );
