import { StoryHelpers, WalletCurrencyId } from '@noice-com/common-ui';
import { withAuthProvider } from '@noice-com/common-ui/src/story-helpers';
import { MockMatchGroup } from '@noice-com/platform-client/src/testing';
import {
  GameInitMsg,
  StreamStateMatchState,
  StreamStateMatchType,
  StreamStateRoundPhase,
} from '@noice-com/schemas/game-logic/game_logic.pb';
import { Meta, StoryFn } from '@storybook/react';
import { useEffect, useState } from 'react';

import { CardGame, Props } from './CardGame';
import { MockMatchEndProvider } from './MatchEnd/MatchEndProvider';
import { mockCardGame } from './mocks';

import { useCardGameState } from '@game-logic/game/context';
import {
  createGameInitGQLMocks,
  mockChallengesToChallengeStatuses,
  mockedChallenge1,
  mockedChallenge2,
  mockedChallenge3,
  mockedChallenges,
  mockedChallengesIds,
  withEventPayload,
  withFakeStadium,
  withGameState,
  withTriggerEvents,
} from '@game-story-helpers';
import { BoosterType } from '@game-types';

const group = {
  id: 'best-group-ever',
  name: 'Best Group Ever',
  points: 5000,
  isParty: false,
  isSolo: false,
};

const GAME_ID = 'test-game-id';
const CHANNEL_ID = 'test-channel-id';
const LOCAL_PLAYER_ID = 'me';
const LOCAL_PLAYER_CARD_ID = 'local-player-card';
const localPlayerHeldBoosterId = BoosterType.Doubt;
const TEAM_MATE_1_ID = 'team-mate-1-id';
const TEAM_MATE_1_CARD_ID = 'card-1';
const teamMate1HeldBoosterId = BoosterType.LetsGo;
const TEAM_MATE_2_ID = 'team-mate-2-id';
const TEAM_MATE_2_CARD_ID = 'card-2';
const TEAM_MATE_3_ID = 'team-mate-3-id';
const TEAM_MATE_3_CARD_ID = 'card-3';
const handCardIds = ['1', '2', '3', '4', '5'];
const matchCardIds = ['6', '7'];

const mockMatchGroup = new MockMatchGroup('test-group', LOCAL_PLAYER_ID);
const defaultGameInit: GameInitMsg = {
  matchConfiguration: {
    gameId: GAME_ID,
  },
  matchStateData: {
    players: [
      {
        userId: LOCAL_PLAYER_ID,
        points: 1500,
        heldBoosterId: localPlayerHeldBoosterId,
        activeCard: {
          cardId: LOCAL_PLAYER_CARD_ID,
          points: 1500,
          activeBoosters: {
            [LOCAL_PLAYER_ID]: {
              boosterId: BoosterType.GoodCall,
              activatorUserId: LOCAL_PLAYER_ID,
            },
            [TEAM_MATE_1_ID]: {
              boosterId: BoosterType.Scavenge,
              activatorUserId: TEAM_MATE_1_ID,
            },
          },
        },
        isOnline: true,
      },
      {
        userId: TEAM_MATE_1_ID,
        points: 1100,
        heldBoosterId: teamMate1HeldBoosterId,
        activeCard: {
          cardId: TEAM_MATE_1_CARD_ID,
          points: 300,
          activeBoosters: {
            [LOCAL_PLAYER_ID]: {
              boosterId: BoosterType.NextUp,
              activatorUserId: LOCAL_PLAYER_ID,
            },
            [TEAM_MATE_1_ID]: {
              boosterId: BoosterType.SpeedUp,
              activatorUserId: TEAM_MATE_1_ID,
            },
          },
        },
        isOnline: true,
      },
      {
        userId: TEAM_MATE_2_ID,
        points: 500,
        activeCard: {
          cardId: TEAM_MATE_2_CARD_ID,
          points: 400,
        },
        isOnline: true,
      },
      {
        userId: TEAM_MATE_3_ID,
        points: 200,
        activeCard: {
          cardId: TEAM_MATE_3_CARD_ID,
          points: 200,
        },
        isOnline: true,
      },
    ],
  },
  challengeStatesData: {
    isEnabled: true,
    challengeStatuses: mockChallengesToChallengeStatuses(mockedChallenges),
  },
};

const defaultMatchEndMessage = {
  group,
  players: defaultGameInit.matchStateData?.players?.map((player) => ({
    ...player,
    bestPlay: {
      cardId: player.activeCard?.cardId,
      points: player.activeCard?.points,
    },
  })),
  bestCard: {
    succeedingCard: {
      userId: LOCAL_PLAYER_ID,
      cardId: LOCAL_PLAYER_CARD_ID,
      points: 500,
      groupId: group.id,
      bestPlay: {
        cardId: LOCAL_PLAYER_CARD_ID,
        points: 500,
      },
    },
  },
  challengeStatuses: mockChallengesToChallengeStatuses([
    { ...mockedChallenge1, status: 'success' },
    { ...mockedChallenge2, status: 'failure' },
    { ...mockedChallenge3, status: 'failure' },
  ]),
};

const mockCardGameDefaultData = {
  gameId: GAME_ID,
  challengeIds: mockedChallengesIds,
  players: [
    {
      playerId: LOCAL_PLAYER_ID,
      isLocalPlayer: true,
      cardId: LOCAL_PLAYER_CARD_ID,
      boosterId: localPlayerHeldBoosterId,
      appliedBoosterIds: [BoosterType.GoodCall, BoosterType.Scavenge],
    },
    {
      playerId: TEAM_MATE_1_ID,
      cardId: TEAM_MATE_1_CARD_ID,
      boosterId: teamMate1HeldBoosterId,
      appliedBoosterIds: [BoosterType.SpeedUp, BoosterType.NextUp],
    },
    {
      playerId: TEAM_MATE_2_ID,
      cardId: TEAM_MATE_2_CARD_ID,
    },
    {
      playerId: TEAM_MATE_3_ID,
      cardId: TEAM_MATE_3_CARD_ID,
    },
  ],
  cardSelectActiveCardId: LOCAL_PLAYER_CARD_ID,
  handCardIds,
  matchCardIds,
  channelId: CHANNEL_ID,
  matchEndMessage: defaultMatchEndMessage,
};

const activeMatchState = {
  ...defaultGameInit,
  matchStateData: {
    ...defaultGameInit.matchStateData,
    streamState: {
      matchState: StreamStateMatchState.MATCH_STATE_ACTIVE,
    },
  },
};

const WithMatchEnd: StoryFn<Props> = (args) => {
  const [showMatchEnd, setShowMatchEnd] = useState(false);
  const gameState = useCardGameState();

  useEffect(() => {
    if (!gameState) {
      return;
    }

    const onMatchEnded = () => setShowMatchEnd(true);
    const onMatchEndedCompleted = () => setShowMatchEnd(false);

    gameState.addListener('onMatchEnded', onMatchEnded);
    gameState.addListener('onCinematicEnded', onMatchEndedCompleted);

    return () => {
      gameState.removeListener('onMatchEnded', onMatchEnded);
      gameState.removeListener('onCinematicEnded', onMatchEndedCompleted);
    };
  }, [gameState]);

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <CardGame
        {...args}
        showMatchEnd={showMatchEnd}
      />
    </div>
  );
};

export default {
  title: 'CardGame',
  component: CardGame,
  decorators: [
    withAuthProvider({
      userId: LOCAL_PLAYER_ID,
    }),
    withFakeStadium(),
    (Story) => (
      <MockMatchEndProvider
        matchEndMsg={defaultMatchEndMessage}
        matchRewards={{
          walletRewards: {
            currencyType: WalletCurrencyId.SoftCurrency,
            received: 1000,
            receivedExcludingBonuses: 500,
            participationBonus: 250,
            teamPlayerBonus: 250,
          },
          xpRewards: {
            newTotal: 2000,
            received: 1000,
            receivedExcludingBonuses: 750,
            remainingDailyBoost: 100,
            dailyBoost: 500,
            teamPlayerBonus: 0,
            participationBonus: 250,
          },
          levelRewards: {
            oldLevel: 3,
            newLevel: 4,
            levelThresholds: [100, 200, 300, 400, 500],
          },
        }}
      >
        <Story />
      </MockMatchEndProvider>
    ),
    withTriggerEvents(mockMatchGroup, [LOCAL_PLAYER_ID, TEAM_MATE_1_ID]),
    withEventPayload(mockMatchGroup, {
      onHandShuffled: {
        cardIds: handCardIds,
        matchEndCardIds: matchCardIds,
        userId: LOCAL_PLAYER_ID,
      },
      onAonPointsCollected: {
        cardId: LOCAL_PLAYER_CARD_ID,
      },
      onActiveCardSucceeded: {
        points: 500,
        boosterPoints: [
          {
            boosterId: BoosterType.GoodCall,
            points: 200,
          },
          {
            boosterId: BoosterType.NextUp,
            points: 150,
          },
        ],
      },
      onAvailableChallenges: {
        challengeIds: mockedChallengesIds,
      },
    }),
  ],
  render: WithMatchEnd,
} as Meta<typeof CardGame>;

export const Default = {
  args: {},
  decorators: [withGameState(mockMatchGroup, defaultGameInit, { channelId: CHANNEL_ID })],
  parameters: StoryHelpers.Apollo.addMocks([
    ...createGameInitGQLMocks(defaultGameInit),
    ...mockCardGame(mockCardGameDefaultData),
  ]),
};

export const MatchRunning = {
  args: {},
  decorators: [
    withGameState(mockMatchGroup, activeMatchState, { channelId: CHANNEL_ID }),
  ],
  parameters: StoryHelpers.Apollo.addMocks([
    ...createGameInitGQLMocks(defaultGameInit),
    ...mockCardGame(mockCardGameDefaultData),
  ]),
};

export const ProgressionPaused = {
  args: {},
  decorators: [
    withGameState(mockMatchGroup, activeMatchState, { channelId: CHANNEL_ID }),
  ],
  parameters: StoryHelpers.Apollo.addMocks([
    ...createGameInitGQLMocks(defaultGameInit),
    ...mockCardGame({
      ...mockCardGameDefaultData,
      isProgressionPaused: true,
    }),
  ]),
};

export const Spectator = {
  ...Default,
  args: {
    isSpectatorMode: true,
  },
};

export const RoundCompetition = {
  args: {},
  decorators: [
    withGameState(
      mockMatchGroup,
      {
        ...activeMatchState,
        matchStateData: {
          ...activeMatchState.matchStateData,
          streamState: {
            ...activeMatchState.matchStateData.streamState,
            roundPhase: StreamStateRoundPhase.ROUND_PHASE_COMPETITION,
            matchType: StreamStateMatchType.MATCH_TYPE_MULTI_ROUND,
          },
        },
      },
      { channelId: CHANNEL_ID },
    ),
  ],
  parameters: StoryHelpers.Apollo.addMocks([
    ...createGameInitGQLMocks(defaultGameInit),
    ...mockCardGame(mockCardGameDefaultData),
  ]),
};

export const RoundEnded = {
  args: {},
  decorators: [
    withGameState(
      mockMatchGroup,
      {
        ...activeMatchState,
        matchStateData: {
          ...activeMatchState.matchStateData,
          streamState: {
            ...activeMatchState.matchStateData.streamState,
            roundPhase: StreamStateRoundPhase.ROUND_PHASE_ENDED,
            matchType: StreamStateMatchType.MATCH_TYPE_MULTI_ROUND,
          },
        },
      },
      { channelId: CHANNEL_ID },
    ),
  ],
  parameters: StoryHelpers.Apollo.addMocks([
    ...createGameInitGQLMocks(defaultGameInit),
    ...mockCardGame(mockCardGameDefaultData),
  ]),
};

export const RoundPreparation = {
  args: {},
  decorators: [
    withGameState(
      mockMatchGroup,
      {
        ...activeMatchState,
        matchStateData: {
          ...activeMatchState.matchStateData,
          streamState: {
            ...activeMatchState.matchStateData.streamState,
            roundPhase: StreamStateRoundPhase.ROUND_PHASE_PREPARATION,
            matchType: StreamStateMatchType.MATCH_TYPE_MULTI_ROUND,
            roundPhaseDeadline: `${new Date().getTime() + 17000}`,
          },
        },
      },
      { channelId: CHANNEL_ID },
    ),
  ],
  parameters: StoryHelpers.Apollo.addMocks([
    ...createGameInitGQLMocks(defaultGameInit),
    ...mockCardGame(mockCardGameDefaultData),
  ]),
};

const WithSetChallenge = (args: Props) => {
  useEffect(() => {
    mockMatchGroup.triggerEvent('onSetActiveChallenge', {
      userId: LOCAL_PLAYER_ID,
      challengeId: '1',
    });
    // @todo remove this since it's a hack to trigger the available challenges data
    // so that VFX stuff can be worked on
    mockMatchGroup.requestChallenges();
  }, []);

  return <WithMatchEnd {...args} />;
};

const challengesEnabledActiveMatchState = {
  ...activeMatchState,
  challengeStatesData: {
    isEnabled: true,
    challengeStatuses: mockChallengesToChallengeStatuses(mockedChallenges),
  },
};

export const ChallengesEnabledMatchRunning = {
  args: {},
  render: WithSetChallenge,
  decorators: [
    withGameState(mockMatchGroup, challengesEnabledActiveMatchState, {
      channelId: CHANNEL_ID,
    }),
  ],
  parameters: StoryHelpers.Apollo.addMocks([
    ...createGameInitGQLMocks(defaultGameInit),
    ...mockCardGame(mockCardGameDefaultData),
  ]),
};

const challengesEnabledWaitingState = {
  ...challengesEnabledActiveMatchState,
  matchStateData: {
    ...defaultGameInit.matchStateData,
    streamState: {
      matchState: StreamStateMatchState.MATCH_STATE_ENDED,
    },
  },
};

export const ChallengesEnabledMatchWaiting = {
  args: {},
  decorators: [
    withGameState(mockMatchGroup, challengesEnabledWaitingState, {
      channelId: CHANNEL_ID,
    }),
  ],
  parameters: StoryHelpers.Apollo.addMocks([
    ...createGameInitGQLMocks(defaultGameInit),
    ...mockCardGame(mockCardGameDefaultData),
  ]),
};
