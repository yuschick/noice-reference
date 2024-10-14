import { ApolloClient, gql, NormalizedCacheObject } from '@apollo/client';
import * as GameLogic from '@noice-com/schemas/game-logic/game_logic.pb';
import { Nullable } from '@noice-com/utils';
import EventEmitter, { ArgumentMap } from 'eventemitter3';

import {
  ChallengesContentChallengesQuery,
  ChallengesContentChallengesQueryVariables,
} from '@game-gen';
import { DelegateEventForwarder } from '@game-logic/events';
import { GameStateProvider } from '@game-logic/types';

interface EventMap {
  onChallengesEnabledUpdated: [];
  onNewChallengesReceived: [];
  onChallengePickRatesUpdated: [];
  onChallengesUpdated: [];
  onChallengeSelected: [];
  onChallengesLockUpdated: [];
}

export class CGChallengesSystem extends EventEmitter<EventMap> {
  private static Fragments = {
    challengeValueFragment: gql`
      fragment CGChallengesSystemChallenge on GameLogicChallenge {
        id
        targetValues {
          label
          value
        }
      }
    `,
  };
  private static Queries = {
    challengeQuery: gql`
      query CGChallengesSystemChallenges($challengeIds: [String!]!) {
        challengesBatch(challengeIds: $challengeIds) {
          challenges {
            ...CGChallengesSystemChallenge
          }
        }
      }
      ${CGChallengesSystem.Fragments.challengeValueFragment}
    `,
  };

  private _localUserId: string;
  private _selectedChallengeId: Nullable<string> = null;
  private _challenges: GameLogic.ChallengeStatus[] = [];
  private _isEnabled = false;
  private _challengeIds: string[] = [];

  private _isChallengesLocked = true;
  private readonly _eventForwarder: DelegateEventForwarder;
  private readonly _stateProvider: GameStateProvider;
  private readonly _dataProvider: ApolloClient<NormalizedCacheObject>;

  constructor(
    localUserId: string,
    eventForwarder: DelegateEventForwarder,
    stateProvider: GameStateProvider,
    dataProvider: ApolloClient<NormalizedCacheObject>,
  ) {
    super();

    this._reset();
    this._localUserId = localUserId;
    this._stateProvider = stateProvider;
    this._eventForwarder = eventForwarder;
    this._dataProvider = dataProvider;

    this._initListeners();
  }

  // #region Event handling

  private _initListeners() {
    this._eventForwarder.addListener(
      '*',
      'onChallengePickRatesUpdate',
      this._onChallengePickRatesUpdate,
    );
    this._eventForwarder.addListener(
      '*',
      'onAvailableChallenges',
      this._onAvailableChallenges,
    );
    this._eventForwarder.addListener('*', 'onChallengeEvent', this._onChallengeEvent);
    this._eventForwarder.addListener('*', 'onGameInit', this._onGameInit);
    this._eventForwarder.addListener(
      this._localUserId,
      'onSetActiveChallenge',
      this._onSetActiveChallenge,
    );
    this._eventForwarder.addListener(
      '*',
      'onChallengePicksLocked',
      this._onChallengePicksLocked,
    );
    this._eventForwarder.addListener('*', 'onMatchEnded', this._onMatchEnded);
  }

  private _removeListeners() {
    this._eventForwarder.removeListener(
      '*',
      'onChallengePickRatesUpdate',
      this._onChallengePickRatesUpdate,
    );
    this._eventForwarder.removeListener(
      '*',
      'onAvailableChallenges',
      this._onAvailableChallenges,
    );
    this._eventForwarder.removeListener('*', 'onChallengeEvent', this._onChallengeEvent);
    this._eventForwarder.removeListener('*', 'onGameInit', this._onGameInit);
    this._eventForwarder.removeListener(
      this._localUserId,
      'onSetActiveChallenge',
      this._onSetActiveChallenge,
    );
  }
  private _onAvailableChallenges = async (
    ev: GameLogic.AvailableChallengesMsg,
  ): Promise<void> => {
    if (
      ev.challengeIds !== undefined &&
      ev.challengeIds.join('|') !== this._challengeIds.join('|')
    ) {
      this._challengeIds = ev.challengeIds;

      // we need to fetch the static values of the challenges
      const staticChallenges = await this._fetchChallengeStaticData(this._challengeIds);

      const staticValues = new Map<string, { label: string; value: number }[]>();
      staticChallenges?.forEach((i) => {
        staticValues.set(
          i.id,
          i.targetValues.map((i) => ({
            value: i.value,
            label: i.label,
          })),
        );
      });

      const challenges: GameLogic.ChallengeStatus[] =
        staticChallenges?.map((challenge) => ({
          challengeId: challenge.id,
          challengeState: GameLogic.ChallengeState.CHALLENGE_STATE_UNRESOLVED,
          pickRate: 0,
          targetValues: challenge.targetValues.map((i) => ({
            value: i.value,
            label: i.label,
          })),
        })) || [];

      this._challenges = challenges;
      this._isChallengesLocked = false;

      this.emit('onNewChallengesReceived');
      this.emit('onChallengesLockUpdated');
    }
  };

  private _onChallengePickRatesUpdate = (
    ev: GameLogic.ChallengePickRatesUpdateMsg,
  ): void => {
    this._updatePickRatesFromMsg(ev);
    this.emit('onChallengePickRatesUpdated');
  };

  private _onChallengeEvent = (ev: GameLogic.ChallengeEventMsg): void => {
    if (ev.challengeId) {
      const challenge = this._challenges.find((i) => i.challengeId === ev.challengeId);
      if (challenge) {
        challenge.challengeState = ev.challengeState;
        challenge.targetValues = ev.targetValues;
      }
    }
    this.emit('onChallengesUpdated');
  };

  private _onGameInit = async (ev: GameLogic.GameInitMsg): Promise<void> => {
    if (!ev.challengeStatesData) {
      return;
    }

    await this._initFromState(ev.challengeStatesData);

    const selectedChallengeId =
      ev.matchStateData?.players?.find((p) => p.userId === this._localUserId)
        ?.activeChallengeId ?? null;

    if (selectedChallengeId) {
      this._selectedChallengeId = selectedChallengeId;
      this.emit('onChallengeSelected');
    }

    this._isChallengesLocked =
      ev.matchStateData?.streamState?.matchState ===
        GameLogic.StreamStateMatchState.MATCH_STATE_ACTIVE ||
      ev.matchStateData?.streamState?.matchState ===
        GameLogic.StreamStateMatchState.MATCH_STATE_PAUSED;

    this.emit('onNewChallengesReceived');
    this.emit('onChallengesLockUpdated');
    this.emit('onChallengesEnabledUpdated');
  };

  private _onSetActiveChallenge = (ev: GameLogic.SetActiveChallengeMsg): void => {
    if (!ev.challengeId) {
      return;
    }

    this._selectedChallengeId = ev.challengeId;
    this.emit('onChallengeSelected');
  };

  private _onChallengePicksLocked = (ev: GameLogic.ChallengePicksLockedMsg): void => {
    if (!ev.pickRates) {
      return;
    }
    this._isChallengesLocked = true;
    this._updatePickRatesFromMsg(ev);
    this.emit('onChallengesLockUpdated');
    this.emit('onChallengePickRatesUpdated');
  };

  private _onMatchEnded = (_ev: GameLogic.MatchEndedMsg): void => {
    this._isChallengesLocked = false;
    this.emit('onChallengesLockUpdated');
  };

  // #endregion Event handling

  // #region Data Getters

  // TODO: This needs to be cached atleast, since its only static data
  // Not sure if this is correct place for it or should it be in CardGame.ts
  private _fetchChallengeStaticData = async (challengeIds: string[]) => {
    const result = await this._dataProvider.query<
      ChallengesContentChallengesQuery,
      ChallengesContentChallengesQueryVariables
    >({
      query: CGChallengesSystem.Queries.challengeQuery,
      variables: {
        challengeIds: challengeIds,
      },
    });

    return result.data.challengesBatch?.challenges;
  };

  // #endregion Data Getters

  // #region Helper functions
  private _updatePickRatesFromMsg = (msg: { pickRates?: { [key: string]: number } }) => {
    if (msg.pickRates !== undefined && this._challenges !== undefined) {
      for (const [key, value] of Object.entries(msg.pickRates)) {
        const challenge = this._challenges.find((i) => i.challengeId === key);
        if (challenge) {
          challenge.pickRate = value * 100;
        }
      }
    }
  };

  private _initFromState = async (initialState: GameLogic.ChallengeStatesData) => {
    this._isEnabled = initialState.isEnabled ?? false;

    if (initialState.challengeStatuses) {
      this._challengeIds = initialState.challengeStatuses.map(
        (i) => i.challengeId,
      ) as string[];

      // We need the initial target values as they are not coming in game init unless
      // the value has changed from the original value
      const staticChallenges =
        (await this._fetchChallengeStaticData(this._challengeIds)) ?? [];
      this._challenges = initialState.challengeStatuses.map((i) => {
        const staticTargetValues =
          staticChallenges.find((j) => j.id === i.challengeId)?.targetValues || [];

        return {
          ...i,
          pickRate: i.pickRate !== undefined ? Math.floor(i.pickRate * 100) : 0,
          targetValues:
            i.targetValues && i.targetValues.length >= staticTargetValues.length
              ? i.targetValues
              : staticTargetValues,
        };
      });
    }
  };

  // #endregion

  // #region Getters
  public get challengeIds() {
    return this._challengeIds;
  }
  public get selectedChallengeId() {
    return this._selectedChallengeId;
  }

  public get isChallengesLocked() {
    return this._isChallengesLocked;
  }

  public get challengePickRates() {
    const pickRates = {} as Record<string, number>;

    for (const { pickRate, challengeId } of this._challenges) {
      if (challengeId) {
        pickRates[challengeId] = pickRate ?? 0;
      }
    }
    return pickRates;
  }

  public get challengeStatuses() {
    const statuses: Record<string, GameLogic.ChallengeState> = {};

    this._challenges.forEach(({ challengeId, challengeState }) => {
      if (challengeId && challengeState) {
        statuses[challengeId] = challengeState;
      }
    });
    return statuses;
  }

  public get challengeTargetValues() {
    const values = this._challenges.reduce(
      (acc, { challengeId, targetValues }) => ({
        ...acc,
        ...(challengeId && targetValues
          ? { [challengeId]: targetValues as { label: string; value: number }[] }
          : {}),
      }),
      {} as Record<string, { label: string; value: number }[]>,
    );

    return values;
  }

  public get availableChallengeIds() {
    return this._challenges
      .map((i) => i.challengeId)
      .filter((i): i is string => i !== undefined);
  }

  public get isChallengesEnabled() {
    return this._isEnabled;
  }
  // #endregion Getters

  private _reset() {
    this._selectedChallengeId = null;
    this._isEnabled = false;
    this._challenges = [];
    this._challengeIds = [];
  }

  public emit<T extends keyof EventMap>(
    event: T,
    ...args: ArgumentMap<EventMap>[Extract<T, keyof EventMap>]
  ): boolean {
    this._stateProvider.logDebugClient(`CGChallenges_${event}`, { ...args });
    return super.emit(event, ...args);
  }
}
