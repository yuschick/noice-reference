import { StoryHelpers } from '@noice-com/common-ui';

import { ImplicitAccountGameBanner } from './ImplicitAccountGameBanner';

import { ImplicitAccountGameBannerRankDocument } from '@gen';

const GAME_ID = 'game-id';
const USER_ID = 'me';

export default {
  title: 'ImplicitAccountGameBanner',
  component: ImplicitAccountGameBanner,
  parameters: StoryHelpers.Apollo.addMocks([
    StoryHelpers.Apollo.createMock(
      ImplicitAccountGameBannerRankDocument,
      {
        userId: USER_ID,
      },
      {
        profile: {
          userId: USER_ID,
          playedGames: [
            {
              userId: USER_ID,
              id: 'played-game-id',
              game: {
                __typename: 'GameGame',
                id: GAME_ID,
                name: 'Superior Game',
                activeSeason: {
                  name: 'Season 1',
                  id: 'season-id',
                  progression: {
                    seasonId: 'season-id',
                    xpAmount: 1000,
                    level: 50,
                    nextLevelThreshold: 2000,
                    nextLevel: 51,
                  },
                },
              },
            },
          ],
        },
      },
    ),
  ]),
};

export const Default = {
  args: {
    gameId: GAME_ID,
  },
};
