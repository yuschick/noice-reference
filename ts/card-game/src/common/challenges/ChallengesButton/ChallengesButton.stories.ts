import { StoryHelpers } from '@noice-com/common-ui';
import { MockMatchGroup } from '@noice-com/platform-client/src/testing';
import {
  GameInitMsg,
  StreamStateMatchState,
} from '@noice-com/schemas/game-logic/game_logic.pb';
import { Meta } from '@storybook/react';

import { ChallengesButton } from './ChallengesButton';

import {
  createGameInitGQLMocks,
  mockChallengesToChallengeStatuses,
  mockedChallenge1,
  mockedChallenge2,
  mockedChallenge3,
  mockedChallenges,
  mockedChallengesIds,
  withGameState,
} from '@game-story-helpers';

const GAME_ID = 'test-game';
const LOCAL_PLAYER_ID = 'me';

const defaultGameInit: GameInitMsg = {
  matchStateData: {
    streamState: {
      matchState: StreamStateMatchState.MATCH_STATE_UNSPECIFIED,
    },
  },
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
  title: 'Challenges/ChallengesButton',
  component: ChallengesButton,
  argTypes: {
    animationVfx: {
      control: { type: 'select' },
      defaultValue: 'full',
      options: ['minimal', 'full'],
    },
  },
} as Meta<typeof ChallengesButton>;

export const Default = {
  args: {},
  decorators: [
    withGameState(mockMatchGroup, defaultGameInit, {
      channelId: 'channel-id',
      streamId: 'stream-id',
    }),
  ],
  parameters: StoryHelpers.Apollo.addMocks([...createGameInitGQLMocks(defaultGameInit)]),
};

export const UnselectedChallenge = {
  args: {
    showSelectedIcon: true,
  },
  decorators: [
    withGameState(mockMatchGroup, defaultGameInit, {
      channelId: 'channel-id',
      streamId: 'stream-id',
    }),
  ],
  parameters: StoryHelpers.Apollo.addMocks([...createGameInitGQLMocks(defaultGameInit)]),
};

const selectedChallengeState: GameInitMsg = {
  ...defaultGameInit,
  matchStateData: {
    ...defaultGameInit.matchStateData,
    players: [
      {
        userId: LOCAL_PLAYER_ID,
        activeChallengeId: mockedChallengesIds[0],
      },
    ],
  },
};

export const SelectedChallenge = {
  args: {
    showSelectedIcon: true,
  },
  decorators: [
    withGameState(mockMatchGroup, selectedChallengeState, {
      channelId: 'channel-id',
      streamId: 'stream-id',
    }),
  ],
  parameters: StoryHelpers.Apollo.addMocks([
    ...createGameInitGQLMocks(selectedChallengeState),
  ]),
};

const challengeSuccessMatchState: GameInitMsg = {
  ...selectedChallengeState,
  matchStateData: {
    ...selectedChallengeState.matchStateData,
    streamState: {
      ...selectedChallengeState.matchStateData?.streamState,
      matchState: StreamStateMatchState.MATCH_STATE_ACTIVE,
    },
  },
  challengeStatesData: {
    ...selectedChallengeState.challengeStatesData,
    challengeStatuses: mockChallengesToChallengeStatuses([
      {
        ...mockedChallenge1,
        status: 'success',
      },
      mockedChallenge2,
      mockedChallenge3,
    ]),
  },
};

export const ChallengeSuccess = {
  args: {},
  decorators: [
    withGameState(mockMatchGroup, challengeSuccessMatchState, {
      channelId: 'channel-id',
      streamId: 'stream-id',
    }),
  ],
  parameters: StoryHelpers.Apollo.addMocks([
    ...createGameInitGQLMocks(challengeSuccessMatchState),
  ]),
};

const challengeFailureMatchState: GameInitMsg = {
  ...challengeSuccessMatchState,
  challengeStatesData: {
    ...selectedChallengeState.challengeStatesData,
    challengeStatuses: mockChallengesToChallengeStatuses([
      {
        ...mockedChallenge1,
        status: 'failure',
      },
      mockedChallenge2,
      mockedChallenge3,
    ]),
  },
};

export const ChallengeFailure = {
  args: {},
  decorators: [
    withGameState(mockMatchGroup, challengeFailureMatchState, {
      channelId: 'channel-id',
      streamId: 'stream-id',
    }),
  ],
  parameters: StoryHelpers.Apollo.addMocks([
    ...createGameInitGQLMocks(challengeFailureMatchState),
  ]),
};
