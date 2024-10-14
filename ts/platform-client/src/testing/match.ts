import * as GameLogic from '@noice-com/schemas/game-logic/game_logic.pb';

import { IMatchGroup, IMatchGroupDelegate } from '../types';

type DelegateEventKey = keyof IMatchGroupDelegate;
type DelegateEventCallback<EventKey extends DelegateEventKey = DelegateEventKey> =
  IMatchGroupDelegate[EventKey];
type DelegateEventPayload<EventKey extends DelegateEventKey = DelegateEventKey> =
  Parameters<DelegateEventCallback<EventKey>>[1];

type MockFactoryType<
  MockedFn extends (...args: any[]) => any = (...args: any[]) => any,
  MockedFnArgs extends Parameters<MockedFn> = Parameters<MockedFn>,
  MockedFnReturn extends ReturnType<MockedFn> = ReturnType<MockedFn>,
> = (implementation: MockedFn) => (...args: MockedFnArgs) => MockedFnReturn;

const defaultMock: MockFactoryType = (fn) => {
  return (...args) => fn(...args);
};

export class MockMatchGroup implements IMatchGroup {
  public static readonly DefaultMockMethod: MockFactoryType = defaultMock;
  public static MockFactory: MockFactoryType = defaultMock;

  public readonly groupId: string;
  public localUserId: string;
  public spectator: boolean;

  private _delegates: IMatchGroupDelegate[];
  private _mockMap: Map<DelegateEventKey, DelegateEventPayload>;

  constructor(groupId: string, localUserId: string, delegate?: IMatchGroupDelegate) {
    this.groupId = groupId;
    this.localUserId = localUserId;
    this._delegates = delegate ? [delegate] : [];
    this._mockMap = new Map();

    this._applyFactory();

    delegate?.initialized(this);
  }

  /**
   * Applies the function factory (MockMatchGroup.MockFactory) to all implementations.
   *
   * This allows for us to use this mock both in a testing environment (via jest) and
   * a normal browser environment (ie. storybooks).
   *
   * @example
   * ```
   * MockMatchGroup.MockFactory = jest.fn;
   * const group = new MockMatchGroup(groupId, userId, delegate);
   * ```
   */
  private _applyFactory() {
    this.removeDelegate = MockMatchGroup.MockFactory(this.removeDelegate.bind(this));
    this.leave = MockMatchGroup.MockFactory(this.leave.bind(this));
    this.setActiveCard = MockMatchGroup.MockFactory(this.setActiveCard.bind(this));
    this.shuffleHand = MockMatchGroup.MockFactory(this.shuffleHand.bind(this));
    this.triggerEmoji = MockMatchGroup.MockFactory(this.triggerEmoji.bind(this));
    this.triggerEmote = MockMatchGroup.MockFactory(this.triggerEmote.bind(this));
    this.useBooster = MockMatchGroup.MockFactory(this.useBooster.bind(this));
    this.requestBooster = MockMatchGroup.MockFactory(this.requestBooster.bind(this));
    this.cancelBoosterRequest = MockMatchGroup.MockFactory(
      this.cancelBoosterRequest.bind(this),
    );
    this.voteCard = MockMatchGroup.MockFactory(this.voteCard.bind(this));
    this.cancelCardVote = MockMatchGroup.MockFactory(this.cancelCardVote.bind(this));
    this.collectAONPoints = MockMatchGroup.MockFactory(this.collectAONPoints.bind(this));
    this.requestHand = MockMatchGroup.MockFactory(this.requestHand.bind(this));
    this.setDebug = MockMatchGroup.MockFactory(this.setDebug.bind(this));
    this.joinTeamAction = MockMatchGroup.MockFactory(this.joinTeamAction.bind(this));
  }

  // ----- Mock Helper Functions -----
  public setMock<
    EventName extends DelegateEventKey = DelegateEventKey,
    EventPayload extends DelegateEventPayload<DelegateEventKey> = DelegateEventPayload<DelegateEventKey>,
  >(event: EventName, payload: EventPayload) {
    this._mockMap.set(event, payload);
  }

  public clearMock<EventName extends DelegateEventKey = DelegateEventKey>(
    event: EventName,
  ) {
    this._mockMap.set(event, {});
  }

  public sendToDelegates = <
    EventName extends DelegateEventKey = DelegateEventKey,
    EventPayload extends DelegateEventPayload<EventName> = DelegateEventPayload<EventName>,
  >(
    event: EventName,
    payload: EventPayload,
  ): Promise<void> => {
    return new Promise((resolve) => {
      // We delay the execution by a tick to emulate the async nature of these calls.
      setTimeout(async () => {
        const delegates = [...this._delegates];
        const combinedPayload = {
          ...payload,
          // If there is a mock, we want to override the payload with the mock.
          ...(this._mockMap.get(event) ?? {}),
        };

        for (let i = 0; i < delegates.length; i++) {
          // @ts-expect-error TS observes the second param literally for some reason.
          await delegates[i][event]?.(this, combinedPayload);
        }

        resolve();
      }, 0);
    });
  };

  public triggerEvent = <
    EventName extends DelegateEventKey = DelegateEventKey,
    EventPayload extends DelegateEventPayload<EventName> = DelegateEventPayload<EventName>,
  >(
    event: EventName,
    payload?: EventPayload,
  ): Promise<void> => {
    const data = {
      ...(payload ?? {}),
      ...(this._mockMap.get(event) ?? {}),
    };

    return this.sendToDelegates(event, data);
  };

  // ----- Delegate Implementations -----

  // This is not part of the interface, but is useful for testing.
  public addDelegate(delegate: IMatchGroupDelegate): void {
    this._delegates.push(delegate);
    // also make sure to call the initialized function
    delegate.initialized(this);
  }

  public removeDelegate(delegate: IMatchGroupDelegate): void {
    const filtered = this._delegates.filter((del) => del !== delegate);
    this._delegates = filtered;
  }

  public leave(): Promise<void> {
    return Promise.resolve();
  }

  /**
   * Triggers 'onActiveCardSet'.
   */
  public setActiveCard(cardID: string): Promise<void> {
    void this.sendToDelegates('onActiveCardSet', {
      userId: this.localUserId,
      cardId: cardID,
    } as GameLogic.ActiveCardSetMsg);
    return Promise.resolve();
  }

  public shuffleHand(): Promise<void> {
    void this.sendToDelegates('onHandShuffled', {
      cardIds: [],
      matchEndCardIds: [],
      userId: this.localUserId,
      userRequestedShuffle: true,
    } as GameLogic.HandShuffledMsg);
    return Promise.resolve();
  }

  public triggerEmoji(_emojiID: string): Promise<void> {
    throw new Error('Mock not implemented.');
  }

  public triggerEmote(_emoteID: string): Promise<void> {
    throw new Error('Mock not implemented.');
  }

  public useBooster(targetUserID: string, boosterID: number): Promise<void> {
    this.triggerEvent('onBoosterUsed', {
      targetUserId: targetUserID,
      boosterId: boosterID,
      userId: this.localUserId,
    });
    return Promise.resolve();
  }

  public requestBooster(targetUserID: string, boosterID: number): Promise<void> {
    void this.sendToDelegates('onBoosterRequested', {
      userId: this.localUserId,
      targetUserId: targetUserID,
      boosterId: boosterID,
    });
    return Promise.resolve();
  }

  public cancelBoosterRequest(targetUserID: string, boosterID: number): Promise<void> {
    void this.sendToDelegates('onBoosterRequestCancelled', {
      userId: this.localUserId,
      targetUserId: targetUserID,
      boosterId: boosterID,
    });
    return Promise.resolve();
  }

  public voteCard(_targetUserID: string, _cardID: string): Promise<void> {
    throw new Error('Mock not implemented.');
  }

  public cancelCardVote(_targetUserID: string, _cardID: string): Promise<void> {
    throw new Error('Mock not implemented.');
  }

  public collectAONPoints(): Promise<void> {
    void this.sendToDelegates('onAonPointsCollected', {
      userId: this.localUserId,
      points: 300,
    });
    void this.sendToDelegates('onPlayerPointsUpdated', {
      userId: this.localUserId,
      points: 2000,
    });
    return Promise.resolve();
  }

  public requestHand(): Promise<void> {
    void this.sendToDelegates('onHandShuffled', {
      cardIds: [],
      matchEndCardIds: [],
      userId: this.localUserId,
      userRequestedShuffle: false,
    } as GameLogic.HandShuffledMsg);
    return Promise.resolve();
  }

  public requestChallenges(): Promise<void> {
    return Promise.resolve();
  }

  public setActiveChallenge(challengeId: string): Promise<void> {
    void this.sendToDelegates('onSetActiveChallenge', {
      challengeId,
      userId: this.localUserId,
    });
    void this.sendToDelegates('onChallengePickRatesUpdate', {
      pickRates: {
        [challengeId]: 1,
      },
    });
    return Promise.resolve();
  }

  public setDebug(
    _msgType: GameLogic.DebugMsgType,
    _enabled: boolean,
    _jsonData?: string,
  ): Promise<void> {
    throw new Error('Mock not implemented.');
  }

  public joinTeamAction(): Promise<void> {
    throw new Error('Mock not implemented.');
  }
}
