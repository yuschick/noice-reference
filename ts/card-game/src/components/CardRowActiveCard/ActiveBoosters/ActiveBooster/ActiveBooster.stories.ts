import { StoryHelpers } from '@noice-com/common-ui';
import { MockMatchGroup } from '@noice-com/platform-client/src/testing';
import { Meta } from '@storybook/react';

import { ActiveBooster } from './ActiveBooster';
import { mockActiveBooster } from './mocks';

import { mockGameState } from '@game-logic/game';
import { withGameState } from '@game-story-helpers';
import { BoosterType } from '@game-types';

const BOOSTER_ID = 1;
const PLAYER_ID = 'me';

const mockMatchGroup = new MockMatchGroup('test-group', PLAYER_ID);

export default {
  title: 'Card Row Active Card/Active Booster',
  component: ActiveBooster,
  argTypes: {},
  decorators: [
    withGameState(mockMatchGroup, {
      matchStateData: {
        players: [
          {
            userId: PLAYER_ID,
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
                [PLAYER_ID]: {
                  boosterId: BOOSTER_ID,
                  activationTime: StoryHelpers.relativeTimeString(-5000),
                  activatorUserId: PLAYER_ID,
                },
              },
            },
          },
        ],
      },
    }),
  ],
  parameters: StoryHelpers.Apollo.addMocks([
    ...mockActiveBooster({ boosterId: BOOSTER_ID, playerId: PLAYER_ID }),
    ...mockGameState({ boosterId: BOOSTER_ID }),
  ]),
} as Meta<typeof ActiveBooster>;

const booster = {
  id: BoosterType.SpeedUp,
  timeActive: 0,
  name: 'Hype',
  descriptionCondition: 'Card SUCCEEDS in next 60s',
  descriptionDefaultBenefit: 'Card +50% Points',
  descriptionTargetNoneBenefit: "You score 50% of card's current points",
  descriptionTargetSelf: 'Card +150% Points',
};

export const Default = {
  args: {
    boosterOwnerId: PLAYER_ID,
    cardOwnerId: PLAYER_ID,
    size: 'medium',
  },
};

export const WithReplacement = {
  args: {
    boosterOwnerId: PLAYER_ID,
    cardOwnerId: PLAYER_ID,
    size: 'medium',
    replaceBooster: booster,
  },
};
