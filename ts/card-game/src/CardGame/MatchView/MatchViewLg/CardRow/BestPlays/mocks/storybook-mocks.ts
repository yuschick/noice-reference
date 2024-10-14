import { StoryHelpers } from '@noice-com/common-ui';

import { BestPlaysDataDocument } from '@game-gen';
import { getNewGraphQLGameCard } from '@game-story-helpers';

export const createBestPlaysDataQueryMock = (userIds: string[], cardIds: string[]) =>
  StoryHelpers.Apollo.createMock(
    BestPlaysDataDocument,
    { userIds, cardIds },
    {
      gameCards: {
        __typename: 'GameCardBatchGetGameCardsResponse',
        cards: cardIds.map((cardId) => ({
          ...getNewGraphQLGameCard(),
          id: cardId,
        })),
      },
      profileBatch: {
        __typename: 'ProfileBatchGetProfilesResponse',
        profiles: userIds.map((userId) => ({
          __typename: 'ProfileProfile',
          userId,
          displayName: `Resource_${userId}`,
          userTag: `Player_${userId}`,
          avatars: {
            __typename: 'ProfileProfileAvatars',
            avatarFullbody:
              'https://storage.googleapis.com/noice-client-assets-a0767e54/proto/noice-avatars/BasicSets_0.0.0.4/Basic01-Set-Female_Body-fs8.png',
          },
        })),
      },
    },
  );
