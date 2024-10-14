import { StoryHelpers } from '@noice-com/common-ui';
import { MockMatchGroup } from '@noice-com/platform-client/src/testing';
import { Meta, StoryFn } from '@storybook/react';

import { mockSpectatorCardRow } from './mocks';
import { SpectatorCardRow } from './SpectatorCardRow';

import {
  createGameInitGQLMocks,
  withAoNCountdown,
  withEventPayload,
  withFakeStadium,
  withGameState,
  withTriggerEvents,
} from '@game-story-helpers';

const PLAYER_1_ID = 'player-1-id';
const PLAYER_1_BOOSTER_ID = 2;
const PLAYER_1_CARD_ID = 'card-2';
const PLAYER_2_ID = 'player-2-id';
const PLAYER_2_BOOSTER_ID = 3;
const PLAYER_2_CARD_ID = 'card-3';
const APPLIED_BOOSTER_1_ID = 4;
const APPLIED_BOOSTER_2_ID = 5;

const mockMatchGroup = new MockMatchGroup('test-group', 'me');
export default {
  title: 'MatchViewLg/Spectator Card Row',
  component: SpectatorCardRow,
  argTypes: {},
} as Meta<typeof SpectatorCardRow>;

const Template: StoryFn = (args) => (
  <div
    style={{
      position: 'absolute',
      bottom: '0',
      left: '0',
    }}
  >
    <SpectatorCardRow {...args} />
  </div>
);

const defaultGameInit = {
  matchStateData: {
    players: [
      {
        userId: PLAYER_1_ID,
        heldBoosterId: PLAYER_1_BOOSTER_ID,
        activeCard: {
          cardId: PLAYER_1_CARD_ID,
          points: 300,
        },
      },
      {
        userId: PLAYER_2_ID,
        points: 300,
        heldBoosterId: PLAYER_2_BOOSTER_ID,
        activeCard: {
          cardId: PLAYER_2_CARD_ID,
          points: 300,
        },
      },
    ],
  },
};

export const Default = {
  render: Template,
  args: {},
  parameters: StoryHelpers.Apollo.addMocks([
    ...createGameInitGQLMocks(defaultGameInit),
    ...mockSpectatorCardRow({
      playerId: PLAYER_1_ID,
      boosterId: PLAYER_1_BOOSTER_ID,
      cardId: PLAYER_1_CARD_ID,
    }),
    ...mockSpectatorCardRow({
      playerId: PLAYER_2_ID,
      boosterId: PLAYER_2_BOOSTER_ID,
      cardId: PLAYER_2_CARD_ID,
    }),
  ]),
  decorators: [
    withGameState(mockMatchGroup, defaultGameInit),
    withFakeStadium(),
    withTriggerEvents(mockMatchGroup, [PLAYER_1_ID, PLAYER_2_ID]),
  ],
};

const appliedBoostersGameInit = {
  matchStateData: {
    players: [
      {
        userId: PLAYER_1_ID,
        heldBoosterId: PLAYER_1_BOOSTER_ID,
        activeCard: {
          cardId: PLAYER_1_CARD_ID,
          points: 300,
          activeBoosters: {
            [PLAYER_1_ID]: {
              boosterId: APPLIED_BOOSTER_1_ID,
              activatorUserId: PLAYER_1_ID,
            },
            [PLAYER_2_ID]: {
              boosterId: APPLIED_BOOSTER_2_ID,
              activatorUserId: PLAYER_2_ID,
            },
          },
        },
      },
      {
        userId: PLAYER_2_ID,
        points: 300,
        heldBoosterId: PLAYER_2_BOOSTER_ID,
        activeCard: {
          cardId: PLAYER_2_CARD_ID,
          points: 300,
        },
      },
    ],
  },
};

export const AppliedBoosters = {
  render: Template,
  args: {},
  parameters: StoryHelpers.Apollo.addMocks([
    ...createGameInitGQLMocks(appliedBoostersGameInit),
    ...mockSpectatorCardRow({
      playerId: PLAYER_1_ID,
      appliedBoosterIds: [APPLIED_BOOSTER_1_ID, APPLIED_BOOSTER_2_ID],
      boosterId: PLAYER_1_BOOSTER_ID,
      cardId: PLAYER_1_CARD_ID,
    }),
    ...mockSpectatorCardRow({
      playerId: PLAYER_2_ID,
      boosterId: PLAYER_2_BOOSTER_ID,
      cardId: PLAYER_2_CARD_ID,
    }),
  ]),
  decorators: [
    withGameState(mockMatchGroup, appliedBoostersGameInit),
    withFakeStadium(),
    withTriggerEvents(mockMatchGroup, [PLAYER_1_ID, PLAYER_2_ID]),
    withEventPayload(mockMatchGroup, {
      onActiveCardSucceeded: {
        boosterPoints: [
          {
            boosterId: APPLIED_BOOSTER_1_ID,
            points: 200,
          },
        ],
      },
    }),
  ],
};

const AllOrNothingSucceeded = {
  points: 500,
  boosterPoints: [
    {
      boosterId: APPLIED_BOOSTER_1_ID,
      points: 200,
    },
  ],
};

export const AllOrNothing = {
  render: Template,
  args: {},
  parameters: StoryHelpers.Apollo.addMocks([
    ...createGameInitGQLMocks(appliedBoostersGameInit),
    ...mockSpectatorCardRow({
      playerId: PLAYER_1_ID,
      appliedBoosterIds: [APPLIED_BOOSTER_1_ID, APPLIED_BOOSTER_2_ID],
      boosterId: PLAYER_1_BOOSTER_ID,
      cardId: PLAYER_1_CARD_ID,
      cardData: {
        description: 'This is a AoN description with {timerDuration}s countdown',
        timerDuration: 20,
      },
    }),
    ...mockSpectatorCardRow({
      playerId: PLAYER_2_ID,
      boosterId: PLAYER_2_BOOSTER_ID,
      cardId: PLAYER_2_CARD_ID,
    }),
  ]),
  decorators: [
    withGameState(mockMatchGroup, appliedBoostersGameInit),
    withFakeStadium(),
    withTriggerEvents(mockMatchGroup, [PLAYER_1_ID, PLAYER_2_ID]),
    withEventPayload(mockMatchGroup, {
      onActiveCardSucceeded: AllOrNothingSucceeded,
      onAonPointsCollected: {
        points: 500,
      },
    }),
    withAoNCountdown(mockMatchGroup, {
      userId: PLAYER_1_ID,
      cardId: PLAYER_1_CARD_ID,
      countdownStart: 20,
      onActiveCardSucceeded: AllOrNothingSucceeded,
      onAonPointsCollected: {
        points: 500,
      },
    }),
  ],
};
