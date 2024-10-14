import { StoryHelpers } from '@noice-com/common-ui';

import { GameCardLevelSeasonDocument } from '@game-gen';
import { DEFAULT_SEASON_BADGE_URL, DEFAULT_SEASON_ID } from '@game-story-helpers';

export const mockGameCardLevel = (seasonId = DEFAULT_SEASON_ID) =>
  StoryHelpers.Apollo.createMock(
    GameCardLevelSeasonDocument,
    { seasonId },
    {
      season: {
        __typename: 'GameSeason',
        id: seasonId,
        badgeUrl: DEFAULT_SEASON_BADGE_URL,
      },
    },
    true,
  );
