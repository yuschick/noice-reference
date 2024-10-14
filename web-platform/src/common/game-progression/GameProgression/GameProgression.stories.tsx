import { GameProgression } from '@common/game-progression';

export default {
  title: 'GameProgression',
  component: GameProgression,
};
export const Default = {
  args: {
    progression: {
      name: 'Fortnite',
      activeSeason: {
        progression: {
          seasonId: 'fortnite',
          xpAmount: 1000,
          level: 50,
          nextLevelThreshold: 1500,
          nextLevel: 11,
        },
      },
    },
  },
};

export const Loading = () => <GameProgression.Loading />;
