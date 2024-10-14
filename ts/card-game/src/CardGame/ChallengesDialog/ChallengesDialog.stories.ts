import { StoryHelpers } from '@noice-com/common-ui';
import { MockMatchGroup } from '@noice-com/platform-client/src/testing';
import { GameInitMsg } from '@noice-com/schemas/game-logic/game_logic.pb';
import { Meta, StoryObj } from '@storybook/react';

import { ChallengesDialog } from './ChallengesDialog';
import { mockChallengesDialog } from './mocks';

import {
  withCardGameUIProvider,
  createGameInitGQLMocks,
  withGameState,
  mockedChallengesIds,
  mockChallengesToChallengeStatuses,
  mockedChallenges,
} from '@game-story-helpers';

const GAME_ID = 'test-game';
const LOCAL_PLAYER_ID = 'me';

const defaultGameInit: GameInitMsg = {
  matchConfiguration: {
    gameId: GAME_ID,
  },
  challengeStatesData: {
    isEnabled: true,
    challengeStatuses: mockChallengesToChallengeStatuses(mockedChallenges),
  },
};

const mockMatchGroup = new MockMatchGroup('test-group', LOCAL_PLAYER_ID);

export default {
  title: 'Challenges/ChallengesDialog',
  component: ChallengesDialog,
  decorators: [
    withGameState(mockMatchGroup, defaultGameInit, {
      channelId: 'channel-id',
      streamId: 'stream-id',
    }),
    withCardGameUIProvider({
      isChallengesDialogOpenDefault: true,
    }),
  ],
} as Meta<typeof ChallengesDialog>;

type Story = StoryObj<typeof ChallengesDialog>;

export const Default: Story = {
  args: {},
  parameters: StoryHelpers.Apollo.addMocks([
    ...createGameInitGQLMocks(defaultGameInit),
    ...mockChallengesDialog({ gameId: GAME_ID, challengeIds: mockedChallengesIds }),
  ]),
};

export const Loading: Story = {
  args: {},
  parameters: StoryHelpers.Apollo.addMocks([
    ...createGameInitGQLMocks(defaultGameInit),
    ...mockChallengesDialog({
      gameId: GAME_ID,
      challengeIds: mockedChallengesIds,
      isLoading: true,
    }),
  ]),
};
