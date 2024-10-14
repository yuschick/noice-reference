import { StoryHelpers } from '@noice-com/common-ui';
import { MockMatchGroup } from '@noice-com/platform-client/src/testing';
import { Meta } from '@storybook/react';

import { mockTeamMateDisplay } from './mocks';
import { TeamMateDisplay } from './TeamMateDisplay';

import { mockGameState } from '@game-logic/game';
import { withGameState } from '@game-story-helpers';

const TEAM_MATE_ID = 'team-mate-id';
const BOOSTER_ID = 3;

const mockMatchGroup = new MockMatchGroup('test-group', 'me');

export default {
  title: 'MatchViewSm/Card Row/Team Mate Display',
  component: TeamMateDisplay,
  decorators: [
    withGameState(mockMatchGroup, {
      matchStateData: {
        players: [
          {
            userId: TEAM_MATE_ID,
            points: 300,
            heldBoosterId: BOOSTER_ID,
          },
        ],
      },
    }),
  ],
  parameters: StoryHelpers.Apollo.addMocks([
    ...mockTeamMateDisplay({ playerId: TEAM_MATE_ID, boosterId: BOOSTER_ID }),
    ...mockGameState({ boosterId: BOOSTER_ID }),
  ]),
} as Meta<typeof TeamMateDisplay>;

export const Default = {
  args: {
    playerId: TEAM_MATE_ID,
  },
};

export const Loading = {
  args: {
    playerId: TEAM_MATE_ID,
  },
  parameters: StoryHelpers.Apollo.addMocks([
    ...mockTeamMateDisplay({
      playerId: TEAM_MATE_ID,
      boosterId: BOOSTER_ID,
      loading: true,
    }),
    ...mockGameState({ boosterId: BOOSTER_ID }),
  ]),
};
