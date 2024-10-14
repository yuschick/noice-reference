import { StoryHelpers } from '@noice-com/common-ui';
import { Player } from '@noice-com/schemas/game-logic/game_logic.pb';

import { MatchResultsDialogPlayerScoresProfileDocument } from '@game-gen';

export const createMatchResultsDialogPlayerScoresProfilesQueryMock = (
  players: Player[],
) => {
  return StoryHelpers.Apollo.createMock(
    MatchResultsDialogPlayerScoresProfileDocument,
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
                'https://media-cdn.gcp.prd.noice.com/avatar/image_face_img/de2c7f5f-4d8a-505b-bfe4-6c12178a2f90/aa29576f-9671-4486-9487-3f38cd4d2a97.png',
              avatarFullbody:
                'https://media-cdn.gcp.prd.noice.com/avatar/image_body_img/8f307fd5-df09-5ce9-be29-b5dca2590be0/cad30a5f-c05c-45f3-9dfc-430e41dd7b15.png',
            },
          };
        }),
      },
    },
  );
};
