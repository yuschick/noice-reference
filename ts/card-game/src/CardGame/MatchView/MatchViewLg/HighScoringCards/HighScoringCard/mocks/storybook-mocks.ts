import { StoryHelpers } from '@noice-com/common-ui';

import { HighScoringCardDataDocument, RarityRarity } from '@game-gen';
import { makeGraphQLStreamerCard, getNewGraphQLGameCard } from '@game-story-helpers';

export const createHighScoringCardDataMock = (
  cardId = 'example-card',
  playerId = 'example-player',
  isStreamerCard = false,
) =>
  StoryHelpers.Apollo.createMock(
    HighScoringCardDataDocument,
    { playerId, cardId },
    {
      gameCards: {
        __typename: 'GameCardBatchGetGameCardsResponse',
        cards: [
          {
            ...getNewGraphQLGameCard(),
            activeStreamerCard: isStreamerCard
              ? makeGraphQLStreamerCard(
                  1,
                  cardId,
                  'test-family-1',
                  1,
                  RarityRarity.RarityCommon,
                  'Headshot!',
                  'Kill with headshot',
                  `${NOICE.CDN_URL}/card-hero-art/apex_legends/season_zero/heavy_score.png`,
                )
              : null,
            id: cardId,
          },
        ],
      },
      profile: {
        __typename: 'ProfileProfile',
        ...StoryHelpers.getNewProfile(),
        userId: playerId,
      },
    },
  );
