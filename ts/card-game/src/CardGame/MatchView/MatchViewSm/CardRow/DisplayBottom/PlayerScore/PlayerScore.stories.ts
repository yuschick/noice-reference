import { StoryHelpers } from '@noice-com/common-ui';
import { Meta } from '@storybook/react';

import { mockPlayerScore } from './mocks';
import { PlayerScore } from './PlayerScore';

const LOCAL_USER_ID = 'me';

export default {
  title: 'MatchViewSm/Card Row/Player Score',
  component: PlayerScore,
  argTypes: {
    displayName: {
      name: 'Player Name',
      control: { type: 'text' },
    },
    score: {
      name: 'Player Score',
      control: { type: 'number', min: 0 },
    },
    showAvatar: {
      name: 'Show Avatar',
      control: { type: 'boolean' },
    },
    avatars: {
      name: 'Avatar URL',
      control: 'object',
    },
  },
  decorators: [StoryHelpers.withAuthProvider({ userId: LOCAL_USER_ID })],
  parameters: StoryHelpers.Apollo.addMocks(
    mockPlayerScore({
      playerId: LOCAL_USER_ID,
    }),
  ),
} as Meta<typeof PlayerScore>;

export const Default = {
  args: {
    playerId: LOCAL_USER_ID,
    score: 500,
  },
};
