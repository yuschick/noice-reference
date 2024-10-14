import { StoryHelpers } from '@noice-com/common-ui';

import { MatchResultsDialogRewardsGameDocument } from '@game-gen';

export const createMatchResultsDialogRewardsGameQueryMock = (gameId: string) => {
  return StoryHelpers.Apollo.createMock(
    MatchResultsDialogRewardsGameDocument,
    {
      gameId,
      userId: 'me',
    },
    {
      game: {
        __typename: 'GameGame',
        id: gameId,
        name: 'apex legends',
        activeSeason: {
          __typename: 'GameSeason',
          id: 'temp-season-id-1',
          name: 'beta season 7',
          progression: {
            __typename: 'ProgressionSeasonProgression',
            level: 67,
          },
        },
      },
    },
  );
};
