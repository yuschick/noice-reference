import * as GameLogic from '@noice-com/schemas/game-logic/game_logic.pb';
import { ArgumentMap, EventEmitter } from 'eventemitter3';

import { DelegateEventForwarder } from '../events';

import { CGHighScoringCardsSystemOnHighScoringCard } from './types';

import { GameStateProvider } from '@game-logic/types';

interface ExternalEvents {
  onHighScoringCard: [CGHighScoringCardsSystemOnHighScoringCard];
}

export class CGHighScoringCardsSystem extends EventEmitter<ExternalEvents> {
  private _eventForwarder: DelegateEventForwarder;
  private _stateProvider: GameStateProvider;

  constructor(eventForwarder: DelegateEventForwarder, stateProvider: GameStateProvider) {
    super();

    this._eventForwarder = eventForwarder;
    this._stateProvider = stateProvider;
    this._setupEvents();
  }

  private _setupEvents() {
    this._eventForwarder.addListener(
      '*',
      'onHighScoringCardSucceeded',
      this._onHighScoringCardSucceeded,
    );
    this._eventForwarder.addListener(
      '*',
      'onHighScoringCardPromoted',
      this._onHighScoringCardPromoted,
    );
  }

  private _cleanupEvents() {
    this._eventForwarder.removeListener(
      '*',
      'onHighScoringCardSucceeded',
      this._onHighScoringCardSucceeded,
    );
    this._eventForwarder.removeListener(
      '*',
      'onHighScoringCardPromoted',
      this._onHighScoringCardPromoted,
    );
  }

  private _onHighScoringCardSucceeded = (ev: GameLogic.HighScoringCardSucceededMsg) => {
    const { userId: playerId, groupId, countdownMs } = ev;
    const { cardId, points, boosterPoints } = ev.card ?? {};

    const boosterIds =
      (boosterPoints
        ?.filter((bp) => !!bp.boosterId && bp.cardUserId === bp.userId)
        .map((bp) => bp.boosterId) as number[]) ?? [];

    if (!cardId || !playerId || !groupId || !points) {
      return;
    }

    this.emit('onHighScoringCard', {
      cardId,
      playerId,
      groupId,
      boosterIds,
      points,
      countdownDuration: countdownMs ?? 0,
      isPromoted: false,
    });
  };

  private _onHighScoringCardPromoted = (ev: GameLogic.HighScoringCardPromotedMsg) => {
    const { userId: playerId, groupId } = ev;
    const { cardId, points, boosterPoints } = ev.card ?? {};
    const boosterIds =
      (boosterPoints?.map((bp) => bp.boosterId).filter((id) => !!id) as number[]) ?? [];

    if (!cardId || !playerId || !groupId || !points) {
      return;
    }

    this.emit('onHighScoringCard', {
      cardId,
      playerId,
      groupId,
      boosterIds,
      points,
      countdownDuration: 0,
      isPromoted: true,
    });
  };

  public emit<T extends keyof ExternalEvents>(
    event: T,
    ...args: ArgumentMap<ExternalEvents>[Extract<T, keyof ExternalEvents>]
  ): boolean {
    this._stateProvider.logDebugClient(`CGHighScoringCardsSystem_${event}`, { ...args });
    return super.emit(event, ...args);
  }

  public destroy() {
    this._cleanupEvents();
    this.removeAllListeners();
  }
}
