import { gql } from '@apollo/client';
import * as GameSchemas from '@noice-com/schemas/game-logic/game_logic.pb';
import { ArgumentMap, EventEmitter } from 'eventemitter3';

import type { DelegateEventForwarder } from '../events';
import type { CGPlayer } from '../player';
import type { GameStateProvider } from '../types';

import {
  CGAvailableBoosterOnBoosterRequested,
  CGAvailableBoosterOnBoosterUsed,
  CGAvailableBoosterOnRequestCancelled,
} from './types';

import type { CgAvailableBoosterFragment } from '@game-gen';

type RequestMessage =
  | GameSchemas.BoosterRequestedMsg
  | GameSchemas.BoosterRequestCancelledMsg;

function isBoosterRequestRelevant<Message extends RequestMessage = RequestMessage>(
  booster: CGAvailableBooster,
  msg: Message,
): boolean {
  // These messages are confusing. This could be deconstructed, but for the sake of
  // readability and maintenance, I am just manually re-declaring them.
  const requestee = msg.userId;
  const boosterOwner = msg.targetUserId;

  // Additionally, this could be one-lined but the logic is so confusing I split it.
  if (
    !requestee ||
    boosterOwner !== booster.ownerId ||
    msg.boosterId !== booster.boosterId
  ) {
    return false;
  }

  return true;
}

interface Props {
  owner: string;
  requests?: string[];
  isOwnedLocally?: boolean;
  eventForwarder: DelegateEventForwarder;
  stateProvider: GameStateProvider;
}

interface EventMap {
  onBoosterUsed: [CGAvailableBoosterOnBoosterUsed];
  onBoosterRequested: [CGAvailableBoosterOnBoosterRequested];
  onRequestCancelled: [CGAvailableBoosterOnRequestCancelled];
}

export class CGAvailableBooster extends EventEmitter<EventMap> {
  public static Fragments = {
    availableBooster: gql`
      fragment CgAvailableBooster on GameLogicBooster {
        id
        canTargetSelf
      }
    `,
  };

  /**
   * The ID of the owner of this booster.
   */
  public readonly ownerId: string;

  /**
   * Whether or not the local player owns this booster.
   */
  public readonly isLocallyOwned: boolean;

  private readonly _boosterSchema: CgAvailableBoosterFragment;
  private _currentRequestIds: string[];
  private _forwarder: DelegateEventForwarder;
  private _stateProvider: GameStateProvider;

  /**
   * The current player IDs that have requested this booster.
   */
  public get currentRequests(): string[] {
    return [...this._currentRequestIds];
  }

  /**
   * This boosters ID.
   */
  public get boosterId(): number {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this._boosterSchema.id!;
  }

  // todo event listener
  constructor(booster: CgAvailableBoosterFragment, props: Props) {
    super();

    const { owner, requests, eventForwarder, stateProvider, isOwnedLocally } = props;

    this.ownerId = owner;
    this._boosterSchema = booster;

    this._currentRequestIds = requests ?? [];
    this._forwarder = eventForwarder;
    this._stateProvider = stateProvider;
    this.isLocallyOwned = isOwnedLocally ?? false;

    this._initListeners();
  }

  private _initListeners() {
    const { _forwarder: events } = this;
    events.addListener(this.ownerId, 'onBoosterRequested', this._onBoosterRequested);
    events.addListener(
      this.ownerId,
      'onBoosterRequestCancelled',
      this._onBoosterRequestCancelled,
    );
    events.addListener(this.ownerId, 'onBoosterUsed', this._onBoosterUsed);
    events.addListener('*', 'onActiveCardSucceeded', this._onPlayerCardSucceed);
    events.addListener('*', 'onActiveCardFailed', this._onPlayerCardFailed);
    events.addListener('*', 'onActiveCardSet', this._onPlayerCardSwitched);
  }

  private _removeListeners() {
    const { _forwarder: events } = this;
    events.removeListener(this.ownerId, 'onBoosterRequested', this._onBoosterRequested);
    events.removeListener(
      this.ownerId,
      'onBoosterRequestCancelled',
      this._onBoosterRequestCancelled,
    );
    events.removeListener(this.ownerId, 'onBoosterUsed', this._onBoosterUsed);
    events.removeListener('*', 'onActiveCardSucceeded', this._onPlayerCardSucceed);
    events.removeListener('*', 'onActiveCardFailed', this._onPlayerCardFailed);
    events.removeListener('*', 'onActiveCardSet', this._onPlayerCardSwitched);
  }

  private _removeRequest(requestee: string) {
    // The above function will catch userId being undefined, so we can enforce it.
    // Additionally, these messages are confusing. They are deconstructed in the
    // above helper function.
    // Early return if we can't find the ID.
    const currentPosition = this._currentRequestIds.indexOf(requestee);

    if (currentPosition === -1) {
      return;
    }

    this._currentRequestIds.splice(currentPosition, 1);
    this.emit('onRequestCancelled', { requesteeId: requestee });
  }

  private _onBoosterRequested = (ev: GameSchemas.BoosterRequestedMsg) => {
    if (!isBoosterRequestRelevant(this, ev)) {
      return;
    }

    if (!ev.userId) {
      return;
    }

    // The above function will catch userId being undefined, so we can enforce it.
    // Additionally, these messages are confusing. They are deconstructed in the
    // above helper function.
    const requestee = ev.userId;
    this._currentRequestIds.push(requestee);
    this.emit('onBoosterRequested', { requesteeId: requestee });
  };

  private _onBoosterRequestCancelled = (ev: GameSchemas.BoosterRequestCancelledMsg) => {
    if (!isBoosterRequestRelevant(this, ev)) {
      return;
    }

    if (!ev.userId) {
      return;
    }

    this._removeRequest(ev.userId);
  };

  private _onPlayerCardFailed = (ev: GameSchemas.ActiveCardFailedMsg) => {
    // We are only interested canceling requests if failing card was from
    // one of the requestees.
    if (!ev.userId || ev.userId === this.ownerId) {
      return;
    }

    this._removeRequest(ev.userId);
  };

  private _onPlayerCardSucceed = (ev: GameSchemas.ActiveCardSucceededMsg) => {
    // We are only interested canceling requests if succeeding card was from
    // one of the requestees.
    if (!ev.userId || ev.userId === this.ownerId) {
      return;
    }

    this._removeRequest(ev.userId);
  };

  private _onPlayerCardSwitched = (ev: GameSchemas.ActiveCardSetMsg) => {
    // We are only interested canceling requests if switching card was done by
    // one of the requestees.
    if (!ev.userId || ev.userId === this.ownerId) {
      return;
    }

    this._removeRequest(ev.userId);
  };

  private _onBoosterUsed = ({
    userId,
    targetUserId,
    boosterId,
  }: GameSchemas.BoosterUsedMsg) => {
    if (userId !== this.ownerId || boosterId !== this._boosterSchema.id) {
      return;
    }

    this.emit('onBoosterUsed', {
      targetId: userId,
      targetIsSelf: userId === targetUserId,
    });
    this._deactivate();
  };

  private _deactivate() {
    this.removeAllListeners();
    this._removeListeners();
  }

  public emit<T extends keyof EventMap>(
    event: T,
    ...args: ArgumentMap<EventMap>[Extract<T, keyof EventMap>]
  ): boolean {
    this._stateProvider.logDebugClient(`CGAvailableBooster_${event}`, { ...args });
    return super.emit(event, ...args);
  }

  /**
   * Determines whether or not this booster can be used on the provided player.
   *
   * @param target The target player.
   * @returns true if it can be used.
   */
  public canBeUsedOn(target: CGPlayer): boolean {
    if (target.activeCardID === null) {
      return false;
    }

    if (target.isOnline === false) {
      return false;
    }

    const isTargetSelf = this.ownerId === target.playerID;
    const { canTargetSelf } = this._boosterSchema;

    // This can of course be merged into a single line, however it would be
    // really unreadable so it's swapped to two lines for visibility.
    if (canTargetSelf !== true && isTargetSelf) {
      return false;
    }

    return true;
  }

  /**
   * Checks whether or not the given user ID has requested this booster.
   *
   * @param requestee The user ID we want to check.
   * @returns true if the user ID has requested this booster.
   */
  public boosterRequestExists(requestee: string): boolean {
    return this._currentRequestIds.indexOf(requestee) !== -1;
  }

  /**
   * Use this booster on the target.
   *
   * ONLY USABLE BY THE LOCAL PLAYER.
   * @param target The target player.
   * @returns Bool indiciating success/failure.
   */
  public async useBooster(target: CGPlayer): Promise<boolean> {
    if (!this.canBeUsedOn(target) || !this.isLocallyOwned) {
      return false;
    }

    const matchContext = this._stateProvider.getMatchConnection();
    await matchContext?.useBooster(target.playerID, this.boosterId);
    return true;
  }

  /**
   * Triggers a request for the local player to request this booster.
   *
   * ONLY USABLE BY THE LOCAL PLAYER ON NON-LOCAL PLAYERS.
   * @param target The target player.
   * @returns Bool indiciating success/failure.
   */
  public async requestBooster(): Promise<boolean> {
    if (this.isLocallyOwned) {
      return false;
    }

    const matchContext = this._stateProvider.getMatchConnection();

    if (!matchContext || this.boosterRequestExists(matchContext.localUserId)) {
      return false;
    }

    await matchContext?.requestBooster(this.ownerId, this.boosterId);
    return true;
  }

  /**
   * Triggers a request for the local player to cancel their request on this booster.
   *
   * ONLY USABLE BY THE LOCAL PLAYER ON NON-LOCAL PLAYERS.
   * @param target The target player.
   * @returns Bool indiciating success/failure.
   */
  public async cancelRequest(): Promise<boolean> {
    if (this.isLocallyOwned) {
      return false;
    }

    const matchContext = this._stateProvider.getMatchConnection();

    if (!matchContext || !this.boosterRequestExists(matchContext.localUserId)) {
      return false;
    }

    await matchContext?.cancelBoosterRequest(this.ownerId, this.boosterId);
    return true;
  }
}
