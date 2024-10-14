import { StoryHelpers } from '@noice-com/common-ui';
import { MockMatchGroup } from '@noice-com/platform-client/src/testing';
import { Meta } from '@storybook/react';

import { SpectatorDisplayBottom } from './SpectatorDisplayBottom';

import { withGameState } from '@game-story-helpers';

const PLAYER_ID = 'example-player';
const mockMatchGroup = new MockMatchGroup('test-group', PLAYER_ID);

export default {
  title: 'MatchViewLg/Spectator Card Row/Spectator Display Bottom',
  component: SpectatorDisplayBottom,
  decorators: [
    withGameState(mockMatchGroup, {
      matchStateData: {
        players: [
          {
            userId: PLAYER_ID,
            points: 300,
          },
        ],
      },
    }),
  ],
} as Meta<typeof SpectatorDisplayBottom>;

export const Default = {
  args: {
    player: {
      ...StoryHelpers.getNewProfile(),
      userId: PLAYER_ID,
    },
  },
};
