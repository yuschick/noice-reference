import { StoryHelpers } from '@noice-com/common-ui';
import { Player } from '@noice-com/schemas/game-logic/game_logic.pb';

import { MatchResultsSummaryPlayerScoresProfileDocument } from '@game-gen';

export const createMatchResultsSummaryPlayerScoresProfilesQueryMock = (
  players: Player[],
) => {
  return StoryHelpers.Apollo.createMock(
    MatchResultsSummaryPlayerScoresProfileDocument,
    {
      userIds: players.map((player) => player.userId),
    },
    {
      profileBatch: {
        __typename: 'ProfileBatchGetProfilesResponse',
        profiles: players.map((player) => {
          return {
            __typename: 'ProfileProfile',
            userId: player.userId,
            userTag: player.name,
            avatars: {
              __typename: 'ProfileProfileAvatars',
              avatar2D:
                'https://metalshockfinland.files.wordpress.com/2022/07/angus-mcsix.jpg',
            },
          };
        }),
      },
    },
  );
};
