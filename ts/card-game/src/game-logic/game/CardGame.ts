import { ApolloClient, gql, NormalizedCacheObject } from '@apollo/client';
import {
  ConnectionState,
  IMatchGroup,
  IMatchGroupDelegate,
} from '@noice-com/platform-client';
import * as GameLogic from '@noice-com/schemas/game-logic/game_logic.pb';
import { GameStreamEvent } from '@noice-com/schemas/game-stream-events/game_stream_events.pb';
import { makeLoggers, Nullable } from '@noice-com/utils';
import EventEmitter, { EventListener } from 'eventemitter3';

import { CGActiveBooster, CGAvailableBooster } from '../boosters';
import { CGActiveCard } from '../card';
import { DelegateEventForwarder } from '../events';
import { CGGroup } from '../group';
import { CGPlayer } from '../player';
import {
  CGTeamCheerSystem,
  CGHighScoringCardsSystem,
  CGMatchResultSystem,
} from '../systems';
import { GameTimer } from '../timer';
import { GameStateProvider } from '../types';

import { GameConfig } from './GameConfig';
import {
  CardGameOnConnectionStatusChanged,
  CardGameOnLocalGroupChanged,
  CardGameOnMatchPauseStateChanged,
  CardGameOnPlayerJoined,
  CardGameOnPlayerLeft,
  CardGameOnMatchCardAvailable,
  CardGameOnTeamMergeWarningReceived,
  CardGameOnMatchBonusReceived,
  CardGameOnGameInit,
  CardGameRoundPhasePreparation,
} from './types';
import { injectDelegateMiddleware, dropPrivateAndNonPrimitiveFields } from './utils';

import {
  getCorrectTargetValuesByGlobals,
  normalizeTargetValues,
} from '@game-common/card';
import { makeEnqueuedMatchHandler } from '@game-events';
import {
  CgActiveBoosterFragment,
  CgAvailableBoosterFragment,
  GameStateBoostersQuery,
  GameStateBoostersQueryResult,
  GameStateBoostersQueryVariables,
  GameStateCardFragment,
  GameStateGameCardQuery,
  GameStateGameCardQueryVariables,
} from '@game-gen';
import { CGChallengesSystem } from '@game-logic/challenges';
import { DebugViewLogEntry } from '@game-types';
import {
  getTimeRelativeToServerTime,
  isMatchRunning,
  isValidDate,
  logDebugViewRow,
} from '@game-utils';

const { logVerbose, logInfo, logWarn, logWarnVerbose, logError } = makeLoggers(
  'game-logic:game:CardGame',
);
const INVALID_ID = `<invalid>`;
export const getCardFragmentId = (id: string) => `GameLogicCard:${id}`;
export const getBoosterFragmentId = (id: number) => `GameLogicBooster:${id}`;

type DelegateEvent = keyof IMatchGroupDelegate;
type DelegateFnHandler<EventName extends DelegateEvent = DelegateEvent> =
  IMatchGroupDelegate[EventName];
type DelegateFnPayload<EventName extends DelegateEvent = DelegateEvent> = Parameters<
  DelegateFnHandler<EventName>
>;
type DelegateHandlerTuple<EventName extends DelegateEvent = DelegateEvent> = [
  DelegateFnHandler<EventName>,
  DelegateFnPayload<EventName>,
];

type MLEvent = [string, { [key: string]: unknown }];
type ServerEvent<T extends DelegateEvent> = [T, { [key: string]: unknown }];
type ClientEvent = [string, { [key: string]: unknown }];

interface BoosterFragmentMap {
  activeBooster: CgActiveBoosterFragment;
  availableBooster: CgAvailableBoosterFragment;
}

type BoosterFragmentType = keyof BoosterFragmentMap;
type BoosterFragmentValue<
  FragmentType extends BoosterFragmentType = BoosterFragmentType,
> = BoosterFragmentMap[FragmentType];

interface EventMap {
  onMatchStarted: [];
  onMatchEnded: [];
  onMatchStateChanged: [];
  onMatchPauseStateChanged: [CardGameOnMatchPauseStateChanged];
  onLocalGroupChanged: [CardGameOnLocalGroupChanged];
  onPlayerJoined: [CardGameOnPlayerJoined];
  onPlayerLeft: [CardGameOnPlayerLeft];
  onActiveCardSucceeded: [];
  onCinematicStarted: [];
  onCinematicEnded: [];
  onConnectionStatusChanged: [CardGameOnConnectionStatusChanged];
  onMatchCardAvailable: [CardGameOnMatchCardAvailable];
  onTeamChangeAvailableAtUpdated: [];
  onTeamMergeWarningReceived: [CardGameOnTeamMergeWarningReceived];
  onTeamMergeExecuted: [];
  onMatchBonusReceived: [CardGameOnMatchBonusReceived];
  onGameInit: [CardGameOnGameInit];
  onRetryMatchMaking: [];
  onRoundPhaseCompetition: [];
  onRoundPhaseEnded: [];
  onRoundPhasePreparation: [CardGameRoundPhasePreparation];
  onGlobalsUpdated: [];
}

export class CardGame extends EventEmitter<EventMap> implements GameStateProvider {
  public static Queries = {
    gameCardQuery: gql`
      query GameStateGameCard($ids: [String!]!) {
        gameCards(cardIds: $ids) {
          cards {
            ...GameStateCard
          }
        }
      }
      ${CGActiveCard.Fragments.activeCardState}
    `,
    boosterQuery: gql`
      query GameStateBoosters($id: Int!) {
        booster(id: $id) {
          id
          ...CgAvailableBooster
          ...CgActiveBooster
        }
      }
      ${CGAvailableBooster.Fragments.availableBooster}
      ${CGActiveBooster.Fragments.activeBooster}
    `,
  };

  // Systems
  public readonly matchResultSystem: CGMatchResultSystem;
  public readonly teamCheerSystem: CGTeamCheerSystem;
  public readonly highScoringCardsSystem: CGHighScoringCardsSystem;
  public readonly challengesSystem: CGChallengesSystem;

  // Connection
  private _dataProvider: ApolloClient<NormalizedCacheObject>;

  private _matchGroup: IMatchGroup | null;
  private _connectionState: ConnectionState;
  private _delegate: IMatchGroupDelegate;
  private _attachedDelegates: Partial<IMatchGroupDelegate>[];

  // Event handling
  private _playerEvents: DelegateEventForwarder;
  private _groupEvents: DelegateEventForwarder;

  // State
  private _localUserId: string;
  private _localGroupId: string;
  private _gameInitParsed: boolean;
  private _messageBuffer: DelegateHandlerTuple[];
  private _serverTime: Nullable<string>;

  private _groups: Map<string, CGGroup>;
  private _players: Map<string, CGPlayer>;
  private _activeCards: Map<string, CGActiveCard>;
  private _availableBoosters: Map<string, CGAvailableBooster>;
  private _matchState: GameLogic.StreamStateMatchState;
  private _matchType: GameLogic.StreamStateMatchType;
  private _roundPhase: GameLogic.StreamStateRoundPhase;
  private _roundPhaseCountdown: GameTimer | null;
  private _roundNumber: number;
  private _activeBoosters: Map<string, Map<string, CGActiveBooster>>;
  private _bestPlays: Map<string, CGActiveCard>;
  private _cinematicActive: boolean;
  private _teamChangeAvailableAt: GameTimer | null;

  private _matchConfig: GameConfig | null;
  private _batchedPrefetchPromise: Promise<GameStateCardFragment[]> | null;
  private _globals: GameLogic.Attribute[];

  public get connected(): boolean {
    return (
      this._matchGroup !== null && this._connectionState === ConnectionState.CONNECTED
    );
  }

  public get connectionState(): ConnectionState {
    return this._connectionState;
  }

  public get matchRunning(): boolean {
    return isMatchRunning(this._matchState);
  }

  public get matchPaused(): boolean {
    return this._matchState === GameLogic.StreamStateMatchState.MATCH_STATE_PAUSED;
  }

  public get matchState(): GameLogic.StreamStateMatchState {
    return this._matchState;
  }

  private set matchState(state: GameLogic.StreamStateMatchState) {
    this._matchState = state;
    this.emit('onMatchStateChanged');
  }

  public get roundPhase(): GameLogic.StreamStateRoundPhase {
    return this._roundPhase;
  }

  public get roundNumber(): number {
    return this._roundNumber;
  }

  public get roundPhaseCountdown(): GameTimer | null {
    return this._roundPhaseCountdown;
  }

  public get localGroupId(): string {
    return this._localGroupId;
  }

  public get localPlayerId(): string {
    return this._localUserId;
  }

  public get isSoloPlay(): boolean {
    return this.getLocalGroup()?.isSolo ?? false;
  }

  public get delegate(): IMatchGroupDelegate {
    return this._delegate;
  }

  public get matchGroup(): IMatchGroup | null {
    return this._matchGroup;
  }

  public get globals(): GameLogic.Attribute[] {
    return this._globals;
  }

  constructor(localUserId: string, dataProvider: ApolloClient<NormalizedCacheObject>) {
    super();

    this._dataProvider = dataProvider;

    this._matchGroup = null;
    this._connectionState = ConnectionState.DISCONNECTED;
    this._delegate = this._createDelegate();
    this._attachedDelegates = [];

    this._localUserId = localUserId;
    this._localGroupId = '';
    this._gameInitParsed = false;
    this._messageBuffer = [];

    this._groups = new Map();
    this._players = new Map();
    this._activeCards = new Map();
    this._availableBoosters = new Map();
    this._activeBoosters = new Map();
    this._bestPlays = new Map();
    this._cinematicActive = false;
    this._teamChangeAvailableAt = null;
    this._serverTime = null;

    this._matchState = GameLogic.StreamStateMatchState.MATCH_STATE_UNSPECIFIED;
    this._matchType = GameLogic.StreamStateMatchType.MATCH_TYPE_UNSPECIFIED;
    this._matchConfig = null;
    this._batchedPrefetchPromise = null;
    this._globals = [];

    this._roundPhase = GameLogic.StreamStateRoundPhase.ROUND_PHASE_UNSPECIFIED;
    this._roundPhaseCountdown = null;
    this._roundNumber = 0;

    this._playerEvents = new DelegateEventForwarder();
    this._groupEvents = new DelegateEventForwarder();

    this.teamCheerSystem = new CGTeamCheerSystem(this._groupEvents, this);
    this.highScoringCardsSystem = new CGHighScoringCardsSystem(this._playerEvents, this);
    this.matchResultSystem = new CGMatchResultSystem(
      localUserId,
      this._playerEvents,
      this,
    );
    this.challengesSystem = new CGChallengesSystem(
      localUserId,
      this._playerEvents,
      this,
      this._dataProvider,
    );
  }

  // #region Data Getters
  private _fetchBooster = async (
    boosterId: number,
  ): Promise<GameStateBoostersQueryResult['data'] | null> => {
    if (boosterId < 1) {
      return null;
    }

    const result = await this._dataProvider.query<
      GameStateBoostersQuery,
      GameStateBoostersQueryVariables
    >({
      query: CardGame.Queries.boosterQuery,
      variables: {
        id: boosterId,
      },
    });

    return result?.data ?? null;
  };

  private async _prefetchBoosters(boosterIds: number[] = []): Promise<void> {
    if (boosterIds.length === 0) {
      return;
    }

    await Promise.all(boosterIds.map(this._fetchBooster));
  }

  private async _getBoosterData<
    BoosterType extends BoosterFragmentType = BoosterFragmentType,
  >(
    boosterId: number,
    forceFetch = false,
    fragmentType: BoosterType,
  ): Promise<BoosterFragmentValue<BoosterType> | undefined> {
    if (boosterId < 1) {
      return;
    }

    const fragment =
      fragmentType === 'availableBooster'
        ? CGAvailableBooster.Fragments.availableBooster
        : CGActiveBooster.Fragments.activeBooster;

    if (!forceFetch) {
      const data = this._dataProvider.readFragment<BoosterFragmentValue<BoosterType>>({
        id: getBoosterFragmentId(boosterId),
        fragment,
      });

      if (data !== null) {
        return data;
      }
    }

    try {
      const data = await this._fetchBooster(boosterId);

      return data?.booster ?? undefined;
    } catch (e) {
      logWarn(`Could not fetch booster ${boosterId} due to error:`, e);
    }
  }

  private _getCachedCardData(cardId: string): GameStateCardFragment | null {
    // NOTE we cannot readQuery here because Apollo seemingly caches the full query.
    // This means that if we query multiple cards at once, trying to query one of them later using
    // query or readQuery will result in it not looking at the cache for some reason. Fragments work tho.
    return this._dataProvider.readFragment<GameStateCardFragment>({
      id: getCardFragmentId(cardId),
      fragment: CGActiveCard.Fragments.activeCardState,
      fragmentName: 'GameStateCard',
    });
  }

  private async _fetchCards(cardIds: string[] = []): Promise<GameStateCardFragment[]> {
    if (cardIds.length === 0) {
      return Promise.resolve([]);
    }

    const response = await this._dataProvider.query<
      GameStateGameCardQuery,
      GameStateGameCardQueryVariables
    >({
      query: CardGame.Queries.gameCardQuery,
      variables: {
        ids: cardIds,
      },
    });

    return response.data.gameCards?.cards ?? [];
  }

  private async _getCardData(
    cardId: string,
    forceFetch = false,
  ): Promise<GameStateCardFragment | undefined> {
    if (!forceFetch) {
      const data = this._getCachedCardData(cardId);

      if (data !== null) {
        return data as GameStateCardFragment;
      }
    }

    try {
      const [card] = await this._fetchCards([cardId]);

      return card;
    } catch (e) {
      logWarn(`Could not fetch card ${cardId} due to error:`, e);
    }
  }
  // #endregion Data Getters

  // #region Internal State
  private _reset() {
    this._groups = new Map();
    this._players = new Map();
    this._activeCards = new Map();
    this._availableBoosters = new Map();
    this._bestPlays = new Map();
    this.matchState = GameLogic.StreamStateMatchState.MATCH_STATE_UNSPECIFIED;
    this._activeBoosters = new Map();
    this._cinematicActive = false;
    this._matchConfig = null;
    this._batchedPrefetchPromise = null;
    this._globals = [];
    this.teamCheerSystem.reset();
  }
  // #endregion Internal State

  // #region Event Handling

  // #region Event Helpers
  private async _initActiveBooster(
    cardOwnerId: string,
    fromBooster: Nullable<GameLogic.ActiveBooster>,
    fromEvent: Nullable<GameLogic.BoosterUsedMsg>,
  ): Promise<CGActiveBooster | undefined> {
    const now = Date.now();
    const boosterId = fromBooster?.boosterId ?? fromEvent?.boosterId;

    // In case booster activationTime is not a valid date, we assume it is relative to serverTime
    const boosterActivationTime = fromBooster?.activationTime;
    const relativeBoosterActivationTime = getTimeRelativeToServerTime(
      boosterActivationTime ?? null,
      this._serverTime,
    );

    const addedAtTime =
      boosterActivationTime && isValidDate(boosterActivationTime)
        ? new Date(boosterActivationTime).getTime()
        : relativeBoosterActivationTime
        ? now - relativeBoosterActivationTime
        : now;

    const originalBoosterOwnerId = fromBooster
      ? fromBooster.activatorUserId
      : fromEvent?.userId;

    // Validate we have the info we need.
    if (typeof boosterId === `undefined`) {
      logError(`Tried initializing an active booster but there is no booster id!`);
      return;
    }

    if (typeof originalBoosterOwnerId === `undefined`) {
      logError(`Tried initializing an active booster but there is no original user id!`);
      return;
    }

    // Get the map of active boosters for this player
    let boosterMap = this._activeBoosters.get(cardOwnerId);

    if (!boosterMap) {
      boosterMap = new Map();
      this._activeBoosters.set(cardOwnerId, boosterMap);
    }

    const boosterData = await this._getBoosterData(boosterId, false, 'activeBooster');

    if (!boosterData) {
      logWarnVerbose(
        `Initializing active booster failed, booster data could not be found!\n\tuserId: ${cardOwnerId}\n\tboosterId: ${boosterId}`,
      );
      return;
    }

    const instance = new CGActiveBooster({
      ownerId: cardOwnerId,
      originalOwnerId: originalBoosterOwnerId,
      schema: boosterData,
      attachedTimestamp: addedAtTime,
      stateProvider: this,
    });
    boosterMap?.set(originalBoosterOwnerId, instance);

    return instance;
  }

  private async _initActiveCard({
    userId,
    activeCard,
  }: GameLogic.Player): Promise<CGActiveCard | undefined> {
    if (!userId || !activeCard || !activeCard.cardId) {
      return;
    }

    const card = new CGActiveCard(activeCard.cardId, userId, this._playerEvents, this, {
      ...activeCard,
    });
    this._activeCards.set(userId, card);

    // Initialize any active boosters we may have
    if (
      !activeCard.activeBoosters ||
      Object.keys(activeCard.activeBoosters).length === 0
    ) {
      return;
    }

    let boosterMap = this._activeBoosters.get(userId);

    if (!boosterMap) {
      boosterMap = new Map();
      this._activeBoosters.set(userId, boosterMap);
    }

    await Promise.all(
      Object.entries(activeCard.activeBoosters).map(
        async ([, activeBooster]) =>
          await this._initActiveBooster(userId, activeBooster, null),
      ),
    );
  }

  private async _initAvailableBooster({
    userId,
    heldBoosterId,
  }: GameLogic.Player): Promise<CGAvailableBooster | undefined> {
    // Explicitly check booster for undefined as there might be a booster with id === 0
    if (typeof heldBoosterId === 'undefined' || !userId) {
      return;
    }

    const boosterSchema = await this._getBoosterData(
      heldBoosterId,
      false,
      'availableBooster',
    );

    if (!boosterSchema) {
      logWarnVerbose(
        `Initializing booster for player failed, booster data could not be found!\n\tuserId: ${userId}\n\tboosterId: ${heldBoosterId}`,
      );
      return;
    }

    const booster = new CGAvailableBooster(boosterSchema, {
      owner: userId,
      isOwnedLocally: userId === this._localUserId,
      stateProvider: this,
      eventForwarder: this._playerEvents,
      requests: [],
    });
    this._availableBoosters.set(userId, booster);
    this._playerEvents.emit(userId, 'onBoosterAvailable', {
      userId,
      boosterId: booster.boosterId,
    });

    return booster;
  }

  private async _initPlayer(playerData: GameLogic.Player): Promise<CGPlayer | undefined> {
    if (!playerData.userId) {
      return;
    }

    if (this._players.has(playerData.userId)) {
      return this._players.get(playerData.userId);
    }

    // Init player
    const player = new CGPlayer(
      playerData.userId,
      this._localGroupId,
      this._playerEvents,
      this,
      playerData,
    );
    this._players.set(player.playerID, player);

    // Init active card (if they have one)
    if (playerData.activeCard?.cardId) {
      await this._initActiveCard(playerData);
    }

    // Init available booster (if they have one)
    if (typeof playerData.heldBoosterId !== 'undefined') {
      await this._initAvailableBooster(playerData);
    }

    // Store current best play for player
    if (playerData.bestPlay?.cardId) {
      const bestPlayCardId = playerData.bestPlay.cardId;

      const bestPlay = new CGActiveCard(
        bestPlayCardId,
        playerData.userId,
        this._playerEvents,
        this,
        {
          points: playerData.bestPlay.points,
        },
      );
      bestPlay.freeze();
      this._bestPlays.set(playerData.userId, bestPlay);
    }

    return player;
  }

  private _attach(group: IMatchGroup) {
    if (this._localUserId !== group.localUserId) {
      throw new Error(
        'CardGame: Attached match group with different local user ID: ' +
          group.localUserId,
      );
    }

    this._matchGroup = group;
    this._localUserId = group.localUserId;
    this._connectionState = ConnectionState.CONNECTED;
    this.teamCheerSystem.matchGroup = group;

    this._reset();

    logVerbose(`CardGame attached to match ${group.groupId}`);
  }

  // #endregion Event Helpers
  private _logDebugViewRow = <Event extends DelegateEvent = DelegateEvent>(
    mlEvent: Nullable<MLEvent>,
    serverEvent: Nullable<ServerEvent<Event>>,
    clientEvent: Nullable<ClientEvent>,
  ) => {
    let mlEventEntry: Nullable<DebugViewLogEntry> = null;

    if (mlEvent) {
      mlEventEntry = {
        eventName: mlEvent[0],
        jsonData: mlEvent[1],
        isError: false,
      };
    }

    let serverEventEntry: Nullable<DebugViewLogEntry> = null;

    if (serverEvent) {
      serverEventEntry = {
        eventName: serverEvent[0],
        jsonData: serverEvent[1],
        isError: false,
      };
    }

    let clientEventEntry: Nullable<DebugViewLogEntry> = null;

    if (clientEvent) {
      clientEventEntry = {
        eventName: clientEvent[0],
        jsonData: clientEvent[1],
        isError: false,
      };
    }

    logDebugViewRow(mlEventEntry, serverEventEntry, clientEventEntry);
  };

  private _forwardDelegateMessage = <EventName extends DelegateEvent = DelegateEvent>(
    eventName: EventName,
    [ctx, ev]: DelegateFnPayload<EventName>,
  ) => {
    this._attachedDelegates.forEach((delegate) => {
      if (typeof delegate[eventName] !== 'function') {
        return;
      }

      // @ts-expect-error See message below.
      // Dynamic args are not being considered as a tuple by TS.
      delegate[eventName]?.(ctx, ev);
    });

    // Send events also to debug log except for onDebug event (that's handled in the onDebug function
    // later in this file)
    if (ev && eventName !== 'onDebug') {
      this._logDebugViewRow(null, [eventName, ev], null);
    }
  };

  private _bufferMsg = <Event extends DelegateEvent = DelegateEvent>(
    fn: DelegateFnHandler<Event>,
  ): DelegateFnHandler<Event> => {
    return (...args: DelegateFnPayload) => {
      if (this._gameInitParsed) {
        // @ts-expect-error For some reason TS is not considering [ctx, ev] as a valid
        // tuple, which seems to be a common issue with dynamically generated args.
        // @see: https://stackoverflow.com/questions/68884073/spreading-an-array-in-a-typescript-function-error-ts2556
        return fn(...args);
      }

      this._messageBuffer.push([fn, args]);
    };
  };

  private _clearBuffer() {
    const buffer = this._messageBuffer.splice(0, this._messageBuffer.length);
    // @ts-expect-error See note in _bufferMsg. TS is not considering the dynamic args
    // as adhering to the signature of the handler function.
    buffer.forEach(([handler, payload]) => handler(...payload));
  }

  private _logRoundStartCountdown = (serverRoundStartTimestamp?: number) => {
    if (!serverRoundStartTimestamp || !this._roundPhaseCountdown) {
      return;
    }

    logInfo('Round preparation phase:', {
      serverRoundStartTimestamp,
      clientLocalNow: Date.now(),
      timeLeftToStart: this._roundPhaseCountdown.timeLeft,
    });
  };

  private _createDelegate(): IMatchGroupDelegate {
    return injectDelegateMiddleware(
      makeEnqueuedMatchHandler({
        initialized: (matchGroup) => {
          this._attach(matchGroup);

          if (!matchGroup.spectator) {
            // matchGroup.setDebug(GameLogic.DebugMsgType.DEBUG_MSG_TYPE_ML_EVENTS, true);
          }
        },
        onConnectionStatusChanged: (_, ev) => {
          this._connectionState = ev.state;
          this.emit('onConnectionStatusChanged', {
            state: ev.state,
            closedMessage: ev.closed ?? null,
            error: ev.error ?? null,
          });

          if (ev.state === ConnectionState.RECONNECTING) {
            logWarn(`Game connection is currently RECONNECTING! Game will not work!`);
          } else if (ev.state === ConnectionState.DISCONNECTED) {
            logWarn(`Game connection is DISCONNECTED! Game will not run!`);
          }
        },
        onGameInit: async (_, ev) => {
          // ----- Initialize match config.
          this._matchConfig = new GameConfig(ev.matchConfiguration);

          // ----- Log whether or not a match is active.
          this.matchState =
            ev.matchStateData?.streamState?.matchState ||
            GameLogic.StreamStateMatchState.MATCH_STATE_UNSPECIFIED;
          this._matchType =
            ev.matchStateData?.streamState?.matchType ??
            GameLogic.StreamStateMatchType.MATCH_TYPE_UNSPECIFIED;

          // @todo: this is just logic for mocked events for now until
          // we get the actual server events for round based games.
          this._roundPhase =
            ev.matchStateData?.streamState?.roundPhase ??
            GameLogic.StreamStateRoundPhase.ROUND_PHASE_UNSPECIFIED;
          this._roundNumber = ev.matchStateData?.streamState?.roundNumber ?? 0;

          const roundDeadlineTimestamp = parseInt(
            ev?.matchStateData?.streamState?.roundPhaseDeadline ?? '0',
            10,
          );
          this._roundPhaseCountdown = roundDeadlineTimestamp
            ? GameTimer.FromNow(roundDeadlineTimestamp - Date.now())
            : null;
          this._logRoundStartCountdown(roundDeadlineTimestamp);

          const isPaused =
            this.matchState === GameLogic.StreamStateMatchState.MATCH_STATE_PAUSED;

          // ----- Store server time
          this._serverTime = ev.serverTime ?? null;

          // ----- Save booster data.
          // Prefetch boosters
          const boosterIds = ev.matchData?.boosterIds ?? [];
          this._prefetchBoosters(boosterIds);

          // @todo: We could in theory add these to the cache instead of querying for them here.
          const cardIds = ev.matchData?.cardIds ?? [];
          this._batchedPrefetchPromise = this._fetchCards(cardIds);

          const stateData = ev.matchStateData;

          if (!stateData || !stateData.group) {
            logError(
              `GAME BREAKING ISSUE: Did not receive any match state data from server!`,
              stateData,
            );
            return;
          }

          this._globals = stateData.globals ?? [];

          // ----- Init group
          const localGroup = new CGGroup(
            stateData.group.id ?? INVALID_ID,
            this._groupEvents,
            this,
            stateData.group,
          );

          this._groups.set(localGroup.groupID, localGroup);

          if (this._localGroupId !== localGroup.groupID) {
            this._localGroupId = localGroup.groupID;
            this.emit('onLocalGroupChanged', { group: localGroup });
          }

          logVerbose(`Group state now being tracked.`, localGroup);

          // ----- Init players
          await Promise.all(
            (stateData.players ?? []).map(async (player) => {
              const playerInstance = await this._initPlayer(player);

              if (!playerInstance) {
                return false;
              }

              logVerbose(`Player state ${player.userId} now being tracked.`);
              this._playerEvents.emit(playerInstance.playerID, 'onPlayerJoined', {
                player,
              });
              this._groupEvents.emit(this._localGroupId, 'onPlayerJoined', {
                userId: playerInstance.playerID,
                player,
              });
              this.emit('onPlayerJoined', { player: playerInstance });

              return true;
            }),
          );

          logVerbose(`Challenge state now being tracked.`, localGroup);

          if (isPaused) {
            this.emit('onMatchPauseStateChanged', {
              isPaused,
              matchState: this.matchState,
              roundPhase: this._roundPhase,
            });
          }

          logVerbose(`Finished initializing from game init.`);
          this._gameInitParsed = true;
          this._clearBuffer();
          this._playerEvents.emit('*', 'onGameInit', ev);
          this.emit('onGameInit', { matchState: this.matchState });
        },
        onMatchStarted: this._bufferMsg<'onMatchStarted'>((_, ev) => {
          this.matchState = GameLogic.StreamStateMatchState.MATCH_STATE_ACTIVE;

          this.emit('onMatchStarted');
          this._playerEvents.emitAll('onMatchStarted', ev);

          // @todo: I'm not sure how much this actually can ever happen.
          // Additionally, I'm not sure how thorough it needs to be; ie.
          // do we need to also iterate through all players to add them
          // to the new group? Does this even happen? Needs testing.
          if (!ev.groupId || ev.groupId === this._localGroupId) {
            return;
          }

          const oldLocalGroupId = this._localGroupId;
          const oldGroup = this._groups.get(oldLocalGroupId);

          const newLocalGroupId = ev.groupId;
          const newGroup =
            oldGroup?.cloneWithID(newLocalGroupId) ??
            new CGGroup(newLocalGroupId, this._groupEvents, this);

          this._groups.set(newLocalGroupId, newGroup);

          if (oldGroup) {
            this._groups.delete(oldLocalGroupId);
            oldGroup.destroy();
          }

          this._localGroupId = newLocalGroupId;
          this.emit('onLocalGroupChanged', { group: newGroup });
        }),
        onMatchPauseStateChanged: this._bufferMsg<'onMatchPauseStateChanged'>((_, ev) => {
          this.matchState = ev.paused
            ? GameLogic.StreamStateMatchState.MATCH_STATE_PAUSED
            : GameLogic.StreamStateMatchState.MATCH_STATE_ACTIVE;

          this.emit('onMatchPauseStateChanged', {
            isPaused: ev.paused ?? false,
            matchState: this.matchState,
            roundPhase: this._roundPhase,
          });
          this._playerEvents.emit('*', 'onMatchPauseStateChanged', ev);
        }),
        onMatchEnded: this._bufferMsg<'onMatchEnded'>((_, ev) => {
          this.matchState = GameLogic.StreamStateMatchState.MATCH_STATE_ENDED;
          this.emit('onMatchEnded');
          this._playerEvents.emitAll('onMatchEnded', ev);
          this._activeBoosters = new Map();
          this._availableBoosters = new Map();
          this._bestPlays = new Map();
        }),
        onCardDealingStarted: this._bufferMsg<'onCardDealingStarted'>(async (_, ev) => {
          if (!ev.userId || !ev.cardId) {
            return;
          }

          this._playerEvents.emit(ev.userId, 'onCardDealingStarted', ev);

          // Wait for the initial batched prefetch to finish before checking cache to avoid
          // large amounts of queries spamming at the beginning of the round.
          if (this._batchedPrefetchPromise !== null) {
            await this._batchedPrefetchPromise;
          }

          // Query the card data so we can cache it.
          let cardInCache = this._getCachedCardData(ev.cardId);

          // If the card isn't in the cache, fetch it!
          if (!cardInCache) {
            logVerbose(`Card ${ev.cardId} is NOT in cache, pre-fetching it.`);
            cardInCache = (await this._getCardData(ev.cardId)) ?? null;
          }

          if (cardInCache?.isMatchCard) {
            this.emit('onMatchCardAvailable', { forPlayerId: ev.userId });
          }
        }),
        onCardDealingEnded: this._bufferMsg<'onCardDealingEnded'>((_, ev) => {
          if (!ev.userId || !ev.cardId) {
            return;
          }

          this._playerEvents.emit(ev.userId, 'onCardDealingEnded', ev);
        }),
        onActiveCardSet: this._bufferMsg<'onActiveCardSet'>(async (_, ev) => {
          if (!ev.userId || !ev.cardId) {
            return;
          }

          let cardData: GameStateCardFragment | undefined;

          try {
            cardData = await this._getCardData(ev.cardId);
          } catch (e) {
            logWarn(`(onActiveCardSet) Could not fetch card data due to an error:`, e);
          }

          if (!cardData) {
            return;
          }

          // @todo: AON
          const now = Date.now();
          const pointsUpdateTime = parseInt(
            ev.pointsUpdateDuration ?? `${this._matchConfig?.pointsGainTime ?? 5000}`,
            10,
          );
          const aonPoints =
            ev?.allOrNothing?.nextPoints ?? 0 > 0 ? ev.allOrNothing?.nextPoints : 0;
          const normalizedTargetValues = normalizeTargetValues(
            cardData.targetValues ?? [],
          );
          const targetValues = getCorrectTargetValuesByGlobals(
            normalizedTargetValues,
            this._globals,
          ).reduce((acc, { label, value }) => {
            acc[label] = value;
            return acc;
          }, {} as { [key: string]: number });
          const newCard = new CGActiveCard(
            ev.cardId,
            ev.userId,
            this._playerEvents,
            this,
            {
              points: aonPoints || cardData.pointsMin,
              pointsMin: aonPoints || cardData.pointsMin,
              pointsMax: aonPoints || cardData.pointsMax,
              pointsTimeTarget: cardData.pointsTimeTarget,
              pointsUpdateTime: `${pointsUpdateTime}`,
              pointsUpdateTimer: {
                startTime: `${new Date(now).toISOString()}`,
                endTime: `${new Date(now + pointsUpdateTime).toISOString()}`,
              },
              targetValues,
            },
          );
          this._activeCards.set(ev.userId, newCard);
          this._playerEvents.emit(ev.userId, 'onActiveCardSet', ev);

          // Clear all the active boosters applied to the previous card
          const boosterMap = new Map();
          this._activeBoosters.set(ev.userId, boosterMap);
        }),
        onActiveCardPointsUpdated: this._bufferMsg<'onActiveCardPointsUpdated'>(
          (_, ev) => {
            if (!ev.userId || !ev.points) {
              return;
            }

            this._playerEvents.emit(ev.userId, 'onActiveCardPointsUpdated', ev);
          },
        ),
        onActiveCardTargetValueChanged: this._bufferMsg<'onActiveCardTargetValueChanged'>(
          (_, ev) => {
            if (!ev.userId) {
              return;
            }

            this._playerEvents.emit(ev.userId, 'onActiveCardTargetValueChanged', ev);
          },
        ),
        onSettingActiveCardFailed: this._bufferMsg<'onSettingActiveCardFailed'>(
          (_, ev) => {
            if (!ev.userId) {
              return;
            }

            this._playerEvents.emit(ev.userId, 'onSettingActiveCardFailed', ev);
          },
        ),
        onHandShuffled: this._bufferMsg<'onHandShuffled'>((_, ev) => {
          if (!ev.userId) {
            return;
          }

          // @todo: Do we need to pre-fetch the cards here?
          // I don't think so as they should have already been pre-fetched during
          // game init and card dealt...
          this._playerEvents.emit(ev.userId, 'onHandShuffled', ev);
        }),
        onShufflingHandFailed: this._bufferMsg<'onShufflingHandFailed'>((_, ev) => {
          if (!ev.userId) {
            return;
          }

          this._playerEvents.emit(ev.userId, 'onShufflingHandFailed', ev);
        }),
        onPlayerPointsUpdated: this._bufferMsg<'onPlayerPointsUpdated'>((_, ev) => {
          if (!ev.userId || !ev.points) {
            return;
          }

          this._playerEvents.emit(ev.userId, 'onPlayerPointsUpdated', ev);
        }),
        onPlayerCoinsUpdated: this._bufferMsg<'onPlayerCoinsUpdated'>((_, ev) => {
          logWarnVerbose(`Method not implemented (onPlayerCoinsUpdated)`, ev);
        }),
        onPlayerJoined: this._bufferMsg<'onPlayerJoined'>(async (_, ev) => {
          if (!ev.groupId || !ev.player || !ev.player.userId) {
            return;
          }

          let group = this._groups.get(ev.groupId);

          if (!group) {
            group = new CGGroup(ev.groupId, this._groupEvents, this);
            this._groups.set(group.groupID, group);
          }

          const playerCards = ev.playerCardIds ?? [];
          void this._fetchCards(playerCards);

          const player = await this._initPlayer(ev.player);

          if (!player) {
            return;
          }

          logVerbose(`Player ${player.playerID} has joined the game.`);
          this._playerEvents.emit(player.playerID, 'onPlayerJoined', {
            player: ev.player,
          });
          this._groupEvents.emit(this._localGroupId, 'onPlayerJoined', {
            userId: player.playerID,
            player: ev.player,
          });
          this.emit('onPlayerJoined', { player });
        }),
        onPlayerLeft: this._bufferMsg<'onPlayerLeft'>((_, ev) => {
          if (!ev.groupId || !ev.userId) {
            return;
          }

          logVerbose(
            `Player ${ev.userId} has left the game (Permanent? ${
              ev.permanent ? 'YES' : 'NO'
            }).`,
          );

          this._groupEvents.emit(ev.groupId, 'onPlayerLeft', ev);
          this._playerEvents.emit(ev.userId, 'onPlayerLeft', ev);
          this.emit('onPlayerLeft', {
            playerId: ev.userId,
            isPermanent: ev.permanent ?? false,
          });

          if (ev.permanent) {
            this._players.delete(ev.userId);
            this._activeCards.delete(ev.userId);
            this._bestPlays.delete(ev.userId);
          }
        }),
        onGroupPointsUpdated: this._bufferMsg<'onGroupPointsUpdated'>((_, ev) => {
          if (!ev.groupId) {
            return;
          }

          this._groupEvents.emit(ev.groupId, 'onGroupPointsUpdated', ev);
        }),
        onBoosterCooldownStarted: this._bufferMsg<'onBoosterCooldownStarted'>((_, ev) => {
          if (!ev.userId) {
            return;
          }

          this._playerEvents.emit(ev.userId, 'onBoosterCooldownStarted', ev);
        }),
        onBoosterAvailable: this._bufferMsg<'onBoosterAvailable'>(async (_, ev) => {
          const { userId, boosterId = -1 } = ev;

          if (!userId || boosterId === -1) {
            return;
          }

          // Try to initialize the booster. This will only be undefined if the booster ID is invalid/
          // the booster data does not exist. If it succeeds, it will trigger the available event.
          await this._initAvailableBooster({
            userId,
            heldBoosterId: boosterId,
          });
        }),
        onBoosterUsed: this._bufferMsg<'onBoosterUsed'>(async (_, ev) => {
          if (typeof ev.boosterId === 'undefined' || !ev.userId || !ev.targetUserId) {
            return;
          }

          // Try to initialize the active booster. This will only be undefined if something goes wrong,
          // otherwise it will create/store the booster.
          const booster = await this._initActiveBooster(ev.targetUserId, null, ev);

          if (!booster) {
            return;
          }

          // Since the booster was used, remove it from the available boosters.
          this._availableBoosters.delete(ev.userId);

          this._playerEvents.emit(ev.targetUserId, 'onBoosterUsed', ev);
        }),
        onBoosterRequested: this._bufferMsg<'onBoosterRequested'>((_, ev) => {
          if (!ev.userId || !ev.targetUserId || typeof ev.boosterId === 'undefined') {
            return;
          }

          /*
          @note: This is a bit counter-intuitive because the target user is the owner of the booster,
          meaning that while usually we use userId for the owner, in this instance we don't want that
          because we want to notify the owning player that someone has requested.
          */
          this._playerEvents.emit(ev.targetUserId, 'onBoosterRequested', ev);
        }),
        onBoosterRequestCancelled: this._bufferMsg<'onBoosterRequestCancelled'>(
          (_, ev) => {
            if (!ev.userId || !ev.targetUserId || typeof ev.boosterId === 'undefined') {
              return;
            }

            /*
          @note: Please see note above in onBoosterRequested. userId and targetUserId are switched
          for filtering these particular functions.
          */
            this._playerEvents.emit(ev.targetUserId, 'onBoosterRequestCancelled', ev);
          },
        ),
        onBoosterRemoved: this._bufferMsg<'onBoosterRemoved'>((_, ev) => {
          if (!ev.targetUserId || !ev.activatorUserId) {
            return;
          }

          const playerBoosterMap = this._activeBoosters.get(ev.targetUserId);

          if (!playerBoosterMap) {
            return;
          }

          playerBoosterMap.delete(ev.activatorUserId);
          this._playerEvents.emit(ev.targetUserId, 'onBoosterRemoved', ev);
        }),
        onBoosterPointsReceived: this._bufferMsg<'onBoosterPointsReceived'>((_, _ev) => {
          logWarnVerbose(`Method not implemented (onBoosterPointsReceived)`);
        }),
        onCardSwitchOutTimerStarted: this._bufferMsg<'onCardSwitchOutTimerStarted'>(
          (_, ev) => {
            if (!ev.userId) {
              return;
            }

            this._playerEvents.emit(ev.userId, 'onCardSwitchOutTimerStarted', ev);
          },
        ),
        onCardSwitchOutAvailable: this._bufferMsg<'onCardSwitchOutAvailable'>((_, ev) => {
          if (!ev.userId) {
            return;
          }

          this._playerEvents.emit(ev.userId, 'onCardSwitchOutAvailable', ev);
        }),
        onCardVoteAdded: this._bufferMsg<'onCardVoteAdded'>((_, _ev) => {
          logWarnVerbose(`Method not implemented (onCardVoteAdded)`);
        }),
        onCardVoteRemoved: this._bufferMsg<'onCardVoteRemoved'>((_, _ev) => {
          logWarnVerbose(`Method not implemented (onCardVoteRemoved)`);
        }),
        onBestPlayPointsReceived: this._bufferMsg<'onBestPlayPointsReceived'>(
          (_, _ev) => {
            logWarnVerbose(`Method not implemented (onBestPlayPointsReceived)`);
          },
        ),
        onAonPointsCollected: this._bufferMsg<'onAonPointsCollected'>((_, ev) => {
          if (!ev.userId) {
            return;
          }

          this._playerEvents.emit(ev.userId, 'onAonPointsCollected', ev);
        }),
        onAonPointsCollectFailed: this._bufferMsg<'onAonPointsCollectFailed'>((_, ev) => {
          if (!ev.userId) {
            return;
          }

          this._playerEvents.emit(ev.userId, 'onAonPointsCollectFailed', ev);
        }),
        onGroupBonusPointsReceived: this._bufferMsg<'onGroupBonusPointsReceived'>(
          (_, _ev) => {
            logWarnVerbose(`Method not implemented (onGroupBonusPointsReceived)`);
          },
        ),
        onActiveCardSucceeded: this._bufferMsg<'onActiveCardSucceeded'>((_, ev) => {
          if (!ev.userId) {
            return;
          }

          const currentBestPlayPoints =
            this._bestPlays.get(ev.userId)?.currentPoints || 0;
          const newPoints = ev.bestPlay?.points || ev.points || 0;

          // update best play if this is the best play this one got more points
          if (ev.bestPlay || newPoints > currentBestPlayPoints) {
            const activeCard = this._activeCards.get(ev.userId);
            if (!activeCard) {
              logError(
                `Got best play event for user ${ev.userId} but no active card was found.`,
              );
              return;
            }

            const bestPlay = new CGActiveCard(
              activeCard.cardId,
              ev.userId,
              this._playerEvents,
              this,
              {
                points: newPoints,
              },
            );
            bestPlay.freeze();
            this._bestPlays.set(ev.userId, bestPlay);
          }

          this._playerEvents.emit(ev.userId, 'onActiveCardSucceeded', ev);
          this._activeCards.delete(ev.userId);
          this.emit('onActiveCardSucceeded');
        }),
        onActiveCardFailed: this._bufferMsg<'onActiveCardFailed'>((_, ev) => {
          if (!ev.userId) {
            return;
          }

          this._playerEvents.emit(ev.userId, 'onActiveCardFailed', ev);
          this._activeCards.delete(ev.userId);
        }),
        // @todo: Does this occur on cards already set?? or nah
        onPlayerCardUpgraded: this._bufferMsg<'onPlayerCardUpgraded'>((_, ev) => {
          if (!ev.upgrade?.newCard?.id) {
            return;
          }

          void this._fetchCards([ev.upgrade.newCard.id]);
        }),
        onReshuffleCostUpdated: this._bufferMsg<'onReshuffleCostUpdated'>((_, ev) => {
          if (!ev.userId) {
            return;
          }

          this._playerEvents.emit(ev.userId, 'onReshuffleCostUpdated', ev);
        }),
        onGroupCreated: this._bufferMsg<'onGroupCreated'>((_, ev) => {
          if (ev.groupId === this._localGroupId) {
            return;
          }

          logInfo(
            `Local player group changed, resetting state before reinitializing. (new=${ev.name}, solo=${ev.isSolo}`,
          );
          // This event occurs whenever we switch groups and will be followed by game init,
          // so we need to reset the state beforehand to prevent memory leaks.
          this._reset();
        }),
        onStreamEnded: this._bufferMsg<'onStreamEnded'>((_, _ev) => {
          logWarnVerbose(`Method not implemented (onStreamEnded)`);
        }),
        onHighScoringCardSucceeded: this._bufferMsg<'onHighScoringCardSucceeded'>(
          (_, ev) => {
            if (!ev.userId) {
              return;
            }

            this._playerEvents.emit(ev.userId, 'onHighScoringCardSucceeded', ev);
          },
        ),
        onHighScoringCardPromoted: this._bufferMsg<'onHighScoringCardPromoted'>(
          (_, ev) => {
            if (!ev.userId) {
              return;
            }

            this._playerEvents.emit(ev.userId, 'onHighScoringCardPromoted', ev);
          },
        ),
        onContextualTeamActionUpdate: this._bufferMsg<'onContextualTeamActionUpdate'>(
          (_, ev) => {
            // Emit to all groups since this is a global event,
            // that way the TeamActionSystem can handle it.
            this._groupEvents.emitAll('onContextualTeamActionUpdate', ev);
          },
        ),
        onMatchBonusReceived: this._bufferMsg<'onMatchBonusReceived'>(
          (_, ev): void | Promise<void> => {
            if (!ev.userId || !ev.points || !ev.bonusType) {
              return;
            }

            this._playerEvents.emit(ev.userId, 'onMatchBonusReceived', ev);
            this.emit('onMatchBonusReceived', {
              points: ev.points,
              bonusType: ev.bonusType,
            });
          },
        ),
        onInactivityTimerUpdated: this._bufferMsg<'onInactivityTimerUpdated'>((_, ev) => {
          if (!ev.userId || typeof ev.secondsRemaining === 'undefined') {
            return;
          }

          this._playerEvents.emit(ev.userId, 'onInactivityTimerUpdated', ev);
        }),
        onInactivityTimerCancelled: this._bufferMsg<'onInactivityTimerCancelled'>(
          (_, ev) => {
            if (!ev.userId) {
              return;
            }

            this._playerEvents.emit(ev.userId, 'onInactivityTimerCancelled', ev);
          },
        ),
        onInactivityKickReceived: this._bufferMsg<'onInactivityKickReceived'>((_, ev) => {
          if (!ev.userId) {
            return;
          }

          this._playerEvents.emit(ev.userId, 'onInactivityKickReceived', ev);
        }),
        onTeamMergeWarningReceived: this._bufferMsg<'onTeamMergeWarningReceived'>(
          (_, ev) => {
            if (!ev.countdownMs) {
              return;
            }
            this.emit('onTeamMergeWarningReceived', { countdownMs: ev.countdownMs });
          },
        ),
        onTeamMergeExecuted: this._bufferMsg<'onTeamMergeExecuted'>((_, _ev) => {
          this.emit('onTeamMergeExecuted');
        }),
        onDebug: (_, ev) => {
          if (ev.type === GameLogic.DebugMsgType.DEBUG_MSG_TYPE_ML_EVENTS) {
            const gameStreamEvent = ev.gameStreamEvent ?? ({} as GameStreamEvent);
            const eventName = gameStreamEvent.eventName ?? 'ML_DEBUG_EVENT';
            this._logDebugViewRow([eventName, gameStreamEvent], null, null);
          }
        },
        onRetryMatchMaking: (_ev) => {
          this.emit('onRetryMatchMaking');
        },
        onRoundPhaseChanged: (_ctx, ev) => {
          const { roundPhase, roundNumber, roundPhaseDeadline } = ev;

          if (!roundPhase || !roundNumber) {
            return;
          }
          this._roundPhase = roundPhase;
          this._roundNumber = roundNumber;

          if (roundPhase === GameLogic.StreamStateRoundPhase.ROUND_PHASE_ENDED) {
            this.emit('onRoundPhaseEnded');
          } else if (
            roundPhase === GameLogic.StreamStateRoundPhase.ROUND_PHASE_PREPARATION
          ) {
            if (!roundPhaseDeadline) {
              throw new Error(
                "CardGame: 'roundPhaseDeadline' is missing in onRoundPhaseChanged event with phase ROUND_PHASE_PREPARATION.",
              );
            }

            const deadlineTimestamp = parseInt(roundPhaseDeadline, 10);
            const timer = GameTimer.FromNow(deadlineTimestamp - Date.now());
            this._roundPhaseCountdown = timer;
            this._logRoundStartCountdown(deadlineTimestamp);

            this.emit('onRoundPhasePreparation', {
              roundStartsTimer: timer,
            });
          } else if (
            roundPhase === GameLogic.StreamStateRoundPhase.ROUND_PHASE_COMPETITION
          ) {
            this.emit('onRoundPhaseCompetition');
          }
        },
        onAvailableChallenges: (_ctx, ev) => {
          this._playerEvents.emit('*', 'onAvailableChallenges', ev);
        },
        onSetActiveChallenge: (_ctx, ev) => {
          const challengeId = ev.challengeId;
          const userId = ev.userId;

          if (!challengeId || !userId) {
            return;
          }

          this._playerEvents.emit(userId, 'onSetActiveChallenge', {
            challengeId,
            userId,
          });
        },
        onChallengeEvent: (_ctx, ev) => {
          this._playerEvents.emit('*', 'onChallengeEvent', ev);
        },
        onChallengePickRatesUpdate: (_ctx, ev) => {
          this._playerEvents.emit('*', 'onChallengePickRatesUpdate', ev);
        },
        onChallengePicksLocked: (_ctx, ev) => {
          this._playerEvents.emit('*', 'onChallengePicksLocked', ev);
        },
        onSettingActiveChallengeFailed: this._bufferMsg<'onSettingActiveChallengeFailed'>(
          (_ctx, ev) => {
            if (!ev.userId) {
              return;
            }

            this._playerEvents.emit(ev.userId, 'onSettingActiveChallengeFailed', ev);
          },
        ),
        onGlobalsUpdated: this._bufferMsg<'onGlobalsUpdated'>((_ctx, ev) => {
          if (!ev.globals) {
            return;
          }

          ev.globals.forEach((newGlobal) => {
            const foundOldGlobalIndex = this._globals.findIndex(
              (global) => global.name === newGlobal.name,
            );
            if (foundOldGlobalIndex !== -1) {
              this._globals[foundOldGlobalIndex] = newGlobal;
            } else {
              this._globals.push(newGlobal);
            }
          });

          this.emit('onGlobalsUpdated');
        }),
      }),
      this._forwardDelegateMessage,
    );
  }

  public logDebugClient(eventName: string, data: Record<string, unknown>) {
    // We currently expect data to be always built from one argument,
    // meaning it has a single key named '0'. Let's clean it up a bit to
    // prettify the logs, but fallback to the unknown structure if necessary.
    const hasOneKeyCalledZero = Object.keys(data).length === 1 && data['0'];
    const cleanData = dropPrivateAndNonPrimitiveFields(
      hasOneKeyCalledZero ? (data['0'] as Record<string, unknown>) : data,
      4,
    );
    this._logDebugViewRow(null, null, [eventName, cleanData]);
  }

  // Override the original implementation so that we can add verbose logging to track down potential duplicate events.
  public emit<T extends keyof EventMap>(
    event: T,
    ...args: EventEmitter.ArgumentMap<EventMap>[Extract<T, keyof EventMap>]
  ): boolean {
    logVerbose('Emitting event', event, 'with args', args);
    this.logDebugClient(`CardGame_${event}`, { ...args });
    return super.emit(event, ...args);
  }
  // #endregion Event Handling

  // #region State
  public attachDelegate(delegate: Partial<IMatchGroupDelegate>): void {
    if (this._attachedDelegates.includes(delegate)) {
      return;
    }

    this._attachedDelegates = [...this._attachedDelegates, delegate];
  }

  public detachDelegate(delegate: Partial<IMatchGroupDelegate>): void {
    const filtered = this._attachedDelegates.filter((d) => d !== delegate);
    this._attachedDelegates = filtered;
  }

  public setCinematicActive(active: boolean): void {
    this._cinematicActive = active;

    if (active) {
      this.emit('onCinematicStarted');
    } else {
      this.emit('onCinematicEnded');
    }
  }

  public setTeamChangeAvailableAt(value: string | null) {
    if (!value || !isValidDate(value)) {
      this._teamChangeAvailableAt = null;
      return;
    }
    const teamChangeAvailableAtDate = Date.parse(value);
    const now = Date.now();

    // if the date is in the past, we don't care about it
    if (teamChangeAvailableAtDate < now) {
      this._teamChangeAvailableAt = null;
      return;
    }

    const duration = teamChangeAvailableAtDate - now;

    this._teamChangeAvailableAt = GameTimer.FromNow(duration);
    this.emit('onTeamChangeAvailableAtUpdated');
  }

  public get teamChangeAvailableAt(): GameTimer | null {
    return this._teamChangeAvailableAt;
  }

  public getMatchConnection(): IMatchGroup | null {
    return this._matchGroup;
  }

  public getLocalGroup(): CGGroup | undefined {
    return this.getGroup(this._localGroupId);
  }

  public getLocalPlayer(): CGPlayer | null {
    if (!this.connected) {
      return null;
    }

    const [player] = this.getPlayers(this._localUserId);

    return player;
  }

  public getGroup(id: string): CGGroup | undefined {
    if (!this.connected) {
      return;
    }

    return this._groups.get(id);
  }

  public getPlayer(playerId: string): CGPlayer | null {
    return this._players.get(playerId) ?? null;
  }

  public getPlayers(...playerIds: string[]): CGPlayer[] {
    if (!this.connected) {
      return [];
    }

    const players = playerIds.map((id) => this._players.get(id));

    return players.filter((player) => typeof player !== 'undefined') as CGPlayer[];
  }

  public getServerTime(): Nullable<string> {
    return this._serverTime;
  }

  public getActiveConfig(): GameConfig | null {
    return this._matchConfig ?? null;
  }

  public getPlayerActiveCard(playerId: string): CGActiveCard | undefined {
    return this._activeCards.get(playerId);
  }

  public getPlayerAvailableBooster(playerId: string): CGAvailableBooster | undefined {
    return this._availableBoosters.get(playerId);
  }

  public getPlayerBestPlay(playerId: string): CGActiveCard | undefined {
    return this._bestPlays.get(playerId);
  }

  public getActiveBooster(
    cardOwner: string,
    boosterOwner: string,
  ): CGActiveBooster | undefined {
    const boosterMap = this._activeBoosters.get(cardOwner);

    if (!boosterMap) {
      return;
    }

    return boosterMap.get(boosterOwner);
  }

  public isRoundBasedGame(): boolean {
    return this._matchType === GameLogic.StreamStateMatchType.MATCH_TYPE_MULTI_ROUND;
  }

  public getGameId(): string {
    return this._matchConfig?.gameId ?? '';
  }

  // #endregion State

  // #endregion Remote API

  public async triggerEmote(emoteId: string): Promise<void> {
    return await this._matchGroup?.triggerEmote(emoteId);
  }

  public async triggerEmoji(emojiId: string): Promise<void> {
    return await this._matchGroup?.triggerEmoji(emojiId);
  }

  // #endregion Remote API

  // #region Connection Managemen

  public detach() {
    this._matchGroup?.removeDelegate(this._delegate);
    this._attachedDelegates = [];
    this._matchGroup = null;

    this._reset();
    this._connectionState = ConnectionState.DISCONNECTED;
    this._playerEvents.removeAllListeners();
    this._groupEvents.removeAllListeners();

    logVerbose(`CardGame detaching from active group.`);
  }
  // #endregion Connection Management
}

export type CardGameEventHandler<EventName extends keyof EventMap> = EventListener<
  EventMap,
  EventName
>;
