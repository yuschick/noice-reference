import { StoryHelpers } from '@noice-com/common-ui';
import { Meta } from '@storybook/react';

import { PlayerScore } from './PlayerScore';

const LOCAL_USER_ID = 'me';

export default {
  title: 'MatchViewLg/Card Row/Player Score',
  component: PlayerScore,
  decorators: [StoryHelpers.withAuthProvider({ userId: LOCAL_USER_ID })],
} as Meta<typeof PlayerScore>;

export const Default = {
  args: {
    player: {
      ...StoryHelpers.getNewProfile(),
      userId: LOCAL_USER_ID,
    },
    score: 500,
  },
};
