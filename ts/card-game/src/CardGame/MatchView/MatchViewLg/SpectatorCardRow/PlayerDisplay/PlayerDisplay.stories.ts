import { StoryHelpers } from '@noice-com/common-ui';
import { MockMatchGroup } from '@noice-com/platform-client/src/testing';
import { Meta } from '@storybook/react';

import { loadingPlayerDisplayMock, getPlayerDisplayMock } from '../mocks/story-mocks';

import { PlayerDisplay } from './PlayerDisplay';

import { withGameState } from '@game-story-helpers';

const mockMatchGroup = new MockMatchGroup('test-group', 'example-player');
export default {
  title: 'MatchViewLg/Spectator Card Row/Player Display',
  component: PlayerDisplay,
  decorators: [withGameState(mockMatchGroup)],
} as Meta<typeof PlayerDisplay>;

export const Default = {
  args: {
    playerId: 'example-player',
  },

  parameters: StoryHelpers.Apollo.addMocks([getPlayerDisplayMock()]),
};

export const Loading = {
  args: {
    playerId: 'example-player',
  },

  parameters: StoryHelpers.Apollo.addMocks([loadingPlayerDisplayMock]),
};
