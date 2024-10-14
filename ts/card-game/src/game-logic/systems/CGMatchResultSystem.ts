import * as Schemas from '@noice-com/schemas/game-logic/game_logic.pb';
import { Nullable, makeLoggers } from '@noice-com/utils';
import { ArgumentMap, EventEmitter } from 'eventemitter3';

import { DelegateEventForwarder } from '@game-logic/events';
import { GameStateProvider } from '@game-logic/types';

const { logVerbose, logError } = makeLoggers('game-logic:systems:CGMatchResultSystem');

interface ExternalEvents {
  onMatchResultsAvailable: [];
  onMatchResultsCleared: [];
}

export class CGMatchResultSystem extends EventEmitter<ExternalEvents> {
  /**
   * If someone got a victory royale bonus, delay the matchend for this amount
   * because the card game is showing the victory royale bonus for this duration
   */
  public static readonly VictoryRoyaleDelay = 2250;
  private _localUserId: string;

  private _eventForwarder: DelegateEventForwarder;
  private _stateProvider: GameStateProvider;

  private _matchResults: Nullable<Schemas.MatchEndedMsg>;
  private _delayMatchEnd: boolean;
  private _matchEndTimeout: Nullable<number>;

  public get matchResults() {
    return this._matchResults;
  }

  constructor(
    localPlayerId: string,
    forwarder: DelegateEventForwarder,
    stateProvider: GameStateProvider,
  ) {
    super();

    this._eventForwarder = forwarder;
    this._stateProvider = stateProvider;

    this._localUserId = localPlayerId;
    this._matchResults = null;
    this._delayMatchEnd = false;
    this._matchEndTimeout = null;

    this._setupEvents();
  }

  private _setupEvents() {
    this._eventForwarder.addListener('*', 'onMatchEnded', this._handleMatchEnded);
    this._eventForwarder.addListener(
      '*',
      'onMatchBonusReceived',
      this._handleMatchBonusReceived,
    );
    this._eventForwarder.addListener('*', 'onMatchStarted', this._handleMatchStarted);
    logVerbose(`Initialized.`);
  }

  private _cleanupEvents() {
    this._eventForwarder.removeListener('*', 'onMatchEnded', this._handleMatchEnded);
    this._eventForwarder.removeListener(
      '*',
      'onMatchBonusReceived',
      this._handleMatchBonusReceived,
    );
    this._eventForwarder.removeListener('*', 'onMatchStarted', this._handleMatchStarted);
    logVerbose(`Cleaned.`);
  }

  private _handleMatchEnded = (ev: Schemas.MatchEndedMsg) => {
    this._matchResults = { ...ev };
    const { players } = ev;

    if (!players) {
      logError('MatchEndedMsg missing required fields');
      return;
    }

    // Re-order players so that local player is always first
    const sortedPlayers = [...players];
    sortedPlayers.sort((a, b) => {
      if (a.userId === this._localUserId) {
        return -1;
      }

      if (b.userId === this._localUserId) {
        return 1;
      }

      return 0;
    });

    this._matchResults = {
      ...ev,
      players: sortedPlayers,
    };

    const delay = this._delayMatchEnd ? CGMatchResultSystem.VictoryRoyaleDelay : 0;
    this._matchEndTimeout = window.setTimeout(() => {
      this.emit('onMatchResultsAvailable');
      this._matchEndTimeout = null;
      logVerbose(`Match End results available.`, this._matchResults);
    }, delay);
  };

  private _handleMatchBonusReceived = (ev: Schemas.MatchBonusReceivedMsg) => {
    if (ev.bonusType === Schemas.MatchBonusType.MATCH_BONUS_TYPE_VICTORY_ROYAL) {
      logVerbose(`Match bonus received, delaying match end.`);
      this._delayMatchEnd = true;
    }
  };

  private _handleMatchStarted = () => {
    const shouldEmit = this._matchResults !== null;
    this.reset();

    if (shouldEmit) {
      logVerbose(`Match results cleared.`);
      this.emit('onMatchResultsCleared');
    }
  };

  public emit<T extends keyof ExternalEvents>(
    event: T,
    ...args: ArgumentMap<ExternalEvents>[Extract<T, keyof ExternalEvents>]
  ): boolean {
    this._stateProvider.logDebugClient(`CGMatchResultSystem_${event}`, { ...args });
    return super.emit(event, ...args);
  }

  public reset() {
    this._matchResults = null;
    this._delayMatchEnd = false;

    if (this._matchEndTimeout !== null) {
      window.clearTimeout(this._matchEndTimeout);
      this._matchEndTimeout = null;
    }

    logVerbose(`Reset..`);
  }

  public destroy() {
    this.reset();
    this._cleanupEvents();
    this.removeAllListeners();
    logVerbose(`Destroyed..`);
  }
}
