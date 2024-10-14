import { StoryHelpers } from '@noice-com/common-ui';
import { MockMatchGroup } from '@noice-com/platform-client/src/testing';
import { Meta } from '@storybook/react';

import { ActiveBoostersPreview } from './ActiveBoostersPreview';

import { mockGameState } from '@game-logic/game';
import { withGameState } from '@game-story-helpers';

const LOCAL_PLAYER_ID = 'me';
const LOCAL_PLAYER_BOOSTER_ID = 1;
const TEAM_MATE_1_ID = 'team-mate-1';
const TEAM_MATE_1_BOOSTER_ID = 2;
const TEAM_MATE_2_ID = 'team-mate-2';
const TEAM_MATE_3_ID = 'team-mate-3';

const mockMatchGroup = new MockMatchGroup('test-group', LOCAL_PLAYER_ID);

export default {
  title: 'Card Row Active Card/ActiveBoostersPreview',
  component: ActiveBoostersPreview,
  argTypes: {},
  decorators: [
    withGameState(mockMatchGroup, {
      matchStateData: {
        players: [
          {
            userId: LOCAL_PLAYER_ID,
            heldBoosterId: LOCAL_PLAYER_BOOSTER_ID,
            activeCard: {
              cardId: 'test-card',
              points: 255,
              pointsMax: 500,
              pointsMin: 150,
              pointsTimeTarget: 5000,
              pointsUpdateTime: StoryHelpers.relativeTimeString(3000),
              pointsUpdateTimer: {
                startTime: StoryHelpers.relativeTimeString(),
                endTime: StoryHelpers.relativeTimeString(3000),
              },
              activeBoosters: {
                [LOCAL_PLAYER_ID]: {
                  boosterId: LOCAL_PLAYER_BOOSTER_ID,
                  activationTime: StoryHelpers.relativeTimeString(-5000),
                  activatorUserId: LOCAL_PLAYER_ID,
                },
                [TEAM_MATE_1_ID]: {
                  boosterId: TEAM_MATE_1_BOOSTER_ID,
                  activationTime: StoryHelpers.relativeTimeString(-5000),
                  activatorUserId: TEAM_MATE_1_ID,
                },
              },
            },
          },
          {
            userId: TEAM_MATE_2_ID,
          },
          {
            userId: TEAM_MATE_3_ID,
          },
        ],
      },
    }),
  ],
  parameters: StoryHelpers.Apollo.addMocks([
    ...mockGameState({ boosterId: LOCAL_PLAYER_BOOSTER_ID }),
    ...mockGameState({ boosterId: TEAM_MATE_1_BOOSTER_ID }),
  ]),
} as Meta<typeof ActiveBoostersPreview>;

export const Default = {
  args: {
    cardOwnerId: LOCAL_PLAYER_ID,
  },
};
