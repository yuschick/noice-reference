/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ConnectionState } from '@noice-com/platform-client';
import { MockMatchGroup } from '@noice-com/platform-client/src/testing';
import * as GameLogic from '@noice-com/schemas/game-logic/game_logic.pb';

import { getMockApolloClient } from '../../__mocks__/apollo';
import * as MockCards from '../../__testdata__/active-cards';
import * as MockBoosters from '../../__testdata__/boosters';
import { FullMatchConfig } from '../../__testdata__/match-config';
import { MockBasicPlayer } from '../../__testdata__/players';
import { CGAvailableBooster } from '../../boosters';
import { CGActiveCard } from '../../card';
import { CGGroup } from '../../group';
import { CGPlayer } from '../../player';
import { CardGame, getBoosterFragmentId } from '../CardGame';
import { GameConfig } from '../GameConfig';

import {
  CgAvailableBoosterFragment,
  GameStateBoostersQuery,
  GameStateBoostersQueryVariables,
  GameStateCardFragment,
  GameStateGameCardQuery,
  GameStateGameCardQueryVariables,
} from '@game-gen';

describe('CardGame', () => {
  const apollo = getMockApolloClient();

  const mockGroupId = 'test-group';
  const mockLocalUserId = 'test-player';

  const mockInitialStateData: GameLogic.MatchStateData = {
    group: {
      name: 'Test Group',
      id: mockGroupId,
      points: 500,
    },
    players: [
      {
        ...MockBasicPlayer,
        userId: mockLocalUserId,
      },
    ],
  };

  beforeAll(() => {
    MockMatchGroup.MockFactory = jest.fn;
  });

  afterAll(() => {
    apollo.__resetAll();
    MockMatchGroup.MockFactory = MockMatchGroup.DefaultMockMethod;
  });

  describe('Connection Management', () => {
    it('should attach to/detach from a connected match group', () => {
      const game = new CardGame(mockLocalUserId, apollo);
      const group = new MockMatchGroup(mockGroupId, mockLocalUserId, game.delegate);

      game.detach();
      expect(group.removeDelegate).toBeCalled();
    });
  });

  describe('Game State Management', () => {
    it('should store the active game configuration', async () => {
      const game = new CardGame(mockLocalUserId, apollo);
      const group = new MockMatchGroup(mockGroupId, mockLocalUserId, game.delegate);

      expect(game.getActiveConfig()).toBeNull();

      await group.triggerEvent('onGameInit', {
        matchConfiguration: FullMatchConfig,
      });

      const config = game.getActiveConfig();
      expect(config).not.toBeNull();
      expect(config).toBeInstanceOf(GameConfig);
    });

    it('should store references to the current active game players', async () => {
      const game = new CardGame(mockLocalUserId, apollo);
      const group = new MockMatchGroup(mockGroupId, mockLocalUserId, game.delegate);

      await group.triggerEvent('onGameInit', {
        matchConfiguration: FullMatchConfig,
        matchStateData: mockInitialStateData,
      });

      const [localPlayerInstance] = game.getPlayers(mockLocalUserId);
      expect(localPlayerInstance).toBeInstanceOf(CGPlayer);
    });

    it('should store references to the current game group', async () => {
      const game = new CardGame(mockLocalUserId, apollo);
      const group = new MockMatchGroup(mockGroupId, mockLocalUserId, game.delegate);

      await group.triggerEvent('onGameInit', {
        matchConfiguration: FullMatchConfig,
        matchStateData: mockInitialStateData,
      });

      const groupInstance = game.getGroup(mockGroupId);
      expect(groupInstance).toBeInstanceOf(CGGroup);
    });

    it('should store and expose the current active cards', async () => {
      apollo.__setQueryMock<GameStateGameCardQuery, GameStateGameCardQueryVariables>(
        CardGame.Queries.gameCardQuery,
        {
          ids: [
            MockCards.BasicCard.cardId!,
            MockCards.DynamicValueCard.cardId!,
            MockCards.TimedCard.cardId!,
          ],
        },
        {
          gameCards: {
            cards: [
              MockCards.activeCardAsFragment(MockCards.BasicCard),
              MockCards.activeCardAsFragment(MockCards.DynamicValueCard),
              MockCards.activeCardAsFragment(MockCards.TimedCard),
            ],
          },
        },
      );

      const game = new CardGame(mockLocalUserId, apollo);
      const group = new MockMatchGroup(mockGroupId, mockLocalUserId, game.delegate);

      await group.triggerEvent('onGameInit', {
        userId: mockLocalUserId,
        matchConfiguration: FullMatchConfig,
        matchStateData: {
          ...mockInitialStateData,
          players: [
            {
              userId: mockLocalUserId,
              points: 500,
              activeCard: {
                ...MockCards.BasicCard,
              },
            },
            {
              userId: 'player-2',
              points: 0,
              activeCard: {
                ...MockCards.DynamicValueCard,
              },
            },
            {
              userId: 'player-3',
              points: 0,
              activeCard: {
                ...MockCards.TimedCard,
              },
            },
          ],
        },
      });

      expect(game.getPlayerActiveCard(mockLocalUserId)).toBeDefined();
      expect(game.getPlayerActiveCard('player-2')).toBeDefined();
      expect(game.getPlayerActiveCard('player-3')).toBeDefined();
    });

    it('should store and expose the current available boosters', async () => {
      apollo.__setQueryMock<GameStateBoostersQuery, GameStateBoostersQueryVariables>(
        CardGame.Queries.boosterQuery,
        {
          id: MockBoosters.StandardBooster.id!,
        },
        {
          booster: MockBoosters.boosterAsFragment(MockBoosters.StandardBooster),
        },
      );
      apollo.__setFragmentMock<CgAvailableBoosterFragment>(
        CGAvailableBooster.Fragments.availableBooster,
        getBoosterFragmentId(MockBoosters.StandardBooster.id!),
        MockBoosters.boosterAsFragment(MockBoosters.StandardBooster),
      );

      const game = new CardGame(mockLocalUserId, apollo);
      const group = new MockMatchGroup(mockGroupId, mockLocalUserId, game.delegate);

      await group.triggerEvent('onGameInit', {
        userId: mockLocalUserId,
        matchConfiguration: FullMatchConfig,
        matchData: {
          boosters: [MockBoosters.StandardBooster],
        },
        matchStateData: {
          ...mockInitialStateData,
          players: [
            {
              userId: mockLocalUserId,
              points: 300,
              heldBoosterId: MockBoosters.StandardBooster.id!,
            },
            {
              userId: 'player-2',
              points: 500,
            },
          ],
        },
      });

      expect(game.getPlayerAvailableBooster(mockLocalUserId)).toBeDefined();
      expect(game.getPlayerAvailableBooster('player-2')).not.toBeDefined();
    });

    it('should provide helpers for getting the local group and player', async () => {
      const game = new CardGame(mockLocalUserId, apollo);
      const group = new MockMatchGroup(mockGroupId, mockLocalUserId, game.delegate);

      await group.triggerEvent('onGameInit', {
        userId: mockLocalUserId,
        matchConfiguration: FullMatchConfig,
        matchData: {},
        matchStateData: {
          group: {
            name: 'Test Group',
            id: mockGroupId,
            points: 500,
          },
          players: [
            {
              userId: mockLocalUserId,
              points: 50,
            },
          ],
        },
      });

      expect(game.getLocalPlayer()).toBeInstanceOf(CGPlayer);
      expect(game.getLocalGroup()).toBeInstanceOf(CGGroup);
    });

    it('should include players that are offline', async () => {
      const game = new CardGame(mockLocalUserId, apollo);
      const group = new MockMatchGroup(mockGroupId, mockLocalUserId, game.delegate);
      const teamMateId = 'player-2';

      await group.triggerEvent('onGameInit', {
        userId: mockLocalUserId,
        matchConfiguration: FullMatchConfig,
        matchData: {},
        matchStateData: {
          group: {
            name: 'Test Group',
            id: mockGroupId,
            points: 500,
          },
          players: [
            {
              userId: mockLocalUserId,
              points: 50,
            },
            {
              userId: teamMateId,
              isOnline: false,
            },
          ],
        },
      });

      expect(game.getLocalPlayer()).toBeInstanceOf(CGPlayer);
      expect(game.getLocalGroup()).toBeInstanceOf(CGGroup);
      expect(game.getLocalGroup()?.getGroupPlayers().length).toBe(2);
    });
  });

  describe('Game Event Forwarding', () => {
    it('should forward events to attached partial delegates', async () => {
      const game = new CardGame(mockLocalUserId, apollo);
      const group = new MockMatchGroup(mockGroupId, mockLocalUserId, game.delegate);

      await group.triggerEvent('onGameInit', {
        userId: mockLocalUserId,
        matchConfiguration: FullMatchConfig,
        matchData: {},
        matchStateData: {
          group: {
            name: 'Test Group',
            id: mockGroupId,
            points: 0,
          },
          players: [
            {
              userId: mockLocalUserId,
              points: 0,
            },
          ],
        },
      });

      const delegate = {
        onPlayerPointsUpdated: jest.fn(),
        onActiveCardSet: jest.fn(),
      };
      game.attachDelegate(delegate);

      await group.triggerEvent('onPlayerPointsUpdated', {
        points: 25,
        userId: mockLocalUserId,
        groupId: mockGroupId,
        diff: 25,
      });

      expect(delegate.onPlayerPointsUpdated).toHaveBeenCalledWith(group, {
        points: 25,
        userId: mockLocalUserId,
        groupId: mockGroupId,
        diff: 25,
      });
      expect(delegate.onActiveCardSet).not.toHaveBeenCalled();

      game.detachDelegate(delegate);
    });

    it('should forward player events to the respective player', async () => {
      const game = new CardGame(mockLocalUserId, apollo);
      const group = new MockMatchGroup(mockGroupId, mockLocalUserId, game.delegate);

      await group.triggerEvent('onGameInit', {
        matchConfiguration: FullMatchConfig,
        matchStateData: {
          ...mockInitialStateData,
          players: [
            {
              userId: mockLocalUserId,
              points: 0,
            },
            {
              userId: 'teammate',
              points: 50,
            },
          ],
        },
      });

      const [localPlayer, teammate] = game.getPlayers(mockLocalUserId, 'teammate');
      expect(localPlayer.score).toEqual(0);
      expect(teammate.score).toEqual(50);

      await group.triggerEvent('onPlayerPointsUpdated', {
        points: 25,
        userId: mockLocalUserId,
        groupId: mockGroupId,
        diff: 25,
      });
      expect(localPlayer.score).toEqual(25);
      expect(teammate.score).toEqual(50);
    });

    it('should forward group events to the respective group', async () => {
      const game = new CardGame(mockLocalUserId, apollo);
      const group = new MockMatchGroup(mockGroupId, mockLocalUserId, game.delegate);

      await group.triggerEvent('onGameInit', {
        userId: mockLocalUserId,
        matchConfiguration: FullMatchConfig,
        matchStateData: {
          ...mockInitialStateData,
          group: {
            ...mockInitialStateData.group,
            points: 0,
          },
        },
      });

      const gameGroup = game.getGroup(mockGroupId);
      expect(gameGroup!.score).toEqual(0);

      await group.triggerEvent('onGroupPointsUpdated', {
        points: 500,
        diff: 500,
        groupId: mockGroupId,
        userId: mockLocalUserId,
      });

      expect(gameGroup!.score).toEqual(500);
    });

    it('should forward card events to the respective card', async () => {
      apollo.__setQueryMock<GameStateGameCardQuery, GameStateGameCardQueryVariables>(
        CardGame.Queries.gameCardQuery,
        { ids: [MockCards.BasicCard.cardId!] },
        { gameCards: { cards: [MockCards.activeCardAsFragment(MockCards.BasicCard)] } },
      );
      const game = new CardGame(mockLocalUserId, apollo);
      const group = new MockMatchGroup(mockGroupId, mockLocalUserId, game.delegate);

      await group.triggerEvent('onGameInit', {
        matchConfiguration: FullMatchConfig,
        matchStateData: {
          ...mockInitialStateData,
          players: [
            {
              userId: mockLocalUserId,
              points: 0,
              activeCard: {
                ...MockCards.BasicCard,
              },
            },
          ],
        },
      });

      const playerCard = game.getPlayerActiveCard(mockLocalUserId);
      expect(playerCard?.currentPoints).toEqual(MockCards.BasicCard.points);

      const newPoints = MockCards.BasicCard.points! + 20;
      await group.triggerEvent('onActiveCardPointsUpdated', {
        userId: mockLocalUserId,
        cardId: MockCards.BasicCard.cardId!,
        points: newPoints,
        pointsUpdateDuration: `5000`,
      });

      expect(playerCard?.currentPoints).toEqual(newPoints);
    });
  });

  describe('Game Event Handling', () => {
    describe('Match / Game Events', () => {
      it('onConnectionStatusChanged: should adjust connection state', async () => {
        const game = new CardGame(mockLocalUserId, apollo);
        // Initial state...
        expect(game.connectionState).toEqual(ConnectionState.DISCONNECTED);
        expect(game.connected).toEqual(false);

        const group = new MockMatchGroup(mockGroupId, mockLocalUserId, game.delegate);

        // Once attached...
        expect(game.connectionState).toEqual(ConnectionState.CONNECTED);
        expect(game.connected).toEqual(true);

        /// Externally updated via server...
        await group.triggerEvent('onConnectionStatusChanged', {
          state: ConnectionState.RECONNECTING,
        });
        expect(game.connectionState).toEqual(ConnectionState.RECONNECTING);

        // After detaching...
        game.detach();
        expect(game.connectionState).toEqual(ConnectionState.DISCONNECTED);
      });

      it('onGameInit: should initialize match configs, groups, cards, players and best plays', async () => {
        apollo.__setQueryMock<GameStateGameCardQuery, GameStateGameCardQueryVariables>(
          CardGame.Queries.gameCardQuery,
          { ids: [MockCards.BasicCard.cardId!] },
          { gameCards: { cards: [MockCards.activeCardAsFragment(MockCards.BasicCard)] } },
        );

        const game = new CardGame(mockLocalUserId, apollo);
        const group = new MockMatchGroup(mockGroupId, mockLocalUserId, game.delegate);

        await group.triggerEvent('onGameInit', {
          matchConfiguration: FullMatchConfig,
          matchStateData: {
            streamState: {
              matchState: GameLogic.StreamStateMatchState.MATCH_STATE_ACTIVE,
            },
            group: {
              name: 'Test Group',
              id: mockGroupId,
              points: 300,
            },
            players: [
              {
                userId: mockLocalUserId,
                points: 300,
                activeCard: {
                  ...MockCards.BasicCard,
                },
                bestPlay: {
                  cardId: MockCards.BasicCard.cardId!,
                  points: 300,
                },
              },
            ],
          },
        });

        // Make sure config exists.
        const config = game.getActiveConfig();
        expect(config).toBeDefined();
        expect(config?.missingConfigs).toHaveLength(0);

        // Make sure group exists.
        const playerGroup = game.getGroup(mockGroupId);
        expect(playerGroup).toBeDefined();
        expect(playerGroup).toBeInstanceOf(CGGroup);

        // Make sure player exists.
        const [localPlayer] = game.getPlayers(mockLocalUserId);
        expect(localPlayer).toBeDefined();
        expect(localPlayer).toBeInstanceOf(CGPlayer);

        // Make sure card exists.
        const playerCard = game.getPlayerActiveCard(mockLocalUserId);
        expect(playerCard).toBeDefined();
        expect(playerCard).toBeInstanceOf(CGActiveCard);

        // Make sure best play exists.
        const bestPlayCard = game.getPlayerBestPlay(mockLocalUserId);
        expect(bestPlayCard).toBeDefined();
        expect(bestPlayCard).toBeInstanceOf(CGActiveCard);
        expect(bestPlayCard?.currentPoints).toEqual(300);

        // Make sure it has set the match state to active.
        expect(game.matchRunning).toEqual(true);
        expect(game.matchState).toEqual(
          GameLogic.StreamStateMatchState.MATCH_STATE_ACTIVE,
        );
      });

      it('onMatchStarted: should ensure local group and store match has started', async () => {
        const game = new CardGame(mockLocalUserId, apollo);
        const group = new MockMatchGroup(mockGroupId, mockLocalUserId, game.delegate);

        await group.triggerEvent('onGameInit', {
          matchConfiguration: FullMatchConfig,
          matchStateData: {
            streamState: {
              matchState: GameLogic.StreamStateMatchState.MATCH_STATE_UNSPECIFIED,
            },
            group: {
              name: 'Test Group',
              id: 'incorrect-group-id',
              points: 0,
            },
            players: [
              {
                userId: mockLocalUserId,
                points: 0,
              },
            ],
          },
        });

        expect(game.matchRunning).toEqual(false);
        expect(game.matchState).toEqual(
          GameLogic.StreamStateMatchState.MATCH_STATE_UNSPECIFIED,
        );
        expect(game.localGroupId).not.toEqual(mockGroupId);

        await group.triggerEvent('onMatchStarted', {
          groupId: mockGroupId,
          streamId: 'stream-id',
        });
        expect(game.matchRunning).toEqual(true);
        expect(game.localGroupId).toEqual(mockGroupId);
      });

      it('onMatchEnded: should store that match is not active', async () => {
        const game = new CardGame(mockLocalUserId, apollo);
        const group = new MockMatchGroup(mockGroupId, mockLocalUserId, game.delegate);

        await group.triggerEvent('onGameInit', {
          matchConfiguration: FullMatchConfig,
          matchStateData: {
            streamState: {
              matchState: GameLogic.StreamStateMatchState.MATCH_STATE_ACTIVE,
            },
            group: {
              name: 'Test Group',
              id: mockGroupId,
              points: 0,
            },
            players: [
              {
                userId: mockLocalUserId,
                points: 0,
              },
            ],
          },
        });

        expect(game.matchRunning).toEqual(true);
        expect(game.matchState).toEqual(
          GameLogic.StreamStateMatchState.MATCH_STATE_ACTIVE,
        );

        await group.triggerEvent('onMatchEnded', {});
        expect(game.matchRunning).toEqual(false);
        expect(game.matchState).toEqual(
          GameLogic.StreamStateMatchState.MATCH_STATE_ENDED,
        );
      });
    });

    describe('Card events', () => {
      const apollo = getMockApolloClient();

      apollo.__setFragmentMock<GameStateCardFragment>(
        CGActiveCard.Fragments.activeCardState,
        `GameLogicCard:${MockCards.BasicCard.cardId!}`,
        {
          ...MockCards.activeCardAsFragment(MockCards.BasicCard),
        },
      );
      apollo.__setQueryMock<GameStateGameCardQuery, GameStateGameCardQueryVariables>(
        CardGame.Queries.gameCardQuery,
        {
          ids: MockCards.BasicCard.cardId!,
        },
        {
          gameCards: {
            cards: [{ ...MockCards.activeCardAsFragment(MockCards.BasicCard) }],
          },
        },
      );

      // @todo: onCardDealingStarted / onCardDealingEnded events are basically already
      // tested due to the card game player tests. However, if we feel we should include
      // them here for safety, we can add them. However it involves trying to figure out
      // how to validate with the mock Apollo client that a query has in fact been called,
      // since onCardDealingStarted specifically triggers a query to prefetch the card data.

      it('onActiveCardSet: should create and store an instance of an active card', async () => {
        const game = new CardGame(mockLocalUserId, apollo);
        const group = new MockMatchGroup(mockGroupId, mockLocalUserId, game.delegate);

        await group.triggerEvent('onGameInit', {
          matchConfiguration: FullMatchConfig,
          matchStateData: {
            group: {
              name: 'Test Group',
              id: mockGroupId,
              points: 0,
            },
            players: [
              {
                userId: mockLocalUserId,
                points: 0,
              },
            ],
          },
        });

        const [player] = game.getPlayers(mockLocalUserId);
        expect(player.activeCardID).toEqual(null);
        expect(game.getPlayerActiveCard(mockLocalUserId)).not.toBeDefined();

        await group.triggerEvent('onActiveCardSet', {
          cardId: MockCards.BasicCard.cardId,
          userId: mockLocalUserId,
          pointsUpdateDuration: `5000`,
          // @todo: AON
        });

        expect(player.activeCardID).toEqual(MockCards.BasicCard.cardId);
        const card = game.getPlayerActiveCard(mockLocalUserId);
        expect(card).toBeDefined();
        expect(card?.frozen).toBeFalsy();
        expect(card?.cardId).toEqual(MockCards.BasicCard.cardId);
      });

      it('onActiveCardSet: should take in count if allOrNothing card set', async () => {
        const game = new CardGame(mockLocalUserId, apollo);
        const group = new MockMatchGroup(mockGroupId, mockLocalUserId, game.delegate);

        await group.triggerEvent('onGameInit', {
          matchConfiguration: FullMatchConfig,
          matchStateData: {
            group: {
              name: 'Test Group',
              id: mockGroupId,
              points: 0,
            },
            players: [
              {
                userId: mockLocalUserId,
                points: 0,
                allOrNothing: {
                  cardId: MockCards.BasicCard.cardId,
                  totalPoints: 0,
                  nextPoints: 50,
                },
              },
            ],
          },
        });

        const [player] = game.getPlayers(mockLocalUserId);
        expect(player.activeCardID).toEqual(null);
        expect(game.getPlayerActiveCard(mockLocalUserId)).not.toBeDefined();

        const aonNextPoints = 100;

        await group.triggerEvent('onActiveCardSet', {
          cardId: MockCards.BasicCard.cardId,
          userId: mockLocalUserId,
          pointsUpdateDuration: `5000`,
          allOrNothing: {
            cardId: MockCards.BasicCard.cardId,
            totalPoints: 50,
            nextPoints: aonNextPoints,
          },
          // @todo: AON
        });

        expect(player.activeCardID).toEqual(MockCards.BasicCard.cardId);
        const card = game.getPlayerActiveCard(mockLocalUserId);
        expect(card).toBeDefined();
        expect(card?.frozen).toBeFalsy();
        expect(card?.cardId).toEqual(MockCards.BasicCard.cardId);
        expect(card?.currentPoints).toEqual(aonNextPoints);
        expect(card?.maxPoints).toEqual(aonNextPoints);
      });

      it('onActiveCardPointsUpdated: should forward point updates to the appropriate card', async () => {
        const game = new CardGame(mockLocalUserId, apollo);
        const group = new MockMatchGroup(mockGroupId, mockLocalUserId, game.delegate);

        const initialPoints = 50;
        const nextPoints = 75;

        await group.triggerEvent('onGameInit', {
          userId: mockLocalUserId,
          matchConfiguration: FullMatchConfig,
          matchStateData: {
            group: { ...mockInitialStateData.group },
            players: [
              {
                userId: mockLocalUserId,
                points: 0,
                activeCard: {
                  ...MockCards.BasicCard,
                  points: initialPoints,
                },
              },
            ],
          },
        });

        const card = game.getPlayerActiveCard(mockLocalUserId);
        expect(card).toBeDefined();
        expect(card?.currentPoints).toEqual(initialPoints);

        await group.triggerEvent('onActiveCardPointsUpdated', {
          userId: mockLocalUserId,
          cardId: MockCards.BasicCard.cardId!,
          points: nextPoints,
          pointsUpdateDuration: '5000',
        });

        expect(card?.currentPoints).toEqual(nextPoints);
      });

      it('onActiveCardTargetValueChanged: should forward timers and dynamic value changes to cards', async () => {
        const game = new CardGame(mockLocalUserId, apollo);
        const group = new MockMatchGroup(mockGroupId, mockLocalUserId, game.delegate);

        const initialValue = 100;
        const nextValue = 95;

        // @todo: Here we handle only the easiest 'targetValue' stuff to test,
        // for the more in-depth cases that cover the harder to test stuff (ie. timers)
        // please check the active card unit tests.

        await group.triggerEvent('onGameInit', {
          userId: mockLocalUserId,
          matchConfiguration: FullMatchConfig,
          matchStateData: {
            group: { ...mockInitialStateData.group },
            players: [
              {
                userId: mockLocalUserId,
                points: 0,
                activeCard: {
                  ...MockCards.DynamicValueCard,
                  targetValue: initialValue,
                },
              },
            ],
          },
        });

        const card = game.getPlayerActiveCard(mockLocalUserId);
        expect(card).toBeDefined();
        expect(card?.currentTargetValue).toEqual(initialValue);

        await group.triggerEvent('onActiveCardTargetValueChanged', {
          userId: mockLocalUserId,
          cardId: MockCards.DynamicValueCard.cardId!,
          targetValue: nextValue,
        });

        expect(card?.currentTargetValue).toEqual(nextValue);
      });

      it('onActiveCardSucceeded: should remove the currently active card and timer', async () => {
        const game = new CardGame(mockLocalUserId, apollo);
        const group = new MockMatchGroup(mockGroupId, mockLocalUserId, game.delegate);

        await group.triggerEvent('onGameInit', {
          userId: mockLocalUserId,
          matchConfiguration: FullMatchConfig,
          matchStateData: {
            group: { ...mockInitialStateData.group },
            players: [
              {
                userId: mockLocalUserId,
                points: 0,
                cardSwitchOutTimer: {
                  startTime: `${Date.now()}`,
                  endTime: `${Date.now() + 3000}`,
                },
                activeCard: {
                  ...MockCards.BasicCard,
                },
              },
            ],
          },
        });

        const player = game.getPlayer(mockLocalUserId);
        expect(player).toBeDefined();
        expect(player?.activeCardID).toEqual(MockCards.BasicCard.cardId);
        const card = game.getPlayerActiveCard(mockLocalUserId);
        expect(card).toBeDefined();
        expect(player?.switchoutTimer).not.toBeNull();

        await group.triggerEvent('onActiveCardSucceeded', {
          userId: mockLocalUserId,
          cardId: MockCards.BasicCard.cardId!,
          points: 300,
        });

        expect(card?.frozen).toEqual(true);
        expect(game.getPlayerActiveCard(mockLocalUserId)).not.toBeDefined();
        expect(player?.activeCardID).toBeNull();
        expect(player?.switchoutTimer).toBeNull();
      });

      it('onActiveCardSucceeded: should trigger the listener only for the succeeded card', async () => {
        const game = new CardGame(mockLocalUserId, apollo);
        const group = new MockMatchGroup(mockGroupId, mockLocalUserId, game.delegate);

        await group.triggerEvent('onGameInit', {
          userId: mockLocalUserId,
          matchConfiguration: FullMatchConfig,
          matchStateData: {
            group: { ...mockInitialStateData.group },
            players: [
              {
                userId: mockLocalUserId,
                points: 0,
                cardSwitchOutTimer: {
                  startTime: `${Date.now()}`,
                  endTime: `${Date.now() + 3000}`,
                },
                activeCard: {
                  ...MockCards.BasicCard,
                },
              },
              {
                userId: MockBasicPlayer.userId,
                points: 0,
                cardSwitchOutTimer: {
                  startTime: `${Date.now()}`,
                  endTime: `${Date.now() + 3000}`,
                },
                activeCard: {
                  ...MockCards.BasicCard,
                },
              },
            ],
          },
        });

        const player = game.getPlayer(mockLocalUserId);
        expect(player).toBeDefined();

        const card1 = game.getPlayerActiveCard(mockLocalUserId);
        expect(card1).toBeDefined();

        const card2 = game.getPlayerActiveCard(MockBasicPlayer.userId!);
        expect(card2).toBeDefined();

        const cardSucceedsListener1 = jest.fn();
        card1!.addListener('onSucceeded', cardSucceedsListener1);

        const cardSucceedsListener2 = jest.fn();
        card2!.addListener('onSucceeded', cardSucceedsListener2);

        await group.triggerEvent('onActiveCardSucceeded', {
          userId: mockLocalUserId,
          cardId: MockCards.BasicCard.cardId!,
          points: 300,
        });

        expect(cardSucceedsListener1).toHaveBeenCalled();
        expect(cardSucceedsListener2).not.toBeCalled();
        expect(card1?.frozen).toEqual(true);
        expect(card2?.frozen).toEqual(false);
      });

      it('onActiveCardSucceeded: should update best plays if card was a best play', async () => {
        const game = new CardGame(mockLocalUserId, apollo);
        const group = new MockMatchGroup(mockGroupId, mockLocalUserId, game.delegate);

        await group.triggerEvent('onGameInit', {
          userId: mockLocalUserId,
          matchConfiguration: FullMatchConfig,
          matchStateData: {
            group: { ...mockInitialStateData.group },
            players: [
              {
                userId: mockLocalUserId,
                points: 0,
                activeCard: {
                  ...MockCards.BasicCard,
                },
              },
            ],
          },
        });

        const player = game.getPlayer(mockLocalUserId);
        expect(player).toBeDefined();
        expect(player?.activeCardID).toEqual(MockCards.BasicCard.cardId);
        const card = game.getPlayerActiveCard(mockLocalUserId);
        expect(card).toBeDefined();

        await group.triggerEvent('onActiveCardSucceeded', {
          userId: mockLocalUserId,
          cardId: MockCards.BasicCard.cardId!,
          points: 331,
          bestPlay: {
            cardId: MockCards.BasicCard.cardId!,
            points: 331,
          },
        });

        expect(card?.frozen).toEqual(true);
        expect(game.getPlayerActiveCard(mockLocalUserId)).not.toBeDefined();
        expect(game.getPlayerBestPlay(mockLocalUserId)?.currentPoints).toEqual(331);
        expect(card?.currentPoints).toEqual(331);
        expect(player?.activeCardID).toBeNull();
        expect(player?.switchoutTimer).toBeNull();
      });

      it('onActiveCardSucceeded: should update best plays if player got more points', async () => {
        const game = new CardGame(mockLocalUserId, apollo);
        const group = new MockMatchGroup(mockGroupId, mockLocalUserId, game.delegate);

        await group.triggerEvent('onGameInit', {
          userId: mockLocalUserId,
          matchConfiguration: FullMatchConfig,
          matchStateData: {
            group: { ...mockInitialStateData.group },
            players: [
              {
                userId: mockLocalUserId,
                points: 200,
                activeCard: {
                  ...MockCards.BasicCard,
                },
                bestPlay: {
                  cardId: MockCards.TimedCard.cardId,
                  points: 200,
                },
              },
            ],
          },
        });

        const player = game.getPlayer(mockLocalUserId);
        expect(player).toBeDefined();
        expect(player?.activeCardID).toEqual(MockCards.BasicCard.cardId);
        const card = game.getPlayerActiveCard(mockLocalUserId);
        expect(game.getPlayerBestPlay(mockLocalUserId)?.currentPoints).toEqual(200);
        expect(card).toBeDefined();

        await group.triggerEvent('onActiveCardSucceeded', {
          userId: mockLocalUserId,
          cardId: MockCards.BasicCard.cardId!,
          points: 331,
        });

        expect(card?.frozen).toEqual(true);
        expect(game.getPlayerActiveCard(mockLocalUserId)).not.toBeDefined();
        expect(game.getPlayerBestPlay(mockLocalUserId)?.currentPoints).toEqual(331);
        expect(card?.currentPoints).toEqual(331);
        expect(player?.activeCardID).toBeNull();
        expect(player?.switchoutTimer).toBeNull();
      });

      it('onActiveCardFailed: should remove the currently active card and timer', async () => {
        const game = new CardGame(mockLocalUserId, apollo);
        const group = new MockMatchGroup(mockGroupId, mockLocalUserId, game.delegate);

        await group.triggerEvent('onGameInit', {
          userId: mockLocalUserId,
          matchConfiguration: FullMatchConfig,
          matchStateData: {
            group: { ...mockInitialStateData.group },
            players: [
              {
                userId: mockLocalUserId,
                points: 0,
                cardSwitchOutTimer: {
                  startTime: `${Date.now()}`,
                  endTime: `${Date.now() + 3000}`,
                },
                activeCard: {
                  ...MockCards.BasicCard,
                },
              },
            ],
          },
        });

        const player = game.getPlayer(mockLocalUserId);
        expect(player).toBeDefined();
        expect(player?.activeCardID).toEqual(MockCards.BasicCard.cardId);
        const card = game.getPlayerActiveCard(mockLocalUserId);
        expect(card).toBeDefined();
        expect(player?.switchoutTimer).not.toBeNull();

        await group.triggerEvent('onActiveCardFailed', {
          userId: mockLocalUserId,
          cardId: MockCards.BasicCard.cardId!,
          reason: GameLogic.ActiveCardFailedMsgReason.REASON_CARD_FAILED,
        });

        expect(card?.frozen).toEqual(true);
        expect(game.getPlayerActiveCard(mockLocalUserId)).not.toBeDefined();
        expect(player?.activeCardID).toBeNull();
        expect(player?.switchoutTimer).toBeNull();
      });
    });

    describe('Player Events', () => {
      it('onPlayerJoined: should create and store an instance of a new player', async () => {
        const game = new CardGame(mockLocalUserId, apollo);
        const group = new MockMatchGroup(mockGroupId, mockLocalUserId, game.delegate);

        await group.triggerEvent('onGameInit', {
          matchConfiguration: FullMatchConfig,
          matchStateData: mockInitialStateData,
        });

        const userId = 'test-new-player';

        expect(game.getPlayer(userId)).toEqual(null);
        expect(game.getLocalGroup()?.getPlayerIds()).not.toContain(userId);

        await group.triggerEvent('onPlayerJoined', {
          player: {
            ...MockBasicPlayer,
            userId,
          },
          userId,
          groupId: mockGroupId,
        });
        expect(game.getPlayer(userId)).not.toEqual(null);
        expect(game.getLocalGroup()?.getPlayerIds()).toContain(userId);
      });

      it('onPlayerLeft: should not remove the respective player if not permanent', async () => {
        const game = new CardGame(mockLocalUserId, apollo);
        const group = new MockMatchGroup(mockGroupId, mockLocalUserId, game.delegate);

        const leavingUserId = 'test-user-permanent';

        await group.triggerEvent('onGameInit', {
          matchConfiguration: FullMatchConfig,
          matchStateData: {
            ...mockInitialStateData,
            players: [
              ...mockInitialStateData.players!,
              {
                ...MockBasicPlayer,
                points: 300,
                userId: leavingUserId,
                bestPlay: {
                  cardId: MockCards.BasicCard.cardId!,
                  points: 300,
                },
              },
            ],
          },
        });

        expect(game.getPlayer(leavingUserId)).not.toEqual(null);
        expect(game.getLocalGroup()?.getPlayerIds()).toContain(leavingUserId);

        await group.triggerEvent('onPlayerLeft', {
          userId: leavingUserId,
          groupId: mockGroupId,
          permanent: false,
        });

        expect(game.getPlayer(leavingUserId)).not.toEqual(null);
        expect(game.getLocalGroup()?.getPlayerIds()).toContain(leavingUserId);
        expect(game.getPlayerBestPlay(leavingUserId)).not.toEqual(undefined);
      });

      it('onPlayerLeft: should remove the respective player if permanent leave', async () => {
        const game = new CardGame(mockLocalUserId, apollo);
        const group = new MockMatchGroup(mockGroupId, mockLocalUserId, game.delegate);

        const leavingUserId = 'test-user-permanent';

        await group.triggerEvent('onGameInit', {
          matchConfiguration: FullMatchConfig,
          matchStateData: {
            ...mockInitialStateData,
            players: [
              ...mockInitialStateData.players!,
              {
                ...MockBasicPlayer,
                points: 300,
                userId: leavingUserId,
                bestPlay: {
                  cardId: MockCards.BasicCard.cardId!,
                  points: 300,
                },
              },
            ],
          },
        });

        expect(game.getPlayer(leavingUserId)).not.toEqual(null);
        expect(game.getLocalGroup()?.getPlayerIds()).toContain(leavingUserId);

        await group.triggerEvent('onPlayerLeft', {
          userId: leavingUserId,
          groupId: mockGroupId,
          permanent: true,
        });

        expect(game.getPlayer(leavingUserId)).toEqual(null);
        expect(game.getLocalGroup()?.getPlayerIds()).not.toContain(leavingUserId);
        expect(game.getPlayerBestPlay(leavingUserId)).toEqual(undefined);
      });

      it('onPlayerPointsUpdated: should forward the event to the respective player', async () => {
        const game = new CardGame(mockLocalUserId, apollo);
        const group = new MockMatchGroup(mockGroupId, mockLocalUserId, game.delegate);

        await group.triggerEvent('onGameInit', {
          matchConfiguration: FullMatchConfig,
          matchStateData: {
            ...mockInitialStateData,
            players: [
              {
                ...MockBasicPlayer,
                userId: mockLocalUserId,
                points: 0,
              },
            ],
          },
        });

        const player = game.getPlayer(mockLocalUserId);
        expect(player?.score).toEqual(0);

        await group.triggerEvent('onPlayerPointsUpdated', {
          userId: mockLocalUserId,
          groupId: mockGroupId,
          points: 300,
        });

        expect(player?.score).toEqual(300);
      });

      it('onCardSwitchOutTimerStarted: should forward an event to the respective player', async () => {
        const game = new CardGame(MockBasicPlayer.userId!, apollo);
        const group = new MockMatchGroup(
          mockGroupId,
          MockBasicPlayer.userId!,
          game.delegate,
        );

        await group.triggerEvent('onGameInit', {
          matchConfiguration: FullMatchConfig,
          matchStateData: {
            ...mockInitialStateData,
            players: [{ ...MockBasicPlayer }],
          },
        });

        const player = game.getPlayer(MockBasicPlayer.userId!);
        expect(player?.switchoutTimer).toBeNull();

        const startTime = Date.now();
        const endTime = startTime + 300;

        await group.triggerEvent('onCardSwitchOutTimerStarted', {
          userId: MockBasicPlayer.userId,
          groupId: mockGroupId,
          startTime: `${startTime}`,
          endTime: `${endTime}`,
        });

        expect(player?.switchoutTimer).not.toBeNull();
      });

      it('onCardSwitchOutAvailable: should forward an event to the respective player', async () => {
        const game = new CardGame(MockBasicPlayer.userId!, apollo);
        const group = new MockMatchGroup(
          mockGroupId,
          MockBasicPlayer.userId!,
          game.delegate,
        );

        await group.triggerEvent('onGameInit', {
          matchConfiguration: FullMatchConfig,
          matchStateData: {
            ...mockInitialStateData,
            players: [{ ...MockBasicPlayer }],
          },
        });

        const listener = jest.fn();
        const player = game.getPlayer(MockBasicPlayer.userId!);
        player?.addListener('onSwitchoutReady', listener);

        await group.triggerEvent('onCardSwitchOutAvailable', {
          userId: MockBasicPlayer.userId,
          groupId: mockGroupId,
        });

        expect(listener).toHaveBeenCalled();
      });

      it('onHandShuffled: should forward an event to the respective player', async () => {
        const game = new CardGame(MockBasicPlayer.userId!, apollo);
        const group = new MockMatchGroup(
          mockGroupId,
          MockBasicPlayer.userId!,
          game.delegate,
        );

        await group.triggerEvent('onGameInit', {
          matchConfiguration: FullMatchConfig,
          matchStateData: {
            ...mockInitialStateData,
            players: [{ ...MockBasicPlayer }],
          },
        });

        const player = game.getPlayer(MockBasicPlayer.userId!);
        expect(player?.currentHand).toHaveLength(0);
        expect(player?.availableMatchCards).toHaveLength(0);

        await group.triggerEvent('onHandShuffled', {
          userId: MockBasicPlayer.userId,
          cardIds: ['1', '2', '3', '4', '5'],
          matchEndCardIds: ['1', '2'],
        });

        expect(player?.currentHand).toHaveLength(5);
        expect(player?.availableMatchCards).toHaveLength(2);
      });

      it('onReshuffleCostUpdated: should forward an event to the respective player', async () => {
        const game = new CardGame(MockBasicPlayer.userId!, apollo);
        const group = new MockMatchGroup(
          mockGroupId,
          MockBasicPlayer.userId!,
          game.delegate,
        );

        await group.triggerEvent('onGameInit', {
          matchConfiguration: FullMatchConfig,
          matchStateData: {
            ...mockInitialStateData,
            players: [{ ...MockBasicPlayer }],
          },
        });

        const player = game.getPlayer(MockBasicPlayer.userId!);
        expect(player?.nextReshuffleCost).toEqual(0);

        await group.triggerEvent('onReshuffleCostUpdated', {
          userId: MockBasicPlayer.userId,
          nextReshuffleCost: 6,
        });

        expect(player?.nextReshuffleCost).toEqual(6);
      });

      it('onAonPointsCollectFailed: should trigger the listener for the player', async () => {
        const game = new CardGame(mockLocalUserId, apollo);
        const group = new MockMatchGroup(mockGroupId, mockLocalUserId, game.delegate);

        await group.triggerEvent('onGameInit', {
          userId: mockLocalUserId,
          matchConfiguration: FullMatchConfig,
          matchStateData: {
            group: { ...mockInitialStateData.group },
            players: [
              {
                userId: mockLocalUserId,
                points: 0,
                cardSwitchOutTimer: {
                  startTime: `${Date.now()}`,
                  endTime: `${Date.now() + 3000}`,
                },
                activeCard: {
                  ...MockCards.BasicCard,
                },
                allOrNothing: {
                  cardId: MockCards.BasicCard.cardId,
                  totalPoints: MockCards.BasicCard.points,
                  nextPoints: MockCards.BasicCard.points ?? 0 + 100,
                },
              },
              {
                userId: MockBasicPlayer.userId,
                points: 0,
                cardSwitchOutTimer: {
                  startTime: `${Date.now()}`,
                  endTime: `${Date.now() + 3000}`,
                },
                activeCard: {
                  ...MockCards.BasicCard,
                },
              },
            ],
          },
        });

        const player = game.getPlayer(mockLocalUserId);
        expect(player).toBeDefined();

        const playerAonPointsCollectFailed = jest.fn();
        player?.addListener('onAonPointsCollectFailed', playerAonPointsCollectFailed);

        await group.triggerEvent('onAonPointsCollectFailed', {
          userId: mockLocalUserId,
        });

        expect(playerAonPointsCollectFailed).toHaveBeenCalled();
      });

      it('onAonPointsCollected: should trigger the listener for the player', async () => {
        const game = new CardGame(mockLocalUserId, apollo);
        const group = new MockMatchGroup(mockGroupId, mockLocalUserId, game.delegate);

        await group.triggerEvent('onGameInit', {
          userId: mockLocalUserId,
          matchConfiguration: FullMatchConfig,
          matchStateData: {
            group: { ...mockInitialStateData.group },
            players: [
              {
                userId: mockLocalUserId,
                points: 0,
                cardSwitchOutTimer: {
                  startTime: `${Date.now()}`,
                  endTime: `${Date.now() + 3000}`,
                },
                activeCard: {
                  ...MockCards.BasicCard,
                },
                allOrNothing: {
                  cardId: MockCards.BasicCard.cardId,
                  totalPoints: MockCards.BasicCard.points,
                  nextPoints: MockCards.BasicCard.points ?? 0 + 100,
                },
              },
            ],
          },
        });

        const player = game.getPlayer(mockLocalUserId);
        expect(player).toBeDefined();

        const playerAonPointsCollected = jest.fn();
        player?.addListener('onAonPointsCollected', playerAonPointsCollected);

        await group.triggerEvent('onAonPointsCollected', {
          cardId: MockCards.BasicCard.cardId,
          userId: mockLocalUserId,
          points: 200,
        });

        expect(playerAonPointsCollected).toHaveBeenCalled();
      });

      it('onMatchBonusReceived: should trigger the listener for the player', async () => {
        const game = new CardGame(mockLocalUserId, apollo);
        const group = new MockMatchGroup(mockGroupId, mockLocalUserId, game.delegate);

        await group.triggerEvent('onGameInit', {
          userId: mockLocalUserId,
          matchConfiguration: FullMatchConfig,
          matchStateData: mockInitialStateData,
        });

        const player = game.getPlayer(mockLocalUserId);
        expect(player).toBeDefined();

        const playerMatchBonusReceived = jest.fn();
        player?.addListener('onMatchBonusReceived', playerMatchBonusReceived);

        await group.triggerEvent('onMatchBonusReceived', {
          userId: mockLocalUserId,
          points: 2000,
          bonusType: GameLogic.MatchBonusType.MATCH_BONUS_TYPE_VICTORY_ROYAL,
        });

        expect(playerMatchBonusReceived).toHaveBeenCalled();
      });

      /*
			@todo: for my own sanity atm, the following events have not yet had tests added yet:
				- onBoosterAvailable
				- onBoosterCooldownStarted
				- onBoosterRequested
				- onBoosterRequestCancelled
				- onBoosterUsed
			(they shouldn't be hard, they are just annoying and time consuming due to mocking reqs)
			*/
    });

    describe('Event emitting', () => {
      it('onMatchStarted: should emit an event when match starts', async () => {
        const game = new CardGame(mockLocalUserId, apollo);
        const group = new MockMatchGroup(mockGroupId, mockLocalUserId, game.delegate);

        await group.triggerEvent('onGameInit', {
          matchConfiguration: FullMatchConfig,
          matchStateData: mockInitialStateData,
        });

        const listener = jest.fn();
        game.addListener('onMatchStarted', listener);

        await group.triggerEvent('onMatchStarted', { groupId: mockGroupId });
        expect(listener).toHaveBeenCalled();
      });

      it('onMatchEnded: should emit an event when match ends', async () => {
        const game = new CardGame(mockLocalUserId, apollo);
        const group = new MockMatchGroup(mockGroupId, mockLocalUserId, game.delegate);

        await group.triggerEvent('onGameInit', {
          matchConfiguration: FullMatchConfig,
          matchStateData: mockInitialStateData,
        });
        await group.triggerEvent('onMatchStarted', { groupId: mockGroupId });

        const listener = jest.fn();
        game.addListener('onMatchEnded', listener);
        await group.triggerEvent('onMatchEnded', {});

        expect(listener).toHaveBeenCalled();
      });

      it('onLocalGroupChanged: should emit an event when local group changes', async () => {
        const game = new CardGame(mockLocalUserId, apollo);
        const group = new MockMatchGroup(mockGroupId, mockLocalUserId, game.delegate);

        await group.triggerEvent('onGameInit', {
          matchConfiguration: FullMatchConfig,
          matchStateData: mockInitialStateData,
        });

        const listener = jest.fn();
        game.addListener('onLocalGroupChanged', listener);

        await group.triggerEvent('onMatchStarted', { groupId: 'new-group-id' });
        expect(listener).toHaveBeenCalled();
      });

      it('onPlayerJoined: should emit an event when a player joins', async () => {
        const game = new CardGame(mockLocalUserId, apollo);
        const group = new MockMatchGroup(mockGroupId, mockLocalUserId, game.delegate);

        await group.triggerEvent('onGameInit', {
          matchConfiguration: FullMatchConfig,
          matchStateData: mockInitialStateData,
        });

        const userId = 'test-new-player';

        const listener = jest.fn();
        game.addListener('onPlayerJoined', listener);
        await group.triggerEvent('onPlayerJoined', {
          player: {
            ...MockBasicPlayer,
            userId,
          },
          userId,
          groupId: mockGroupId,
        });

        expect(listener).toHaveBeenCalled();
      });

      it('onPlayerLeft: should emit an event when a player leaves', async () => {
        const game = new CardGame(mockLocalUserId, apollo);
        const group = new MockMatchGroup(mockGroupId, mockLocalUserId, game.delegate);

        const userId = 'test-user';

        await group.triggerEvent('onGameInit', {
          matchConfiguration: FullMatchConfig,
          matchStateData: {
            ...mockInitialStateData,
            players: [
              ...mockInitialStateData.players!,
              {
                ...MockBasicPlayer,
                userId,
              },
            ],
          },
        });

        const listener = jest.fn();
        game.addListener('onPlayerLeft', listener);

        await group.triggerEvent('onPlayerLeft', {
          userId,
          groupId: mockGroupId,
          permanent: false,
        });

        expect(listener).toHaveBeenCalled();
      });
    });
  });
});
