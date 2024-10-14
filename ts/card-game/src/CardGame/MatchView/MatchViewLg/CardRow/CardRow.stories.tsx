import { StoryHelpers } from '@noice-com/common-ui';
import { MockMatchGroup } from '@noice-com/platform-client/src/testing';
import { Meta, StoryFn } from '@storybook/react';
import { useEffect } from 'react';

import { CardRow } from './CardRow';
import { mockCardRow } from './mocks';

import {
  withAoNCountdown,
  withFakeStadium,
  withGameState,
  withTriggerEvents,
  createGameInitGQLMocks,
  withEventPayload,
} from '@game-story-helpers';
import { BoosterType } from '@game-types';

const LOCAL_PLAYER_ID = 'me';
const LOCAL_PLAYER_CARD_ID = 'card-1';
const localPlayerHeldBoosterId = BoosterType.SpeedUp;
const LOCAL_PLAYER_INITIAL_SCORE = 1500;
const LOCAL_PLAYER_CARD_SCORE = 300;
const TEAM_MATE_1_ID = 'team-mate-1-id';
const TEAM_MATE_1_CARD_ID = 'card-2';
const teamMate1HeldBoosterId = BoosterType.Doubt;
const TEAM_MATE_1_INITIAL_SCORE = 1100;
const TEAM_MATE_1_CARD_SCORE = 200;
const TEAM_MATE_2_ID = 'team-mate-2-id';
const TEAM_MATE_2_CARD_ID = 'card-3';
const TEAM_MATE_3_ID = 'team-mate-3-id';
const TEAM_MATE_3_CARD_ID = 'card-4';

const BOOSTER_SCORE_1 = 200;
const BOOSTER_SCORE_2 = 75;
const AON_COUNTDOWN_START = 15;

const LOCAL_PLAYER_POINTS_WITH_BOOSTERS =
  LOCAL_PLAYER_CARD_SCORE + BOOSTER_SCORE_1 + BOOSTER_SCORE_2;
const TEAM_MATE_1_POINTS_WITH_BOOSTERS =
  TEAM_MATE_1_CARD_SCORE + BOOSTER_SCORE_1 + BOOSTER_SCORE_2;

const mockMatchGroup = new MockMatchGroup('test-group', LOCAL_PLAYER_ID);

export default {
  title: 'MatchViewLg/Card Row',
  component: CardRow,
  argTypes: {},
  decorators: [withFakeStadium()],
} as Meta<typeof CardRow>;

const Template: StoryFn = (args) => (
  <div
    style={{
      position: 'absolute',
      bottom: '0',
      left: '0',
    }}
  >
    <CardRow {...args} />
  </div>
);

const defaultGameInit = {
  matchStateData: {
    players: [
      {
        userId: LOCAL_PLAYER_ID,
        points: LOCAL_PLAYER_INITIAL_SCORE,
        heldBoosterId: localPlayerHeldBoosterId,
        activeCard: {
          cardId: LOCAL_PLAYER_CARD_ID,
          points: LOCAL_PLAYER_CARD_SCORE,
        },
        isOnline: true,
      },
      {
        userId: TEAM_MATE_1_ID,
        points: TEAM_MATE_1_INITIAL_SCORE,
        heldBoosterId: teamMate1HeldBoosterId,
        activeCard: {
          cardId: TEAM_MATE_1_CARD_ID,
          points: TEAM_MATE_1_CARD_SCORE,
        },
        isOnline: true,
      },
      {
        userId: TEAM_MATE_2_ID,
        points: 0,
        isOnline: true,
      },
      {
        userId: TEAM_MATE_3_ID,
        points: 0,
        isOnline: true,
      },
    ],
  },
};

const defaultMocks = [
  ...createGameInitGQLMocks(defaultGameInit),
  ...mockCardRow({
    cardId: LOCAL_PLAYER_CARD_ID,
    playerId: LOCAL_PLAYER_ID,
    boosterId: localPlayerHeldBoosterId,
    isLocalPlayer: true,
  }),
  ...mockCardRow({
    cardId: TEAM_MATE_1_CARD_ID,
    playerId: TEAM_MATE_1_ID,
    boosterId: teamMate1HeldBoosterId,
  }),
  ...mockCardRow({
    cardId: TEAM_MATE_2_CARD_ID,
    playerId: TEAM_MATE_2_ID,
  }),
  ...mockCardRow({
    cardId: TEAM_MATE_3_CARD_ID,
    playerId: TEAM_MATE_3_ID,
  }),
];

export const Default = {
  render: Template,
  args: {},
  parameters: StoryHelpers.Apollo.addMocks(defaultMocks),
  decorators: [
    withGameState(mockMatchGroup, defaultGameInit),
    withTriggerEvents(mockMatchGroup, [LOCAL_PLAYER_ID, TEAM_MATE_1_ID]),
  ],
};

const appliedBoostersForLocalPlayerGameInit = {
  matchStateData: {
    players: [
      {
        userId: LOCAL_PLAYER_ID,
        points: LOCAL_PLAYER_INITIAL_SCORE,
        heldBoosterId: BoosterType.SpeedUp,
        activeCard: {
          cardId: LOCAL_PLAYER_CARD_ID,
          points: LOCAL_PLAYER_CARD_SCORE,
          activeBoosters: {
            [LOCAL_PLAYER_ID]: {
              boosterId: BoosterType.LetsGo,
              activatorUserId: LOCAL_PLAYER_ID,
            },
            [TEAM_MATE_2_ID]: {
              boosterId: BoosterType.Doubt,
              activatorUserId: TEAM_MATE_2_ID,
            },
            [TEAM_MATE_1_ID]: {
              boosterId: BoosterType.GoodCall,
              activatorUserId: TEAM_MATE_1_ID,
            },
            [TEAM_MATE_3_ID]: {
              boosterId: BoosterType.SpeedUp,
              activatorUserId: TEAM_MATE_3_ID,
            },
          },
        },
        isOnline: true,
      },
      {
        userId: TEAM_MATE_1_ID,
        points: TEAM_MATE_1_INITIAL_SCORE,
        activeCard: {
          cardId: TEAM_MATE_1_CARD_ID,
          points: TEAM_MATE_1_CARD_SCORE,
        },
        isOnline: true,
      },
      {
        userId: TEAM_MATE_2_ID,
        points: 200,
        activeCard: {
          cardId: TEAM_MATE_2_CARD_ID,
          points: 500,
        },
        isOnline: true,
      },
      {
        userId: TEAM_MATE_3_ID,
        points: 0,
        heldBoosterId: BoosterType.NextUp,
        activeCard: {
          cardId: TEAM_MATE_3_CARD_ID,
          points: 100,
        },
        isOnline: true,
      },
    ],
  },
};

export const AppliedBoostersForLocalPlayer = {
  render: Template,
  args: {},
  parameters: StoryHelpers.Apollo.addMocks([
    ...createGameInitGQLMocks(appliedBoostersForLocalPlayerGameInit),
    ...mockCardRow({
      cardId: LOCAL_PLAYER_CARD_ID,
      playerId: LOCAL_PLAYER_ID,
      isLocalPlayer: true,
    }),
    ...mockCardRow({
      cardId: TEAM_MATE_1_CARD_ID,
      playerId: TEAM_MATE_1_ID,
    }),
    ...mockCardRow({
      cardId: TEAM_MATE_2_CARD_ID,
      playerId: TEAM_MATE_2_ID,
    }),
    ...mockCardRow({
      cardId: TEAM_MATE_3_CARD_ID,
      playerId: TEAM_MATE_3_ID,
    }),
  ]),
  decorators: [
    withGameState(mockMatchGroup, appliedBoostersForLocalPlayerGameInit),
    withTriggerEvents(mockMatchGroup, [LOCAL_PLAYER_ID]),
    withEventPayload(mockMatchGroup, {
      onPlayerPointsUpdated: {
        points:
          LOCAL_PLAYER_INITIAL_SCORE +
          LOCAL_PLAYER_CARD_SCORE +
          BOOSTER_SCORE_1 +
          BOOSTER_SCORE_2,
      },
      onActiveCardSucceeded: {
        points: LOCAL_PLAYER_CARD_SCORE + BOOSTER_SCORE_1 + BOOSTER_SCORE_2,
        boosterPoints: [
          {
            boosterId: BoosterType.GoodCall,
            points: 200,
          },
          {
            boosterId: BoosterType.LetsGo,
            points: 75,
          },
        ],
      },
    }),
  ],
};

const appliedBoostersForTeamMateGameInit = {
  matchStateData: {
    players: [
      {
        userId: LOCAL_PLAYER_ID,
        points: LOCAL_PLAYER_INITIAL_SCORE,
        heldBoosterId: BoosterType.SpeedUp,
        activeCard: {
          cardId: LOCAL_PLAYER_CARD_ID,
          points: LOCAL_PLAYER_CARD_SCORE,
        },
        isOnline: true,
      },
      {
        userId: TEAM_MATE_1_ID,
        points: TEAM_MATE_1_INITIAL_SCORE,
        activeCard: {
          cardId: TEAM_MATE_1_CARD_ID,
          points: TEAM_MATE_1_CARD_SCORE,
          activeBoosters: {
            [LOCAL_PLAYER_ID]: {
              boosterId: BoosterType.LetsGo,
              activatorUserId: LOCAL_PLAYER_ID,
            },
            [TEAM_MATE_2_ID]: {
              boosterId: BoosterType.Doubt,
              activatorUserId: TEAM_MATE_2_ID,
            },
            [TEAM_MATE_1_ID]: {
              boosterId: BoosterType.GoodCall,
              activatorUserId: TEAM_MATE_1_ID,
            },
            [TEAM_MATE_3_ID]: {
              boosterId: BoosterType.SpeedUp,
              activatorUserId: TEAM_MATE_3_ID,
            },
          },
        },
        isOnline: true,
      },
      {
        userId: TEAM_MATE_2_ID,
        points: 200,
        activeCard: {
          cardId: TEAM_MATE_2_CARD_ID,
          points: 500,
        },
        isOnline: true,
      },
      {
        userId: TEAM_MATE_3_ID,
        points: 0,
        heldBoosterId: BoosterType.NextUp,
        activeCard: {
          cardId: TEAM_MATE_3_CARD_ID,
          points: 100,
        },
        isOnline: true,
      },
    ],
  },
};

export const AppliedBoostersForTeamMate = {
  render: Template,
  args: {},
  parameters: StoryHelpers.Apollo.addMocks([
    ...createGameInitGQLMocks(appliedBoostersForTeamMateGameInit),
    ...mockCardRow({
      cardId: LOCAL_PLAYER_CARD_ID,
      playerId: LOCAL_PLAYER_ID,
      isLocalPlayer: true,
    }),
    ...mockCardRow({
      cardId: TEAM_MATE_1_CARD_ID,
      playerId: TEAM_MATE_1_ID,
    }),
    ...mockCardRow({
      cardId: TEAM_MATE_2_CARD_ID,
      playerId: TEAM_MATE_2_ID,
    }),
    ...mockCardRow({
      cardId: TEAM_MATE_3_CARD_ID,
      playerId: TEAM_MATE_3_ID,
    }),
  ]),
  decorators: [
    withGameState(mockMatchGroup, appliedBoostersForTeamMateGameInit),
    withTriggerEvents(mockMatchGroup, [TEAM_MATE_1_ID]),
    withEventPayload(mockMatchGroup, {
      onAonPointsCollected: {
        cardId: TEAM_MATE_1_CARD_ID,
        points: TEAM_MATE_1_CARD_SCORE + BOOSTER_SCORE_1 + BOOSTER_SCORE_2,
      },
      onPlayerPointsUpdated: {
        points:
          TEAM_MATE_1_INITIAL_SCORE +
          TEAM_MATE_1_CARD_SCORE +
          BOOSTER_SCORE_1 +
          BOOSTER_SCORE_2,
      },
      onActiveCardSucceeded: {
        points: TEAM_MATE_1_POINTS_WITH_BOOSTERS,
        boosterPoints: [
          {
            boosterId: BoosterType.GoodCall,
            points: BOOSTER_SCORE_1,
          },
          {
            boosterId: BoosterType.LetsGo,
            points: BOOSTER_SCORE_2,
          },
        ],
      },
    }),
  ],
};

export const AllOrNothingLocalPlayer = {
  render: Template,
  args: {},
  parameters: StoryHelpers.Apollo.addMocks([
    ...createGameInitGQLMocks(defaultGameInit),
    ...mockCardRow({
      cardId: LOCAL_PLAYER_CARD_ID,
      playerId: LOCAL_PLAYER_ID,
      isLocalPlayer: true,
      cardData: {
        description: 'This is a AoN description with {timerDuration}s countdown',
        timerDuration: AON_COUNTDOWN_START,
      },
    }),
    ...mockCardRow({
      cardId: TEAM_MATE_1_CARD_ID,
      playerId: TEAM_MATE_1_ID,
    }),
    ...mockCardRow({
      cardId: TEAM_MATE_2_CARD_ID,
      playerId: TEAM_MATE_2_ID,
    }),
    ...mockCardRow({
      cardId: TEAM_MATE_3_CARD_ID,
      playerId: TEAM_MATE_3_ID,
    }),
  ]),
  decorators: [
    withGameState(mockMatchGroup, defaultGameInit),
    withTriggerEvents(mockMatchGroup, [LOCAL_PLAYER_ID]),
    withAoNCountdown(mockMatchGroup, {
      userId: LOCAL_PLAYER_ID,
      cardId: LOCAL_PLAYER_CARD_ID,
      countdownStart: AON_COUNTDOWN_START,
      onActiveCardSucceeded: {
        points: LOCAL_PLAYER_CARD_SCORE,
        allOrNothing: {
          nextPoints: 2 * LOCAL_PLAYER_CARD_SCORE,
          cardId: LOCAL_PLAYER_CARD_ID,
          totalPoints: LOCAL_PLAYER_CARD_SCORE,
        },
      },
    }),
  ],
};

export const AllOrNothingTeamMate = {
  render: Template,
  args: {},
  parameters: StoryHelpers.Apollo.addMocks([
    ...createGameInitGQLMocks(defaultGameInit),
    ...mockCardRow({
      cardId: LOCAL_PLAYER_CARD_ID,
      playerId: LOCAL_PLAYER_ID,
      isLocalPlayer: true,
    }),
    ...mockCardRow({
      cardId: TEAM_MATE_1_CARD_ID,
      playerId: TEAM_MATE_1_ID,
      cardData: {
        description: 'This is a AoN description with {timerDuration}s countdown',
        timerDuration: AON_COUNTDOWN_START,
      },
    }),
    ...mockCardRow({
      cardId: TEAM_MATE_2_CARD_ID,
      playerId: TEAM_MATE_2_ID,
    }),
    ...mockCardRow({
      cardId: TEAM_MATE_3_CARD_ID,
      playerId: TEAM_MATE_3_ID,
    }),
  ]),
  decorators: [
    withGameState(mockMatchGroup, defaultGameInit),
    withTriggerEvents(mockMatchGroup, [TEAM_MATE_1_ID]),
    withAoNCountdown(mockMatchGroup, {
      userId: TEAM_MATE_1_ID,
      cardId: TEAM_MATE_1_CARD_ID,
      countdownStart: AON_COUNTDOWN_START,
      onActiveCardSucceeded: {
        points: TEAM_MATE_1_CARD_SCORE,
        allOrNothing: {
          nextPoints: 2 * TEAM_MATE_1_CARD_SCORE,
          cardId: TEAM_MATE_1_CARD_ID,
          totalPoints: TEAM_MATE_1_CARD_SCORE,
        },
      },
    }),
  ],
};

const aonAppliedBoostersForLocalPlayerGameInit = {
  matchStateData: {
    players: [
      {
        userId: LOCAL_PLAYER_ID,
        points: LOCAL_PLAYER_INITIAL_SCORE,
        heldBoosterId: localPlayerHeldBoosterId,
        activeCard: {
          cardId: LOCAL_PLAYER_CARD_ID,
          points: LOCAL_PLAYER_CARD_SCORE,
          activeBoosters: {
            [LOCAL_PLAYER_ID]: {
              boosterId: BoosterType.LetsGo,
              activatorUserId: LOCAL_PLAYER_ID,
            },
            [TEAM_MATE_2_ID]: {
              boosterId: BoosterType.Doubt,
              activatorUserId: TEAM_MATE_2_ID,
            },
            [TEAM_MATE_1_ID]: {
              boosterId: BoosterType.GoodCall,
              activatorUserId: TEAM_MATE_1_ID,
            },
            [TEAM_MATE_3_ID]: {
              boosterId: BoosterType.SpeedUp,
              activatorUserId: TEAM_MATE_3_ID,
            },
          },
        },
        isOnline: true,
      },
      {
        userId: TEAM_MATE_1_ID,
        points: TEAM_MATE_1_INITIAL_SCORE,
        heldBoosterId: teamMate1HeldBoosterId,
        activeCard: {
          cardId: TEAM_MATE_1_CARD_ID,
          points: TEAM_MATE_1_CARD_SCORE,
        },
        isOnline: true,
      },
      {
        userId: TEAM_MATE_2_ID,
        points: 0,
        isOnline: true,
      },
      {
        userId: TEAM_MATE_3_ID,
        points: 0,
        isOnline: true,
      },
    ],
  },
};

const LocalPlayerAoNOnActiveCardSucceeded = {
  points: LOCAL_PLAYER_POINTS_WITH_BOOSTERS,
  allOrNothing: {
    nextPoints: 2 * LOCAL_PLAYER_POINTS_WITH_BOOSTERS,
    cardId: LOCAL_PLAYER_CARD_ID,
    totalPoints: LOCAL_PLAYER_POINTS_WITH_BOOSTERS,
  },
  boosterPoints: [
    {
      boosterId: BoosterType.GoodCall,
      points: BOOSTER_SCORE_1,
    },
    {
      boosterId: BoosterType.LetsGo,
      points: BOOSTER_SCORE_2,
    },
  ],
};

export const AllOrNothingWithAppliedBoostersForLocalPlayer = {
  render: Template,
  args: {},
  parameters: StoryHelpers.Apollo.addMocks([
    ...createGameInitGQLMocks(aonAppliedBoostersForLocalPlayerGameInit),
    ...mockCardRow({
      cardId: LOCAL_PLAYER_CARD_ID,
      playerId: LOCAL_PLAYER_ID,
      isLocalPlayer: true,
      cardData: {
        description: 'This is a AoN description with {timerDuration}s countdown',
        timerDuration: AON_COUNTDOWN_START,
      },
    }),
    ...mockCardRow({
      cardId: TEAM_MATE_1_CARD_ID,
      playerId: TEAM_MATE_1_ID,
    }),
    ...mockCardRow({
      cardId: TEAM_MATE_2_CARD_ID,
      playerId: TEAM_MATE_2_ID,
    }),
    ...mockCardRow({
      cardId: TEAM_MATE_3_CARD_ID,
      playerId: TEAM_MATE_3_ID,
    }),
  ]),
  decorators: [
    withGameState(mockMatchGroup, aonAppliedBoostersForLocalPlayerGameInit),
    withTriggerEvents(mockMatchGroup, [LOCAL_PLAYER_ID]),
    withEventPayload(mockMatchGroup, {
      onAonPointsCollected: {
        cardId: LOCAL_PLAYER_CARD_ID,
        points: LOCAL_PLAYER_POINTS_WITH_BOOSTERS,
      },
      onPlayerPointsUpdated: {
        points: LOCAL_PLAYER_INITIAL_SCORE + LOCAL_PLAYER_POINTS_WITH_BOOSTERS,
      },
      onActiveCardSucceeded: LocalPlayerAoNOnActiveCardSucceeded,
    }),
    withAoNCountdown(mockMatchGroup, {
      userId: LOCAL_PLAYER_ID,
      cardId: LOCAL_PLAYER_CARD_ID,
      countdownStart: AON_COUNTDOWN_START,
      onActiveCardSucceeded: LocalPlayerAoNOnActiveCardSucceeded,
    }),
  ],
};

const aonAppliedBoostersForTeamMateGameInit = {
  matchStateData: {
    players: [
      {
        userId: LOCAL_PLAYER_ID,
        points: LOCAL_PLAYER_INITIAL_SCORE,
        heldBoosterId: localPlayerHeldBoosterId,
        activeCard: {
          cardId: LOCAL_PLAYER_CARD_ID,
          points: LOCAL_PLAYER_CARD_SCORE,
        },
        isOnline: true,
      },
      {
        userId: TEAM_MATE_1_ID,
        points: TEAM_MATE_1_INITIAL_SCORE,
        heldBoosterId: teamMate1HeldBoosterId,
        activeCard: {
          cardId: TEAM_MATE_1_CARD_ID,
          points: TEAM_MATE_1_CARD_SCORE,
          activeBoosters: {
            [LOCAL_PLAYER_ID]: {
              boosterId: BoosterType.LetsGo,
              activatorUserId: LOCAL_PLAYER_ID,
            },
            [TEAM_MATE_2_ID]: {
              boosterId: BoosterType.Doubt,
              activatorUserId: TEAM_MATE_2_ID,
            },
            [TEAM_MATE_1_ID]: {
              boosterId: BoosterType.GoodCall,
              activatorUserId: TEAM_MATE_1_ID,
            },
            [TEAM_MATE_3_ID]: {
              boosterId: BoosterType.SpeedUp,
              activatorUserId: TEAM_MATE_3_ID,
            },
          },
        },
        isOnline: true,
      },
      {
        userId: TEAM_MATE_2_ID,
        points: 0,
        isOnline: true,
      },
      {
        userId: TEAM_MATE_3_ID,
        points: 0,
        isOnline: true,
      },
    ],
  },
};

const TeamMate1AoNOnActiveCardSucceeded = {
  points: TEAM_MATE_1_POINTS_WITH_BOOSTERS,
  allOrNothing: {
    nextPoints: 2 * TEAM_MATE_1_POINTS_WITH_BOOSTERS,
    cardId: TEAM_MATE_1_CARD_ID,
    totalPoints: TEAM_MATE_1_POINTS_WITH_BOOSTERS,
  },
  boosterPoints: [
    {
      boosterId: BoosterType.GoodCall,
      points: BOOSTER_SCORE_1,
    },
    {
      boosterId: BoosterType.LetsGo,
      points: BOOSTER_SCORE_2,
    },
  ],
};

export const AllOrNothingWithAppliedBoostersForTeamMate = {
  render: Template,
  args: {},
  parameters: StoryHelpers.Apollo.addMocks([
    ...createGameInitGQLMocks(aonAppliedBoostersForTeamMateGameInit),
    ...mockCardRow({
      cardId: LOCAL_PLAYER_CARD_ID,
      playerId: LOCAL_PLAYER_ID,
      isLocalPlayer: true,
    }),
    ...mockCardRow({
      cardId: TEAM_MATE_1_CARD_ID,
      playerId: TEAM_MATE_1_ID,
      cardData: {
        description: 'This is a AoN description with {timerDuration}s countdown',
        timerDuration: AON_COUNTDOWN_START,
      },
    }),
    ...mockCardRow({
      cardId: TEAM_MATE_2_CARD_ID,
      playerId: TEAM_MATE_2_ID,
    }),
    ...mockCardRow({
      cardId: TEAM_MATE_3_CARD_ID,
      playerId: TEAM_MATE_3_ID,
    }),
  ]),
  decorators: [
    withGameState(mockMatchGroup, aonAppliedBoostersForTeamMateGameInit),
    withTriggerEvents(mockMatchGroup, [TEAM_MATE_1_ID]),
    withEventPayload(mockMatchGroup, {
      onAonPointsCollected: {
        cardId: TEAM_MATE_1_CARD_ID,
        points: TEAM_MATE_1_POINTS_WITH_BOOSTERS,
      },
      onPlayerPointsUpdated: {
        points: TEAM_MATE_1_INITIAL_SCORE + TEAM_MATE_1_POINTS_WITH_BOOSTERS,
      },
      onActiveCardSucceeded: TeamMate1AoNOnActiveCardSucceeded,
    }),
    withAoNCountdown(mockMatchGroup, {
      userId: TEAM_MATE_1_ID,
      cardId: TEAM_MATE_1_CARD_ID,
      countdownStart: AON_COUNTDOWN_START,
      onActiveCardSucceeded: TeamMate1AoNOnActiveCardSucceeded,
    }),
  ],
};

export const NoCards = {
  render: Template,
  args: {},
  decorators: [
    withGameState(mockMatchGroup, {
      matchStateData: {
        players: [
          {
            userId: LOCAL_PLAYER_ID,
            isOnline: true,
          },
          {
            userId: TEAM_MATE_1_ID,
            isOnline: true,
          },
          {
            userId: TEAM_MATE_2_ID,
            isOnline: true,
          },
          {
            userId: TEAM_MATE_3_ID,
            isOnline: true,
          },
        ],
      },
    }),
  ],
};

const PausedTemplate: StoryFn = (args) => {
  useEffect(() => {
    const timeout = setTimeout(
      () =>
        mockMatchGroup.triggerEvent('onMatchPauseStateChanged', {
          paused: true,
        }),
      100,
    );

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return <Template {...args} />;
};

export const Paused = {
  render: PausedTemplate,
  args: {},
  parameters: StoryHelpers.Apollo.addMocks(defaultMocks),
  decorators: [withGameState(mockMatchGroup, defaultGameInit)],
};
