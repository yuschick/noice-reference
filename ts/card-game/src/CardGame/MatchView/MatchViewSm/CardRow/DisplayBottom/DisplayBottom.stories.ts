import { StoryHelpers } from '@noice-com/common-ui';
import { Meta } from '@storybook/react';

import { DisplayBottom } from './DisplayBottom';
import { mockDisplayBottom } from './mocks';

import { withGameState } from '@game-story-helpers';

const playerProfile = StoryHelpers.getNewProfile();

export default {
  title: 'MatchViewSm/Card Row/Display Bottom',
  component: DisplayBottom,
  argTypes: {
    playerId: {
      name: 'Player ID',
      control: { type: 'text' },
    },
    size: {
      name: 'size',
      control: 'select',
      options: ['small', 'xsmall'],
    },
    isMe: {
      name: 'Is Local Player',
      control: { type: 'boolean' },
    },
    cardHovered: {
      name: 'Card Hovered',
      control: { type: 'boolean' },
    },
  },
  decorators: [
    withGameState(),
    StoryHelpers.withAuthProvider({ userId: playerProfile.userId }),
  ],
} as Meta<typeof DisplayBottom>;

export const Default = {
  args: {
    playerId: playerProfile.userId,
  },
  parameters: StoryHelpers.Apollo.addMocks(
    mockDisplayBottom({
      playerId: playerProfile.userId,
    }),
  ),
};

export const Loading = {
  args: {
    playerId: playerProfile.userId,
  },
  parameters: StoryHelpers.Apollo.addMocks(
    mockDisplayBottom({
      playerId: playerProfile.userId,
      loading: true,
    }),
  ),
};
