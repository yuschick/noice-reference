import { DelegateEventForwarder } from '../../events';
import { CGHighScoringCardsSystem } from '../CGHighScoringCardsSystem';

import { MockGameStateProvider } from '@game-logic/__mocks__/MockGameStateProvider';

const eventForwarder = new DelegateEventForwarder();
const stateProvider = new MockGameStateProvider();

const mockPromoted = {
  card: {
    cardId: 'card-1',
    points: 100,
  },
  groupId: 'group-1',
  userId: 'user-1',
  countdownMs: 10000,
};
const mockSucceeded = {
  ...mockPromoted,
  countdownMs: 10000,
};

describe('CGHighScoringCardsSystem', () => {
  afterEach(() => {
    eventForwarder.removeAllListeners();
  });

  it('should allow adding and removing listeners', () => {
    const system = new CGHighScoringCardsSystem(eventForwarder, stateProvider);

    expect(system.listenerCount('onHighScoringCard')).toEqual(0);

    const listener = jest.fn();
    system.addListener('onHighScoringCard', listener);

    expect(system.listenerCount('onHighScoringCard')).toEqual(1);

    system.removeListener('onHighScoringCard', listener);

    expect(system.listenerCount('onHighScoringCard')).toEqual(0);
  });

  it('should emit the high scoring card event when hsc succeeded', () => {
    const system = new CGHighScoringCardsSystem(eventForwarder, stateProvider);

    const shouldBeCalled = jest.fn();
    system.addListener('onHighScoringCard', shouldBeCalled);

    expect(shouldBeCalled).not.toHaveBeenCalled();

    eventForwarder.emitAll('onHighScoringCardSucceeded', mockSucceeded);

    expect(shouldBeCalled).toHaveBeenCalledTimes(1);
    expect(shouldBeCalled).toHaveBeenCalledWith({
      playerId: mockSucceeded.userId,
      groupId: mockSucceeded.groupId,
      cardId: mockSucceeded.card.cardId,
      points: mockSucceeded.card.points,
      isPromoted: false,
      countdownDuration: mockSucceeded.countdownMs,
      boosterIds: [],
    });
  });

  it('should emit the high scoring card event when hsc promoted', () => {
    const system = new CGHighScoringCardsSystem(eventForwarder, stateProvider);

    const shouldBeCalled = jest.fn();
    system.addListener('onHighScoringCard', shouldBeCalled);

    expect(shouldBeCalled).not.toHaveBeenCalled();

    eventForwarder.emitAll('onHighScoringCardPromoted', mockPromoted);

    expect(shouldBeCalled).toHaveBeenCalledTimes(1);
    expect(shouldBeCalled).toHaveBeenCalledWith({
      playerId: mockSucceeded.userId,
      groupId: mockSucceeded.groupId,
      cardId: mockSucceeded.card.cardId,
      points: mockSucceeded.card.points,
      isPromoted: true,
      countdownDuration: 0,
      boosterIds: [],
    });
  });

  it('should not emit the high scoring card event with non hsc event', () => {
    const system = new CGHighScoringCardsSystem(eventForwarder, stateProvider);

    const shouldNotBeCalled = jest.fn();
    system.addListener('onHighScoringCard', shouldNotBeCalled);

    expect(shouldNotBeCalled).not.toHaveBeenCalled();

    eventForwarder.emitAll('onMatchEnded', {});

    expect(shouldNotBeCalled).not.toHaveBeenCalled();
  });

  it('should cleanup state when the system is destroyed', () => {
    expect(eventForwarder.listenerCount).toEqual(0);

    // Make sure the system listens to events.
    const system = new CGHighScoringCardsSystem(eventForwarder, stateProvider);
    expect(eventForwarder.listenerCount).toEqual(2);

    // Make sure we add a listener.
    const listener = jest.fn();
    system.addListener('onHighScoringCard', listener);
    expect(system.listeners.length).toEqual(1);

    eventForwarder.emitAll('onHighScoringCardSucceeded', mockSucceeded);

    // Make sure the system has updated the state.
    expect(listener).toHaveBeenCalledTimes(1);

    // See ya
    system.destroy();

    // Make sure the listener is gone.
    expect(eventForwarder.listenerCount).toEqual(0);

    // Make sure the system has cleaned up the state.
    expect(system.listenerCount('onHighScoringCard')).toEqual(0);
  });
});
