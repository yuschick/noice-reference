import { gql } from '@apollo/client';
import * as GameLogic from '@noice-com/schemas/game-logic/game_logic.pb';
import { ArrayUtils, Nullable } from '@noice-com/utils';
import { ArgumentMap, EventEmitter } from 'eventemitter3';
import { disableFragmentWarnings } from 'graphql-tag';

import type { CGActiveBooster } from '../boosters';
import { DelegateEventForwarder } from '../events';
import { GameTimer } from '../timer';
import { GameStateProvider } from '../types';

import {
  CGActiveCardOnBoosterAdded,
  CGActiveCardOnBoosterRemoved,
  CGActiveCardOnBoosterReplaced,
  CGActiveCardOnFailed,
  CGActiveCardOnPointsUpdated,
  CGActiveCardOnSucceeded,
  CGActiveCardOnTargetValueChanged,
} from './types';

import { isValidDate } from '@game-utils';

// Disable fragment console warning about duplicate fragments.
// See discussion: https://wearenoice.slack.com/archives/C01RXMKRGDB/p1724681231210379
disableFragmentWarnings();
const GameStateCardTargetValues = gql`
  fragment GameStateCardTargetValues on GameLogicCard {
    targetValues {
      label
      value
      selector {
        attribute
        value {
          __typename
          # Clashing field names are not allowed so need to use aliases.
          ... on BooleanType {
            booleanValue: value
          }
          ... on IntType {
            intValue: value
          }
          ... on StringType {
            stringValue: value
          }
        }
      }
    }
  }
`;

const GameStateCard = gql`
  fragment GameStateCard on GameLogicCard {
    id
    pointsMin
    pointsMax
    pointsTimeTarget
    timerDuration
    targetValue
    isMatchCard
    isAllOrNothing
    ...GameStateCardTargetValues
  }
  ${GameStateCardTargetValues}
`;

interface EventMap {
  // diff is at the end cause I'm not sure we even need it and might remove it.
  onPointsUpdated: [CGActiveCardOnPointsUpdated];
  onTargetValueChanged: [CGActiveCardOnTargetValueChanged];
  onSucceeded: [CGActiveCardOnSucceeded];
  onFailed: [CGActiveCardOnFailed];
  onSwitchedOut: [];
  onBoosterAdded: [CGActiveCardOnBoosterAdded];
  onBoosterReplaced: [CGActiveCardOnBoosterReplaced];
  onBoosterRemoved: [CGActiveCardOnBoosterRemoved];
}

export class CGActiveCard extends EventEmitter<EventMap> {
  public static Fragments = {
    activeCardState: GameStateCard,
    targetValues: GameStateCardTargetValues,
  };

  public readonly cardId: string;
  public readonly ownerId: string;

  private _currentPoints = -1;
  private _maxStaticPoints = -1;
  private _pointChangeTimer: GameTimer | null = null;
  private _currentTargetValue: number | null = null;
  private _currentTimerDuration: number | null = null;
  private _currentTargetValues: { label: string; value: number }[] | null = null;
  private _activeBoosters: Map<string, number> = new Map();
  private _frozen = true;

  private readonly _eventForwarder: DelegateEventForwarder;
  private readonly _stateProvider: GameStateProvider;

  // #region State getters
  /**
   * The current points this card is worth.
   */
  public get currentPoints() {
    return this._currentPoints;
  }

  /**
   * The max points this card can get if no boosters are involved.
   */
  public get maxPoints() {
    return this._maxStaticPoints;
  }

  public get isMaxed() {
    return this._currentPoints >= this._maxStaticPoints;
  }

  /**
   * A timer for when the point value of the card will increase.
   */
  public get pointsUpdateTimer() {
    return this._pointChangeTimer;
  }

  /**
   * The current value of dynamic cards based on a value (ie. gather 50 wood, this could be 20, 40, etc.)
   */
  public get currentTargetValue() {
    return this._currentTargetValue;
  }

  /**
   * The current value of dynamic cards based on time (ie. dont die for 60 seconds, this would be 59, 58, 57, etc.)
   */
  public get currentTimerDuration() {
    return this._currentTimerDuration;
  }

  /**
   * The current target values for this card.
   */
  public get currentTargetValues() {
    return this._currentTargetValues;
  }

  /**
   * Whether or not this card is no longer receiving state updates.
   */
  public get frozen() {
    return this._frozen;
  }
  // #endregion

  // #region Initialization
  constructor(
    cardId: string,
    ownerId: string,
    eventForwarder: DelegateEventForwarder,
    stateProvider: GameStateProvider,
    initialState: GameLogic.ActiveCard = {},
  ) {
    super();

    this.cardId = cardId;
    this.ownerId = ownerId;
    this._eventForwarder = eventForwarder;
    this._stateProvider = stateProvider;

    this._initFromState(initialState);
    this._addListeners();
  }

  /**
   * @note `targetValue` / `timerDuration` are both connected and disconnected.
   * 1. on cards that are strictly time based (don't die for 60 seconds), `targetValue` will equal
   *    the max amount of time (60) and `timerDuration` will equal the current time left (ie. 30)
   * 2. on cards that are strictly dynamic value based (gather 120 wood), `targetValue` will equal
   *    the current amount left for the card to succeed (ie. 100), `timerDuration` is not used.
   *    This also means to know how much the TOTAL amount needed is, you need the data from the
   *    card, ie. `targetValue` from the card data fetched from GQL.
   * 3. on cards that are both time based AND value based (gain 50 shield within 60 seconds), both
   *    `targetValue` and `timerDuration` will equal the CURRENT value, and if you want to compare
   *    them against their targets you need to use the values for these fields within the card from
   *    GQL (ie. `targetValue` 25, `timerDuration` 30).
   */
  private _initFromState({
    points,
    pointsMin,
    pointsMax,
    targetValue,
    pointsUpdateTimer,
    timerDuration,
    activeBoosters,
    targetValues,
  }: GameLogic.ActiveCard) {
    this._frozen = false;
    this._currentPoints = points ?? pointsMin ?? -1;
    this._maxStaticPoints = pointsMax ?? -1;
    this._currentTargetValue = targetValue ?? null;
    this._currentTimerDuration = timerDuration ?? null;

    if (pointsUpdateTimer) {
      const startTime = pointsUpdateTimer.startTime;
      const endTime = pointsUpdateTimer.endTime;

      // sometimes we receive a timer with real dates (instead of relative to server time)
      const isTimerAsDates =
        startTime && endTime && isValidDate(startTime) && isValidDate(endTime);

      if (isTimerAsDates) {
        this._pointChangeTimer = GameTimer.FromDateStrings(startTime, endTime);
      } else {
        this._pointChangeTimer = GameTimer.FromServerTime(
          pointsUpdateTimer.startTime,
          pointsUpdateTimer.endTime,
        );
      }
    }

    if (activeBoosters) {
      Object.entries(activeBoosters).forEach(([ownerId, booster]) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this._activeBoosters.set(ownerId, booster.boosterId!);
      });
    }

    if (targetValues) {
      this._currentTargetValues = Object.entries(targetValues).map(([key, value]) => ({
        label: key,
        value: value,
      }));
    }
  }
  // #endregion Initialization

  // #region Event Handlers
  private _addListeners() {
    this._eventForwarder.addListener(
      this.ownerId,
      'onActiveCardPointsUpdated',
      this._onPointsUpdated,
    );
    this._eventForwarder.addListener(
      this.ownerId,
      'onActiveCardTargetValueChanged',
      this._onTargetValueChanged,
    );
    this._eventForwarder.addListener(
      this.ownerId,
      'onActiveCardSucceeded',
      this._onCardSucceeded,
    );
    this._eventForwarder.addListener(this.ownerId, 'onActiveCardSet', this._onCardSet);
    this._eventForwarder.addListener(
      this.ownerId,
      'onActiveCardFailed',
      this._onCardFailed,
    );
    this._eventForwarder.addListener(this.ownerId, 'onBoosterUsed', this._onBoosterUsed);
    this._eventForwarder.addListener(
      this.ownerId,
      'onBoosterRemoved',
      this._onBoosterRemoved,
    );
  }

  private _removeListeners() {
    this._eventForwarder.removeListener(
      this.ownerId,
      'onActiveCardPointsUpdated',
      this._onPointsUpdated,
    );
    this._eventForwarder.removeListener(
      this.ownerId,
      'onActiveCardTargetValueChanged',
      this._onTargetValueChanged,
    );
    this._eventForwarder.removeListener(
      this.ownerId,
      'onActiveCardSucceeded',
      this._onCardSucceeded,
    );
    this._eventForwarder.removeListener(this.ownerId, 'onActiveCardSet', this._onCardSet);
    this._eventForwarder.removeListener(
      this.ownerId,
      'onActiveCardFailed',
      this._onCardFailed,
    );
    this._eventForwarder.removeListener(
      this.ownerId,
      'onBoosterUsed',
      this._onBoosterUsed,
    );
    this._eventForwarder.removeListener(
      this.ownerId,
      'onBoosterRemoved',
      this._onBoosterRemoved,
    );
  }

  private _onPointsUpdated = (ev: GameLogic.ActiveCardPointsUpdatedMsg) => {
    if (this._frozen || ev.cardId !== this.cardId || !ev.points) {
      return;
    }

    const newPoints = ev.points;
    const pointsDifference = newPoints - this._currentPoints;
    this._currentPoints = newPoints;

    // Figure out when the next update will come.
    let nextPointsTimer: Nullable<GameTimer> = null;
    const timeUntilNextUpdate = ev.pointsUpdateDuration
      ? parseInt(ev.pointsUpdateDuration, 10)
      : 0;

    if (timeUntilNextUpdate) {
      nextPointsTimer = GameTimer.FromNow(timeUntilNextUpdate);
      this._pointChangeTimer = nextPointsTimer;
    }

    this.emit('onPointsUpdated', {
      pointsTotal: newPoints,
      nextPointsTimer,
      pointsDifference,
      isMaxedOut: !nextPointsTimer,
    });
  };

  // fortnite card 32 has both timer duration and target value
  private _onTargetValueChanged = (ev: GameLogic.ActiveCardTargetValueChangedMsg) => {
    if (this._frozen || ev.cardId !== this.cardId) {
      return;
    }

    // See note on _initFromState for info on these two.
    const { targetValue, timerDuration, targetValues } = ev;

    // Using explicit `typeof` here due to possibility of these being `0`
    if (typeof targetValue !== 'undefined') {
      this._currentTargetValue = targetValue ?? null;
    }

    if (typeof timerDuration !== 'undefined') {
      this._currentTimerDuration = timerDuration ?? null;
    }

    if (targetValues) {
      this._currentTargetValues =
        this._currentTargetValues?.map(({ label, value }) => ({
          label,
          value: targetValues[label] ?? value,
        })) ?? null;
    }

    this.emit('onTargetValueChanged', {
      targetValue: this._currentTargetValue,
      timerDuration: this._currentTimerDuration,
      targetValues: this._currentTargetValues,
    });
  };

  private _onCardSet = (ev: GameLogic.ActiveCardSetMsg) => {
    // If we're already on this card, ignore the event.
    if (this.cardId === ev.cardId) {
      return;
    }

    this.freeze();
    this.emit('onSwitchedOut');
  };

  private _onCardSucceeded = (ev: GameLogic.ActiveCardSucceededMsg) => {
    this._currentPoints = ev.points ?? this._currentPoints;

    const allOrNothing =
      ev.allOrNothing?.nextPoints && ev.allOrNothing?.totalPoints
        ? {
            nextPoints: ev.allOrNothing.nextPoints,
            totalPoints: ev.allOrNothing.totalPoints,
          }
        : null;
    const boosterPoints =
      (ev.boosterPoints
        ?.map(({ boosterId, points }) =>
          boosterId
            ? {
                boosterId,
                points,
              }
            : null,
        )
        .filter(Boolean) as CGActiveCardOnSucceeded['boosterPoints']) ?? [];

    this.freeze();
    this.emit('onSucceeded', {
      isBestPlay: !!ev.bestPlay,
      allOrNothing,
      pointsTotal: ev.points ?? this._currentPoints,
      boosterPoints,
    });
  };

  private _onCardFailed = (ev: GameLogic.ActiveCardFailedMsg) => {
    if (!ev.reason) {
      return;
    }

    const boosterPoints =
      (ev.boosterPoints
        ?.map(({ boosterId, points }) =>
          boosterId
            ? {
                boosterId,
                points,
              }
            : null,
        )
        .filter(Boolean) as CGActiveCardOnFailed['boosterPoints']) ?? [];

    this.freeze();
    this.emit('onFailed', {
      reason: ev.reason,
      pointsTotal: ev.points ?? this._currentPoints,
      boosterPoints,
    });
  };

  private _onBoosterUsed = (ev: GameLogic.BoosterUsedMsg) => {
    if (!ev.userId || !ev.boosterId) {
      return;
    }

    const existingBooster = this._activeBoosters.get(ev.userId);
    this._activeBoosters.set(ev.userId, ev.boosterId);

    const booster = this._stateProvider.getActiveBooster(this.ownerId, ev.userId);

    if (!booster) {
      return;
    }

    if (typeof existingBooster === 'number') {
      this.emit('onBoosterReplaced', { booster, boosterOwnerId: ev.userId });
    } else {
      this.emit('onBoosterAdded', { booster, boosterOwnerId: ev.userId });
    }
  };

  private _onBoosterRemoved = (ev: GameLogic.BoosterRemovedMsg) => {
    if (!ev.activatorUserId) {
      return;
    }

    this._activeBoosters.delete(ev.activatorUserId);
    this.emit('onBoosterRemoved', { boosterOwnerId: ev.activatorUserId });
  };

  // #endregion Event Handlers
  // #region State

  public emit<T extends keyof EventMap>(
    event: T,
    ...args: ArgumentMap<EventMap>[Extract<T, keyof EventMap>]
  ): boolean {
    this._stateProvider.logDebugClient(`CGActiveCard_${event}`, { ...args });
    return super.emit(event, ...args);
  }

  public getActiveBoosters(): CGActiveBooster[] {
    const owners = [...this._activeBoosters.keys()];

    return ArrayUtils.mapExisting(owners, (boosterOwner) =>
      this._stateProvider.getActiveBooster(this.ownerId, boosterOwner),
    );
  }

  public getPlayerActiveBooster(playerId: string): CGActiveBooster | undefined {
    return this._stateProvider.getActiveBooster(this.ownerId, playerId);
  }

  public freeze() {
    this._frozen = true;
    this._removeListeners();
  }

  public unfreeze() {
    this._frozen = false;
    this._addListeners();
  }

  // #endregion State
}
