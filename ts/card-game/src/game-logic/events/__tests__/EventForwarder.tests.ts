import { EventForwarder } from '../EventForwarder';

interface TestEventMap {
  test: [value: number];
}

const TEST_FILTER_ID = 'test-id';

describe('EventForwarder', () => {
  it('should allow adding and removing listeners', () => {
    const forwarder = new EventForwarder<TestEventMap>();
    expect(forwarder.listenerCount).toEqual(0);

    const handler = () => {};

    forwarder.addListener(TEST_FILTER_ID, 'test', handler);
    expect(forwarder.listenerCount).toEqual(1);
    forwarder.removeListener(TEST_FILTER_ID, 'test', handler);
    expect(forwarder.listenerCount).toEqual(0);
  });

  it('should allow emitting filtered events', () => {
    const forwarder = new EventForwarder<TestEventMap>();

    const shouldTrigger = jest.fn();
    const shouldNotTrigger = jest.fn();

    forwarder.addListener(TEST_FILTER_ID, 'test', shouldTrigger);
    forwarder.addListener('invalid', 'test', shouldNotTrigger);

    forwarder.emit(TEST_FILTER_ID, 'test', 55);
    expect(shouldTrigger).toHaveBeenCalledWith(55);
    expect(shouldNotTrigger).not.toBeCalled();
  });

  it('should allow emitting all events', () => {
    const forwarder = new EventForwarder<TestEventMap>();

    const shouldTrigger = jest.fn();
    const shouldAlsoTrigger = jest.fn();

    forwarder.addListener(TEST_FILTER_ID, 'test', shouldTrigger);
    forwarder.addListener('invalid', 'test', shouldAlsoTrigger);

    forwarder.emitAll('test', 55);
    expect(shouldTrigger).toHaveBeenCalledWith(55);
    expect(shouldAlsoTrigger).toHaveBeenCalledWith(55);
  });

  it('should allow removing all listeners for a specific event', () => {
    const forwarder = new EventForwarder<TestEventMap>();

    const shouldTrigger = jest.fn();
    const shouldAlsoTrigger = jest.fn();

    forwarder.addListener(TEST_FILTER_ID, 'test', shouldTrigger);
    forwarder.addListener('invalid', 'test', shouldAlsoTrigger);

    forwarder.removeAllListeners(TEST_FILTER_ID);
    forwarder.emitAll('test', 55);

    expect(shouldTrigger).not.toBeCalled();
    expect(shouldAlsoTrigger).toHaveBeenCalledWith(55);
  });

  it('should allow removing all listeners for all events', () => {
    const forwarder = new EventForwarder<TestEventMap>();

    const shouldTrigger = jest.fn();
    const shouldAlsoTrigger = jest.fn();

    forwarder.addListener(TEST_FILTER_ID, 'test', shouldTrigger);
    forwarder.addListener('invalid', 'test', shouldAlsoTrigger);

    forwarder.removeAllListeners();
    forwarder.emitAll('test', 55);

    expect(shouldTrigger).not.toBeCalled();
    expect(shouldAlsoTrigger).not.toBeCalled();
  });

  it('should allow listening for events with a wildcard', () => {
    const forwarder = new EventForwarder<TestEventMap>();

    const shouldTrigger = jest.fn();

    forwarder.addListener(EventForwarder.WildcardCharacter, 'test', shouldTrigger);

    forwarder.emit(TEST_FILTER_ID, 'test', 55);
    expect(shouldTrigger).toHaveBeenLastCalledWith(55);

    forwarder.emit('invalid', 'test', 66);
    expect(shouldTrigger).toHaveBeenLastCalledWith(66);
  });
});
