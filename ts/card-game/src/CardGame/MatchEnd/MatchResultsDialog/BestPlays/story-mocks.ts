import { StoryHelpers } from '@noice-com/common-ui';
import { Player } from '@noice-com/schemas/game-logic/game_logic.pb';

import {
  GameCardFragment,
  MatchResultsDialogBestPlayGameCardsDocument,
  MatchResultsDialogBestPlayProfilesDocument,
} from '@game-gen';
import { getNewGraphQLGameCard } from '@game-story-helpers';

export const createMatchResultsDialogBestPlaysProfilesQueryMock = (players: Player[]) => {
  return StoryHelpers.Apollo.createMock(
    MatchResultsDialogBestPlayProfilesDocument,
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
            },
          };
        }),
      },
    },
  );
};

export const createMatchResultsDialogBestPlaysGameCardsQueryMock = (
  players: Player[],
) => {
  return StoryHelpers.Apollo.createMock(
    MatchResultsDialogBestPlayGameCardsDocument,
    {
      cardIds: players.reduce<string[]>(
        (prev, player) =>
          player.bestPlay?.cardId ? [...prev, player.bestPlay.cardId] : prev,
        [],
      ),
    },
    {
      gameCards: {
        __typename: 'GameCardBatchGetGameCardsResponse',
        cards: players.reduce<GameCardFragment[]>((prev, player) => {
          if (!player.bestPlay?.cardId) {
            return prev;
          }

          return [
            ...prev,
            {
              ...getNewGraphQLGameCard(),
              id: player.bestPlay.cardId,
              // @todo Streamer card support
            },
          ];
        }, []),
      },
    },
  );
};
