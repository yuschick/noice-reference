import * as GameLogic from '@noice-com/schemas/game-logic/game_logic.pb';
import { makeLoggers } from '@noice-com/utils';
import { ArgumentMap, EventEmitter } from 'eventemitter3';

import type { CGAvailableBooster } from '../boosters';
import type { DelegateEventForwarder } from '../events';
import { GameTimer } from '../timer';
import type { GameStateProvider } from '../types';

import {
  CGPlayerOnAonPointsCollectFailed,
  CGPlayerOnAonPointsCollected,
  CGPlayerOnApplyingBooster,
  CGPlayerOnBoosterAvailable,
  CGPlayerOnBoosterCooldownTimer,
  CGPlayerOnHandUpdated,
  CGPlayerOnCardSelected,
  CGPlayerOnHandShuffled,
  CGPlayerOnInactivityWarning,
  CGPlayerOnMatchBonusReceived,
  CGPlayerOnRemoved,
  CGPlayerOnReshuffleCostUpdated,
  CGPlayerOnScoreUpdated,
  CGPlayerOnSwitchoutTimer,
} from './types';

const { logVerbose, logWarn, logWarnVerbose } = makeLoggers('CGPlayer');

interface ExternalEvents {
  onScoreUpdated: [CGPlayerOnScoreUpdated];
  onCardSelected: [CGPlayerOnCardSelected];
  onSwitchoutTimer: [CGPlayerOnSwitchoutTimer];
  onSwitchoutReady: [];
  onReshuffleCostUpdated: [CGPlayerOnReshuffleCostUpdated];
  onHandShuffled: [CGPlayerOnHandShuffled];
  onHandUpdated: [CGPlayerOnHandUpdated];
  onRemoved: [CGPlayerOnRemoved];
  onBoosterAvailable: [CGPlayerOnBoosterAvailable];
  onBoosterCooldownTimer: [CGPlayerOnBoosterCooldownTimer];
  onAonPointsCollected: [CGPlayerOnAonPointsCollected];
  onAonPointsCollectFailed: [CGPlayerOnAonPointsCollectFailed];
  onApplyingBooster: [CGPlayerOnApplyingBooster];
  onMatchBonusReceived: [CGPlayerOnMatchBonusReceived];
  onInactivityWarning: [CGPlayerOnInactivityWarning];
  onInactivityKick: [];
  onInactivtyKickCancelled: [];
  onInactivityKickPaused: [];
}

export class CGPlayer extends EventEmitter<ExternalEvents> {
  public readonly playerID: string;
  public readonly groupID: string;
  public isOnline: boolean;

  private _stateProvider: GameStateProvider;
  private _eventForwarder: DelegateEventForwarder;

  private _score = 0;
  private _currentHand: string[] = [];
  private _availableMatchCards: string[] = [];

  // @todo see note for the reshuffleTokens getter.
  private _reshuffleTokens = 0;
  private _nextReshuffleCost = 0;
  private _activeCard: string | null = null;
  private _availableBooster: number | null = null;
  private _boosterTimer: GameTimer | null = null;
  private _switchOutTimer: GameTimer | null = null;
  private _disabledCards = new Set<string>();
  private _disconnected = false;
  private _applyingBooster = false;
  private _secondsToInactivityKick = -1;
  private _inactivityKickPaused = false;

  public get score(): number {
    return this._score;
  }

  public get activeCardID(): string | null {
    return this._activeCard;
  }

  public get availableBoosterID(): number | null {
    return this._availableBooster;
  }

  public get nextBoosterTimer(): GameTimer | null {
    return this._boosterTimer;
  }

  public get isSwitchoutReady(): boolean {
    return this._switchOutTimer?.isCompleted ?? false;
  }

  public get switchoutTimer(): GameTimer | null {
    return this._switchOutTimer;
  }

  public get disconnected(): boolean {
    return this._disconnected;
  }

  public get currentHand(): string[] {
    return [...this._currentHand];
  }

  public get disabledCards(): string[] {
    return [...this._disabledCards];
  }

  public get availableMatchCards(): string[] {
    return [...this._availableMatchCards];
  }

  public get isApplyingBooster(): boolean {
    return this._applyingBooster;
  }

  public get secondsToInactivityKick(): number {
    return this._secondsToInactivityKick;
  }

  public get hasInactivityWarning(): boolean {
    return this._secondsToInactivityKick > 0;
  }

  public get isInactivtyKickPaused(): boolean {
    return this._inactivityKickPaused;
  }

  /**
   * @deprecated
   * @todo This is currently only retrievable from the Notification service
   * (aka, through UserStateHandler), and is not provided by the game backend.
   * For now, we will keep it this way but in the future we hope to be able to
   * figure out a good way of getting that data here so everything is in the
   * same place.
   */
  public get reshuffleTokens(): number {
    return this._reshuffleTokens;
  }

  public get nextReshuffleCost(): number {
    return this._nextReshuffleCost;
  }

  // @note: 'initial state' handling is currently done via the
  // `onPlayerJoined` event. This made sense at the time of implementation,
  // but we can always change initial state to occur in the constructor
  // via an optional prop if we feel that it makes more sense :)
  constructor(
    playerId: string,
    groupId: string,
    eventForwarder: DelegateEventForwarder,
    stateProvider: GameStateProvider,
    initialState?: GameLogic.Player,
  ) {
    super();

    this.playerID = playerId;
    this.groupID = groupId;
    this.isOnline = initialState?.isOnline ?? true;
    this._eventForwarder = eventForwarder;
    this._stateProvider = stateProvider;

    this._setupListeners();
  }

  private _initFromState(initial: GameLogic.Player, serverTime?: string) {
    const {
      points = 0,
      activeCard,
      cardSwitchOutTimer,
      hand,
      heldBoosterId = -1,
      boosterCooldownTimer,
    } = initial;

    this._disconnected = false;
    this._score = points;
    this._activeCard = activeCard?.cardId ?? null;
    const lastKnownServerTime = serverTime ?? this._stateProvider.getServerTime();

    // Init switchout timer
    if (cardSwitchOutTimer?.startTime && cardSwitchOutTimer?.endTime) {
      this._switchOutTimer = GameTimer.FromServerTime(
        cardSwitchOutTimer.startTime,
        cardSwitchOutTimer.endTime,
        {
          serverTime: lastKnownServerTime,
        },
      );
      this.emit('onSwitchoutTimer', { timer: this._switchOutTimer });
    } else {
      this.emit('onSwitchoutReady');
    }

    this._currentHand = [...(hand?.cardIds ?? [])];
    this._availableMatchCards = [...(hand?.matchEndCardIds ?? [])];

    // Initialize Boosters
    this._availableBooster = heldBoosterId > -1 ? heldBoosterId : null;

    const timer = boosterCooldownTimer
      ? GameTimer.FromServerTime(
          boosterCooldownTimer.startTime,
          boosterCooldownTimer.endTime,
          {
            serverTime: lastKnownServerTime,
          },
        )
      : null;

    if (timer) {
      this._boosterTimer = timer;
      this.emit('onBoosterCooldownTimer', { timer });
    }
  }

  private _reset() {
    this._disconnected = false;
    this._score = 0;
    this._activeCard = null;
    this._nextReshuffleCost = 0;
    this._switchOutTimer = null;
    this._currentHand = [];
    this._availableMatchCards = [];
    this._availableBooster = null;
    this._boosterTimer = null;
    this._applyingBooster = false;
    this._disabledCards = new Set<string>();
  }

  // ---- Event Handlers
  private _setupListeners() {
    this._eventForwarder.addListener(
      this.playerID,
      'onPlayerPointsUpdated',
      this._onScoreUpdated,
    );
    this._eventForwarder.addListener(this.playerID, 'onActiveCardSet', this._onCardSet);
    this._eventForwarder.addListener(
      this.playerID,
      'onSettingActiveCardFailed',
      this._onSettingActiveCardFailed,
    );
    this._eventForwarder.addListener(
      this.playerID,
      'onActiveCardSucceeded',
      this._onCardSucceeded,
    );
    this._eventForwarder.addListener(
      this.playerID,
      'onActiveCardFailed',
      this._onCardFailed,
    );
    this._eventForwarder.addListener(
      this.playerID,
      'onCardDealingStarted',
      this._onCardDealt,
    );
    this._eventForwarder.addListener(
      this.playerID,
      'onCardDealingEnded',
      this._onCardRemoved,
    );
    this._eventForwarder.addListener(this.playerID, 'onPlayerJoined', this._onJoined);
    this._eventForwarder.addListener(this.playerID, 'onPlayerLeft', this._onDestroy);
    this._eventForwarder.addListener(
      this.playerID,
      'onCardSwitchOutTimerStarted',
      this._onSwitchoutTimer,
    );
    this._eventForwarder.addListener(
      this.playerID,
      'onCardSwitchOutAvailable',
      this._onSwitchoutReady,
    );
    this._eventForwarder.addListener(
      this.playerID,
      'onHandShuffled',
      this._onHandShuffled,
    );
    this._eventForwarder.addListener(
      this.playerID,
      'onShufflingHandFailed',
      this._onShufflingHandFailed,
    );
    this._eventForwarder.addListener(
      this.playerID,
      'onReshuffleCostUpdated',
      this._onReshuffleCostUpdated,
    );
    this._eventForwarder.addListener(
      this.playerID,
      'onBoosterAvailable',
      this._onBoosterAvailable,
    );
    this._eventForwarder.addListener(this.playerID, 'onBoosterUsed', this._onBoosterUsed);
    this._eventForwarder.addListener(
      this.playerID,
      'onBoosterCooldownStarted',
      this._onBoosterCooldownStarted,
    );
    this._eventForwarder.addListener(
      this.playerID,
      'onAonPointsCollected',
      this._onAonPointsCollected,
    );
    this._eventForwarder.addListener(
      this.playerID,
      'onAonPointsCollectFailed',
      this._onAonPointsCollectFailed,
    );
    this._eventForwarder.addListener(
      this.playerID,
      'onMatchBonusReceived',
      this._onMatchBonusReceived,
    );
    this._eventForwarder.addListener(
      this.playerID,
      'onMatchStarted',
      this._onMatchStarted,
    );
    this._eventForwarder.addListener(this.playerID, 'onMatchEnded', this._onMatchEnded);
    this._eventForwarder.addListener(
      this.playerID,
      'onInactivityTimerUpdated',
      this._onInactivityTimerUpdated,
    );
    this._eventForwarder.addListener(
      this.playerID,
      'onInactivityTimerCancelled',
      this._onInactivityTimerCancelled,
    );
    this._eventForwarder.addListener(
      this.playerID,
      'onInactivityKickReceived',
      this._onInactivityKickReceived,
    );
    this._eventForwarder.addListener(
      '*',
      'onMatchPauseStateChanged',
      this._onMatchPauseStateChanged,
    );
  }

  private _removeInternalListeners() {
    this._eventForwarder.removeListener(
      this.playerID,
      'onPlayerPointsUpdated',
      this._onScoreUpdated,
    );
    this._eventForwarder.removeListener(
      this.playerID,
      'onActiveCardSet',
      this._onCardSet,
    );
    this._eventForwarder.removeListener(
      this.playerID,
      'onSettingActiveCardFailed',
      this._onSettingActiveCardFailed,
    );
    this._eventForwarder.removeListener(
      this.playerID,
      'onActiveCardSucceeded',
      this._onCardSucceeded,
    );
    this._eventForwarder.removeListener(
      this.playerID,
      'onActiveCardFailed',
      this._onCardFailed,
    );
    this._eventForwarder.removeListener(
      this.playerID,
      'onCardDealingStarted',
      this._onCardDealt,
    );
    this._eventForwarder.removeListener(
      this.playerID,
      'onCardDealingEnded',
      this._onCardRemoved,
    );
    this._eventForwarder.removeListener(this.playerID, 'onPlayerJoined', this._onJoined);
    this._eventForwarder.removeListener(this.playerID, 'onPlayerLeft', this._onDestroy);
    this._eventForwarder.removeListener(
      this.playerID,
      'onCardSwitchOutTimerStarted',
      this._onSwitchoutTimer,
    );
    this._eventForwarder.removeListener(
      this.playerID,
      'onCardSwitchOutAvailable',
      this._onSwitchoutReady,
    );
    this._eventForwarder.removeListener(
      this.playerID,
      'onHandShuffled',
      this._onHandShuffled,
    );
    this._eventForwarder.removeListener(
      this.playerID,
      'onShufflingHandFailed',
      this._onShufflingHandFailed,
    );
    this._eventForwarder.removeListener(
      this.playerID,
      'onReshuffleCostUpdated',
      this._onReshuffleCostUpdated,
    );
    this._eventForwarder.removeListener(
      this.playerID,
      'onBoosterAvailable',
      this._onBoosterAvailable,
    );
    this._eventForwarder.removeListener(
      this.playerID,
      'onBoosterUsed',
      this._onBoosterUsed,
    );
    this._eventForwarder.removeListener(
      this.playerID,
      'onBoosterCooldownStarted',
      this._onBoosterCooldownStarted,
    );
    this._eventForwarder.removeListener(
      this.playerID,
      'onAonPointsCollected',
      this._onAonPointsCollected,
    );
    this._eventForwarder.removeListener(
      this.playerID,
      'onAonPointsCollectFailed',
      this._onAonPointsCollectFailed,
    );
    this._eventForwarder.removeListener(
      this.playerID,
      'onMatchBonusReceived',
      this._onMatchBonusReceived,
    );
    this._eventForwarder.removeListener(
      this.playerID,
      'onMatchStarted',
      this._onMatchStarted,
    );
    this._eventForwarder.removeListener(
      this.playerID,
      'onMatchEnded',
      this._onMatchEnded,
    );
    this._eventForwarder.removeListener(
      this.playerID,
      'onInactivityTimerUpdated',
      this._onInactivityTimerUpdated,
    );
    this._eventForwarder.removeListener(
      this.playerID,
      'onInactivityTimerCancelled',
      this._onInactivityTimerCancelled,
    );
    this._eventForwarder.removeListener(
      this.playerID,
      'onInactivityKickReceived',
      this._onInactivityKickReceived,
    );
    this._eventForwarder.removeListener(
      '*',
      'onMatchPauseStateChanged',
      this._onMatchPauseStateChanged,
    );
  }

  private _onScoreUpdated = (ev: GameLogic.PlayerPointsUpdatedMsg) => {
    if (!ev.points) {
      return;
    }

    this._score = ev.points;
    this.emit('onScoreUpdated', { scoreTotal: ev.points });
    logVerbose(`~ Player score changed:`, this._score, this);
  };

  private _onCardDealt = (ev: GameLogic.CardDealingStartedMsg) => {
    if (!ev.cardId) {
      return;
    }

    this._disabledCards.delete(ev.cardId);
    this.emit('onHandUpdated', { disabledCardIds: [...this._disabledCards] });
  };

  private _onCardRemoved = (ev: GameLogic.CardDealingEndedMsg) => {
    if (!ev.cardId) {
      return;
    }

    this._disabledCards.add(ev.cardId);
    this.emit('onHandUpdated', { disabledCardIds: [...this._disabledCards] });
  };

  private _onSwitchoutTimer = ({
    startTime,
    endTime,
  }: GameLogic.CardSwitchOutTimerStartedMsg) => {
    const config = this._stateProvider.getActiveConfig();
    const defaultDuration = config?.cardSwitchOutTimerDuration;
    const timer = GameTimer.FromServerTime(startTime, endTime, {
      defaultDuration,
    });

    this._switchOutTimer = timer;

    if (timer === null) {
      return;
    }

    this.emit('onSwitchoutTimer', { timer });
  };

  private _onSwitchoutReady = (_ev: GameLogic.CardSwitchOutAvailableMsg) => {
    // @todo if we get state mismatches here, let's replace the active timer
    // with a 100% complete one (ie. GameTimer.fromEnd(Date.now() - 100, 100))
    // OR make it possible to force-set it complete/add a bool.
    this.emit('onSwitchoutReady');
  };

  private _onCardSet = (ev: GameLogic.ActiveCardSetMsg) => {
    if (!ev.cardId || !ev.pointsUpdateDuration) {
      return;
    }

    this._activeCard = ev.cardId ?? null;
    this.emit('onCardSelected', { cardId: ev.cardId });
  };

  private _onSettingActiveCardFailed = (ev: GameLogic.SettingActiveCardFailedMsg) => {
    // @todo _actual_ implementation of this (we should prob surface it to the player tbh)
    logWarn(
      `Player tried setting active card but it failed! (player: ${this.playerID}, code: ${ev.errorCode})`,
    );
  };

  private _onHandShuffled = (ev: GameLogic.HandShuffledMsg) => {
    const { cardIds = [], matchEndCardIds = [] } = ev;
    this._currentHand = [...cardIds];
    this._availableMatchCards = [...matchEndCardIds];
    this.emit('onHandShuffled', {
      cardIds: [...this._currentHand],
      matchCardIds: [...this._availableMatchCards],
    });
  };

  private _onShufflingHandFailed = (ev: GameLogic.ShufflingHandFailedMsg) => {
    // @todo _actual_ implementation of this (we should prob surface it to the player tbh)
    logWarn(
      `Player tried shuffling hands but it failed! (player: ${this.playerID}, code: ${ev.errorCode})`,
    );
  };

  private _onReshuffleCostUpdated = ({
    nextReshuffleCost,
  }: GameLogic.ReshuffleCostUpdatedMsg) => {
    if (typeof nextReshuffleCost === 'undefined') {
      logWarn(`Received reshuffle cost updated event, but it didn't contain a value!`);
      return;
    }

    this._nextReshuffleCost = nextReshuffleCost;
    this.emit('onReshuffleCostUpdated', { nextReshuffleCost });
  };

  private _onCardSucceeded = (_ev: GameLogic.ActiveCardSucceededMsg) => {
    if (this._applyingBooster) {
      this.toggleBoosterApply(false);
    }
    this._activeCard = null;
    this._switchOutTimer = null;
    this._applyingBooster = false;

    logVerbose(`~ Active card succeeded:`, this);
  };

  private _onCardFailed = (_ev: GameLogic.ActiveCardFailedMsg) => {
    if (this._applyingBooster) {
      this.toggleBoosterApply(false);
    }
    this._activeCard = null;
    this._switchOutTimer = null;
    this._applyingBooster = false;

    logVerbose(`~ Active card failed:`, this);
  };

  private _onBoosterAvailable = ({ boosterId = -1 }: GameLogic.BoosterAvailableMsg) => {
    if (boosterId === -1) {
      return;
    }

    this._availableBooster = boosterId;
    this._boosterTimer = null;

    // Grab the instance of the booster and then emit it
    const instance = this._stateProvider.getPlayerAvailableBooster(this.playerID);

    // Should never happen
    if (!instance) {
      logWarn(
        `Player has a booster but it is not initialized! This could be due to the order of events.\n\tplayer: ${this.playerID}\nbooster: ${boosterId}`,
      );
      return;
    }

    this.emit('onBoosterAvailable', { booster: instance });

    // For dev until UI is implemented
    logVerbose(`~ Booster available!`, this);
  };

  private _onBoosterUsed = ({ userId }: GameLogic.BoosterUsedMsg) => {
    // We have to explicitly state this due to the unique way that booster events work.
    if (userId !== this.playerID) {
      return;
    }

    this._availableBooster = null;
  };

  private _onBoosterCooldownStarted = ({
    startTime,
    endTime,
  }: GameLogic.BoosterCooldownStartedMsg) => {
    if (!startTime || !endTime) {
      return;
    }

    // We cannot reliably use the start and end time given to us, because they are
    // relative to the server game timer. However, we can reliably use them to determine
    // the length of the cooldown, and since we know that it is happening NOW we can
    // just calculate it using that duration and current client time.
    const duration = parseInt(endTime, 10) - parseInt(startTime, 10);
    const timer = GameTimer.FromNow(duration);
    this._boosterTimer = timer;
    // This should already be taken care of with onBoosterUsed, but just to be safe.
    this._availableBooster = null;
    this.emit('onBoosterCooldownTimer', { timer });

    // For dev until UI is implemented
    logVerbose(`~ Booster cooldown started!`, this);
  };

  private _onJoined = (ev: GameLogic.PlayerJoinedMsg) => {
    if (!ev.player) {
      return;
    }

    this.isOnline = ev.player.isOnline ?? true;
    this._disconnected = false;
    this._initFromState(ev.player, ev.serverTime);
  };

  private _onDestroy = (ev: GameLogic.PlayerLeftMsg) => {
    // We want to set disconnected to true before emitting
    // that way if a handler triggers something that needs
    // to check from the player instance, it will be updated.
    if (!ev.permanent) {
      this._disconnected = true;
    }

    this.isOnline = false;
    this.emit('onRemoved', { isPermanent: ev.permanent ?? false });

    if (ev.permanent) {
      this._removeInternalListeners();
      this.removeAllListeners();
    }
  };

  private _onAonPointsCollected = (ev: GameLogic.AONPointsCollectedMsg) => {
    if (!ev.points || !ev.cardId) {
      return;
    }

    this.emit('onAonPointsCollected', {
      cardId: ev.cardId,
      pointsTotal: ev.points,
      isBestPlay: !!ev.bestPlay ?? false,
    });
  };

  private _onAonPointsCollectFailed = (ev: GameLogic.AONPointsCollectFailedMsg) => {
    this.emit('onAonPointsCollectFailed', { errorCode: ev.errorCode });
  };

  private _onMatchBonusReceived = (ev: GameLogic.MatchBonusReceivedMsg) => {
    if (!ev.bonusType || !ev.points) {
      return;
    }

    this.emit('onMatchBonusReceived', { points: ev.points, bonusType: ev.bonusType });
  };

  private _onInactivityTimerUpdated = (ev: GameLogic.InactivityTimerUpdatedMsg) => {
    // This is checked in the Card Game, so we don't need to check it here.
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this._secondsToInactivityKick = ev.secondsRemaining!;
    this._inactivityKickPaused = false;
    this.emit('onInactivityWarning', { secondsRemaining: this._secondsToInactivityKick });
  };

  private _onInactivityTimerCancelled = () => {
    this._secondsToInactivityKick = -1;
    this._inactivityKickPaused = false;
    this.emit('onInactivtyKickCancelled');
  };

  private _onInactivityKickReceived = () => {
    this._secondsToInactivityKick = -1;
    this._inactivityKickPaused = false;
    this._disconnected = true;
    this.emit('onInactivityKick');
  };

  private _onMatchStarted = (_: GameLogic.MatchStartedMsg) => {
    // The warning unpauses after match started, but we dont need to emit an event because
    // the server will send us a new message
    if (this.hasInactivityWarning) {
      this._inactivityKickPaused = false;
    }

    // @todo It might be nice to store all messages received between _onMatchEnded and then
    // handle them after _onMatchStarted (for ex. booster timer messages come right before
    // we received _onMatchStarted), but for now it isn't necessary.
  };

  private _onMatchEnded = (_: GameLogic.MatchEndedMsg) => {
    if (this.hasInactivityWarning) {
      this._inactivityKickPaused = true;
      this.emit('onInactivityKickPaused');
    }

    // @todo Once we start using this game state for the match end screen we may need to
    // move reset to match started, along with the above mentioned buffering of messages.
    this._reset();
  };
  private _onMatchPauseStateChanged = (ev: GameLogic.MatchPauseStateChangedMsg) => {
    if (ev.paused) {
      this._boosterTimer?.pause();
      return;
    }
    this._boosterTimer?.resume();
  };

  // ---- Public API
  public emit<T extends keyof ExternalEvents>(
    event: T,
    ...args: ArgumentMap<ExternalEvents>[Extract<T, keyof ExternalEvents>]
  ): boolean {
    this._stateProvider.logDebugClient(`CGPlayer_${event}`, { ...args });
    return super.emit(event, ...args);
  }

  public canChangeCard(): boolean {
    return this._activeCard === null || (this._switchOutTimer?.isCompleted ?? false);
  }

  public hasMatchCardsAvailable(): boolean {
    return this._availableMatchCards.length > 0;
  }

  public getAvailableBooster(): CGAvailableBooster | null {
    return this._stateProvider.getPlayerAvailableBooster(this.playerID) ?? null;
  }

  public async requestHand(shuffle?: boolean): Promise<void> {
    const context = this._stateProvider.getMatchConnection();

    if (!context) {
      throw new Error("Can't request hand without a match context");
    }

    if (shuffle) {
      return await context.shuffleHand();
    } else {
      return await context.requestHand();
    }
  }

  public async requestChallenges(): Promise<void> {
    const context = this._stateProvider.getMatchConnection();

    if (!context) {
      throw new Error("Can't request challenges without a match context");
    }

    return await context.requestChallenges();
  }

  public async setActiveCard(cardId: string): Promise<void> {
    const context = this._stateProvider.getMatchConnection();

    if (!context) {
      throw new Error("Can't set active card without a match context");
    }

    return await context.setActiveCard(cardId);
  }

  public async setActiveChallenge(challengeId: string): Promise<void> {
    const context = this._stateProvider.getMatchConnection();

    if (!context) {
      throw new Error("Can't set active challenge without a match context");
    }

    return await context.setActiveChallenge(challengeId);
  }

  public async collectAONPoints(): Promise<void> {
    const context = this._stateProvider.getMatchConnection();

    if (!context) {
      throw new Error("Can't collect AON points without a match context");
    }

    return await context.collectAONPoints();
  }

  public toggleBoosterApply(active: boolean): boolean {
    const availableBooster = this.getAvailableBooster();

    if (active && !availableBooster) {
      logWarn('Attempted entering booster apply mode without an available booster!');
      return false;
    }

    if (active && !this._activeCard) {
      logWarnVerbose('Attempted entering booster apply mode without an active card!');
      return false;
    }

    this._applyingBooster = active;
    this.emit('onApplyingBooster', {
      isApplying: this._applyingBooster,
      booster: availableBooster,
    });

    return true;
  }
}
