import { Icon, StoryHelpers } from '@noice-com/common-ui';
import { MockMatchGroup } from '@noice-com/platform-client/src/testing';
import { Meta } from '@storybook/react';

import { MatchEnd } from './MatchEnd';
import { MockMatchEndProvider } from './MatchEndProvider';
import { mockUseMatchEndPlayerRewards } from './MatchEndProvider/mocks/story-mocks';
import { mockMatchEnd } from './mocks';
import { mockGroup, mockMatchEndMessage, mockPlayer } from './story-mocks';

import { FakeStadium } from '@game-components/FakeStadium';
import { withGameState } from '@game-story-helpers';

const GAME_ID = 'apex_legends';

const defaultGameInit = {
  matchConfiguration: {
    gameId: GAME_ID,
  },
  challengeStatesData: {
    isEnabled: false,
  },
};

const players = [
  mockPlayer({ name: 'Bob Sagget', hasBestPlay: true, isLocalPlayer: true }),
  mockPlayer({ name: 'Team Member 1', hasBestPlay: true }),
  mockPlayer({ name: 'Team Member 2', hasBestPlay: false }),
  mockPlayer({ name: 'Team Member 3', hasBestPlay: true }),
];

const defaultMatchEndMessage = mockMatchEndMessage({
  players,
  group: mockGroup({ name: '4 Players Group', players, isSolo: false }),
  gameId: GAME_ID,
});

const matchRewardsMock = mockUseMatchEndPlayerRewards({
  levelDiff: [5, 6],
  thresholds: [400, 800],
  xpDiff: [456, 600],
  walletDiff: [1575, 2345],
  teamBonus: true,
  participationBonus: true,
  dailyBoost: true,
});

const mockMatchGroup = new MockMatchGroup(
  defaultMatchEndMessage.group?.id ?? 'test-group',
  players[0].userId ?? 'test-user',
);

export default {
  title: 'Match End/Match End',
  component: MatchEnd,
  argTypes: {},
  decorators: [
    withGameState(mockMatchGroup, defaultGameInit),
    (Story) => (
      <MockMatchEndProvider
        matchEndMsg={{ ...defaultMatchEndMessage }}
        matchRewards={matchRewardsMock}
      >
        <Icon icon={FakeStadium} />
        <div
          style={{
            position: 'absolute',
            inset: '0',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            pointerEvents: 'none',
            inlineSize: '100%',
            blockSize: '100%',
          }}
        >
          <Story />
        </div>
      </MockMatchEndProvider>
    ),
  ],
  parameters: StoryHelpers.Apollo.addMocks(
    mockMatchEnd({ matchEndMessage: defaultMatchEndMessage }),
  ),
} as Meta<typeof MatchEnd>;

export const Default = {
  args: {
    showResultsSummary: true,
  },
};
