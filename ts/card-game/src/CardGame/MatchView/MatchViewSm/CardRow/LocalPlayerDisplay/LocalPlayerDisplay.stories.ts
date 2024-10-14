import { StoryHelpers } from '@noice-com/common-ui';
import { MockMatchGroup } from '@noice-com/platform-client/src/testing';
import { Meta } from '@storybook/react';

import { LocalPlayerDisplay } from './LocalPlayerDisplay';
import { mockLocalPlayerDisplay } from './mocks';

import { mockGameState } from '@game-logic/game';
import { withGameState } from '@game-story-helpers';

const LOCAL_PLAYER_ID = 'me';
const BOOSTER_ID = 3;
const mockMatchGroup = new MockMatchGroup('test-group', LOCAL_PLAYER_ID);

export default {
  title: 'MatchViewSm/Card Row/Local Player Display',
  component: LocalPlayerDisplay,
  decorators: [
    withGameState(mockMatchGroup, {
      matchStateData: {
        players: [
          {
            userId: LOCAL_PLAYER_ID,
            heldBoosterId: BOOSTER_ID,
            points: 500,
          },
        ],
      },
    }),
    StoryHelpers.withAuthProvider({ userId: LOCAL_PLAYER_ID }),
  ],
  parameters: StoryHelpers.Apollo.addMocks([
    ...mockLocalPlayerDisplay({
      playerId: LOCAL_PLAYER_ID,
    }),
    ...mockGameState({ boosterId: BOOSTER_ID }),
  ]),
} as Meta<typeof LocalPlayerDisplay>;

export const Default = {
  args: {},
};

export const Loading = {
  args: {},
  parameters: StoryHelpers.Apollo.addMocks([
    ...mockLocalPlayerDisplay({
      playerId: LOCAL_PLAYER_ID,
      loading: true,
    }),
    ...mockGameState({ boosterId: BOOSTER_ID }),
  ]),
};
