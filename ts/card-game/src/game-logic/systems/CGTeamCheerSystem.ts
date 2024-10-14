import { IMatchGroup } from '@noice-com/platform-client';
import {
  ContextualTeamActionStatus,
  ContextualTeamActionType,
  ContextualTeamActionUpdateMsg,
} from '@noice-com/schemas/game-logic/game_logic.pb';
import { Nullable, makeLoggers } from '@noice-com/utils';
import { ArgumentMap, EventEmitter, EventListener } from 'eventemitter3';

import { DelegateEventForwarder } from '@game-logic/events';
import { GameStateProvider } from '@game-logic/types';

const { logWarn } = makeLoggers('game-logic:systems:CGTeamCheerSystem');

export interface TeamCheerSnapshot {
  teamSize: number;
  acceptedParticipants: number;
  timeLeftMs: number;
  state: ContextualTeamActionStatus;
}

interface ExternalEvents {
  onTeamActionStarted: [participants: Record<string, boolean>, timeLeftMs: number];
  onTeamActionUpdated: [participants: Record<string, boolean>, timeLeftMs: number];
  onTeamActionSucceeded: [participants: Record<string, boolean>];
  onTeamActionFailed: [participants: Record<string, boolean>];
}

export class CGTeamCheerSystem extends EventEmitter<ExternalEvents> {
  public matchGroup?: IMatchGroup;

  private _eventForwarder: DelegateEventForwarder;
  private _stateProvider: GameStateProvider;

  private _currentActionParticipants: Nullable<Record<string, boolean>>;
  private _currentActionTimeLeftMs: Nullable<number>;
  private _previousAction: Nullable<TeamCheerSnapshot>;

  public get currentParticipants() {
    return this._currentActionParticipants;
  }

  public get currentAcceptedParticipantCount() {
    return this._getAcceptedParticipants(this._currentActionParticipants ?? {});
  }

  public get totalParticipants() {
    return this._getTeamSize(this._currentActionParticipants ?? {});
  }

  public get currentTimeLeftMs() {
    return this._currentActionTimeLeftMs;
  }

  public get isActionInProgress() {
    return this._currentActionTimeLeftMs !== null;
  }

  public get previousAction() {
    return this._previousAction;
  }

  constructor(
    forwarder: DelegateEventForwarder,
    stateProvider: GameStateProvider,
    matchGroup?: IMatchGroup,
  ) {
    super();

    this._eventForwarder = forwarder;
    this._stateProvider = stateProvider;
    this.matchGroup = matchGroup;

    this._previousAction = null;
    this._currentActionParticipants = null;
    this._currentActionTimeLeftMs = null;

    this._setupEvents();
  }

  private _setupEvents() {
    this._eventForwarder.addListener(
      '*',
      'onContextualTeamActionUpdate',
      this._handleTeamCheerMessage,
    );
  }

  private _cleanupEvents() {
    this._eventForwarder.removeListener(
      '*',
      'onContextualTeamActionUpdate',
      this._handleTeamCheerMessage,
    );
  }

  private _getTeamSize(obj: Record<string, unknown>) {
    return Object.keys(obj).length;
  }

  private _getAcceptedParticipants(obj: Record<string, boolean>) {
    return Object.values(obj).filter((accepted) => !!accepted).length;
  }

  private _isTeamCheerMessage = (msg: ContextualTeamActionUpdateMsg): boolean =>
    msg.type ===
      ContextualTeamActionType.CONTEXTUAL_TEAM_ACTION_TYPE_HIGH_SCORING_CARD_PROMOTED ||
    msg.type === ContextualTeamActionType.CONTEXTUAL_TEAM_ACTION_TYPE_STREAMER_ACTIVATED;

  private _handleTeamCheerMessage = (msg: ContextualTeamActionUpdateMsg) => {
    if (!this._isTeamCheerMessage(msg)) {
      return;
    }

    const { participants = {}, deadlineMs = '0', status } = msg;

    const timeLeft = parseInt(deadlineMs, 10);

    // Store the current action participants and time left when the action is ongoing
    if (status === ContextualTeamActionStatus.CONTEXTUAL_TEAM_ACTION_STATUS_ONGOING) {
      const eventName = this.isActionInProgress
        ? 'onTeamActionUpdated'
        : 'onTeamActionStarted';

      this._currentActionParticipants = participants;
      // Only update the time left if it's greater than the current time left
      this._currentActionTimeLeftMs =
        timeLeft > (this._currentActionTimeLeftMs ?? 0)
          ? timeLeft
          : this._currentActionTimeLeftMs ?? 0;

      this.emit(
        eventName,
        this._currentActionParticipants,
        this._currentActionTimeLeftMs,
      );
      return;
    }

    // Clear the current action participants and time left when the action is finished
    this._currentActionParticipants = null;
    this._currentActionTimeLeftMs = null;
    this._previousAction = {
      teamSize: this._getTeamSize(participants),
      acceptedParticipants: this._getAcceptedParticipants(participants),
      timeLeftMs: timeLeft,
      state:
        status ?? ContextualTeamActionStatus.CONTEXTUAL_TEAM_ACTION_STATUS_UNSPECIFIED,
    };

    if (status === ContextualTeamActionStatus.CONTEXTUAL_TEAM_ACTION_STATUS_SUCCEEDED) {
      this.emit('onTeamActionSucceeded', participants);
    } else {
      this.emit('onTeamActionFailed', participants);
    }
  };

  public getSnapshot(): TeamCheerSnapshot {
    return {
      timeLeftMs: this._currentActionTimeLeftMs ?? 0,
      acceptedParticipants: this.currentAcceptedParticipantCount,
      teamSize: this.totalParticipants,
      state: this.isActionInProgress
        ? ContextualTeamActionStatus.CONTEXTUAL_TEAM_ACTION_STATUS_ONGOING
        : ContextualTeamActionStatus.CONTEXTUAL_TEAM_ACTION_STATUS_UNSPECIFIED,
    };
  }

  public async joinTeamCheer() {
    if (!this.matchGroup) {
      logWarn('System does not have a match group!');
      return await Promise.resolve();
    }

    return await this.matchGroup?.joinTeamAction();
  }

  public emit<T extends keyof ExternalEvents>(
    event: T,
    ...args: ArgumentMap<ExternalEvents>[Extract<T, keyof ExternalEvents>]
  ): boolean {
    this._stateProvider.logDebugClient(`CGTeamCheerSystem_${event}`, { ...args });
    return super.emit(event, ...args);
  }

  public reset() {
    this._currentActionParticipants = null;
    this._currentActionTimeLeftMs = null;
  }

  public destroy() {
    this.reset();
    this._cleanupEvents();
    this.removeAllListeners();
  }
}

export type TeamCheerStartedEvent = EventListener<ExternalEvents, 'onTeamActionStarted'>;
export type TeamCheerOngoingEvent = EventListener<ExternalEvents, 'onTeamActionUpdated'>;
export type TeamCheerSucceededEvent = EventListener<
  ExternalEvents,
  'onTeamActionSucceeded'
>;
export type TeamCheerFailedEvent = EventListener<ExternalEvents, 'onTeamActionFailed'>;
