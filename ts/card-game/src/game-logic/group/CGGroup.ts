import * as GameLogic from '@noice-com/schemas/game-logic/game_logic.pb';
import { ArgumentMap, EventEmitter } from 'eventemitter3';

import { DelegateEventForwarder } from '../events';
import { CGPlayer } from '../player';
import { GameStateProvider } from '../types';

import {
  CGGroupOnPlayerJoined,
  CGGroupOnPlayerLeft,
  CGGroupOnScoreUpdated,
} from './types';

interface ExternalEvents {
  onScoreUpdated: [CGGroupOnScoreUpdated];
  onPlayerJoined: [CGGroupOnPlayerJoined];
  onPlayerLeft: [CGGroupOnPlayerLeft];
}

export class CGGroup extends EventEmitter<ExternalEvents> {
  public readonly groupID: string;
  private _eventForwarder: DelegateEventForwarder;
  private _players: Set<string>;
  private _score: number;
  private _name: string;
  private _isSolo: boolean;

  private _stateProvider: GameStateProvider;

  public get name() {
    return this._name;
  }

  public get score() {
    return this._score;
  }

  public get isSolo() {
    return this._isSolo;
  }

  constructor(
    groupId: string,
    eventForwarder: DelegateEventForwarder,
    stateProvider: GameStateProvider,
    initialState?: GameLogic.Group,
  ) {
    super();

    this.groupID = groupId;
    this._score = 0;
    this._name = 'Unknown Group';
    this._isSolo = false;

    this._players = new Set();

    this._stateProvider = stateProvider;
    this._eventForwarder = eventForwarder;
    this._setupEvents();

    if (initialState) {
      this._initFromState(initialState);
    }
  }

  private _initFromState(initial: GameLogic.Group) {
    this._score = initial.points ?? 0;
    this._name = initial.name ?? 'Unknown Group';
    this._isSolo = initial.isSolo ?? false;
  }

  private _setupEvents() {
    this._eventForwarder.addListener(
      this.groupID,
      'onPlayerJoined',
      this._onPlayerJoined,
    );
    this._eventForwarder.addListener(this.groupID, 'onPlayerLeft', this._onPlayerLeft);
    this._eventForwarder.addListener(
      this.groupID,
      'onGroupPointsUpdated',
      this._onScoreUpdated,
    );
  }

  private _onPlayerJoined = ({ player }: GameLogic.PlayerJoinedMsg) => {
    if (!player || !player.userId) {
      return;
    }

    this._players.add(player.userId);
    this.emit('onPlayerJoined', {
      playerId: player.userId,
      currentGroup: this.getGroupPlayers(),
    });
  };

  private _onPlayerLeft = ({ userId, permanent }: GameLogic.PlayerLeftMsg) => {
    if (!userId) {
      return;
    }

    if (permanent) {
      this._players.delete(userId);
    }

    this.emit('onPlayerLeft', { playerId: userId, currentGroup: this.getGroupPlayers() });
  };

  private _onScoreUpdated = ({ points }: GameLogic.GroupPointsUpdatedMsg) => {
    if (!points) {
      return;
    }

    this._score = points;
    this.emit('onScoreUpdated', { scoreTotal: points });
  };

  public emit<T extends keyof ExternalEvents>(
    event: T,
    ...args: ArgumentMap<ExternalEvents>[Extract<T, keyof ExternalEvents>]
  ): boolean {
    this._stateProvider.logDebugClient(`CGGroup_${event}`, { ...args });
    return super.emit(event, ...args);
  }

  public destroy() {
    this._players.clear();
    this._eventForwarder.removeAllListeners(this.groupID);
  }

  public hasPlayer(id: string): boolean {
    return this._players.has(id);
  }

  public getPlayerIds(): string[] {
    return [...this._players.values()];
  }

  public getPlayer(id: string): CGPlayer | undefined {
    const [player] = this._stateProvider.getPlayers(id);

    return player;
  }

  public getGroupPlayers(): CGPlayer[] {
    return this._stateProvider.getPlayers(...this._players.values());
  }

  public cloneWithID(newID: string): CGGroup {
    const clone = new CGGroup(newID, this._eventForwarder, this._stateProvider, {
      points: this._score,
      name: this._name,
    });

    // @note Because it is an instance of the same class, TS lets us do this.
    // If we don't to follow this pattern though, we can populate the clones
    // players array via events.
    this._players.forEach((player) => clone._players.add(player));

    return clone;
  }
}
