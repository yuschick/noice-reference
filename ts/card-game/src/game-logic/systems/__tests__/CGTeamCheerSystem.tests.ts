import { MockMatchGroup } from '@noice-com/platform-client/src/testing';
import {
  ContextualTeamActionStatus,
  ContextualTeamActionType,
} from '@noice-com/schemas/game-logic/game_logic.pb';

import { DelegateEventForwarder } from '../../events';
import { CGTeamCheerSystem } from '../CGTeamCheerSystem';

import { MockGameStateProvider } from '@game-logic/__mocks__/MockGameStateProvider';

const eventForwarder = new DelegateEventForwarder();
const stateProvider = new MockGameStateProvider();

describe('CGTeamActionSystem', () => {
  afterEach(() => {
    eventForwarder.removeAllListeners();
  });

  it('should ignore events that are not team actions', () => {
    const system = new CGTeamCheerSystem(eventForwarder, stateProvider);

    const listener = jest.fn();
    system.addListener('onTeamActionStarted', listener);
    expect(listener).not.toHaveBeenCalled();

    eventForwarder.emitAll('onContextualTeamActionUpdate', {
      type: ContextualTeamActionType.CONTEXTUAL_TEAM_ACTION_TYPE_UNSPECIFIED,
      status: ContextualTeamActionStatus.CONTEXTUAL_TEAM_ACTION_STATUS_UNSPECIFIED,
      participants: {},
      deadlineMs: '0',
    });

    expect(listener).not.toHaveBeenCalled();
  });

  it('should emit the started event when a team action is started', () => {
    const system = new CGTeamCheerSystem(eventForwarder, stateProvider);

    const shouldBeCalled = jest.fn();
    const shouldNotBeCalled = jest.fn();
    system.addListener('onTeamActionStarted', shouldBeCalled);
    system.addListener('onTeamActionUpdated', shouldNotBeCalled);

    expect(shouldBeCalled).not.toHaveBeenCalled();
    expect(shouldNotBeCalled).not.toHaveBeenCalled();

    eventForwarder.emitAll('onContextualTeamActionUpdate', {
      type: ContextualTeamActionType.CONTEXTUAL_TEAM_ACTION_TYPE_STREAMER_ACTIVATED,
      status: ContextualTeamActionStatus.CONTEXTUAL_TEAM_ACTION_STATUS_ONGOING,
      participants: { 'player-1': true, 'player-2': false },
      deadlineMs: '10000',
    });

    expect(shouldBeCalled).toHaveBeenCalledTimes(1);
    expect(shouldBeCalled).toHaveBeenCalledWith(
      { 'player-1': true, 'player-2': false },
      10000,
    );
    expect(shouldNotBeCalled).not.toHaveBeenCalled();
  });

  it('should emit the updated event when a team action is updated', () => {
    const system = new CGTeamCheerSystem(eventForwarder, stateProvider);

    const startedListener = jest.fn();
    const updatedListener = jest.fn();

    system.addListener('onTeamActionStarted', startedListener);
    system.addListener('onTeamActionUpdated', updatedListener);

    expect(startedListener).not.toHaveBeenCalled();
    expect(updatedListener).not.toHaveBeenCalled();

    eventForwarder.emitAll('onContextualTeamActionUpdate', {
      type: ContextualTeamActionType.CONTEXTUAL_TEAM_ACTION_TYPE_STREAMER_ACTIVATED,
      status: ContextualTeamActionStatus.CONTEXTUAL_TEAM_ACTION_STATUS_ONGOING,
      participants: { 'player-1': false, 'player-2': false },
      deadlineMs: '10000',
    });

    expect(startedListener).toHaveBeenCalledTimes(1);
    expect(updatedListener).not.toHaveBeenCalled();

    eventForwarder.emitAll('onContextualTeamActionUpdate', {
      type: ContextualTeamActionType.CONTEXTUAL_TEAM_ACTION_TYPE_STREAMER_ACTIVATED,
      status: ContextualTeamActionStatus.CONTEXTUAL_TEAM_ACTION_STATUS_ONGOING,
      participants: { 'player-1': true, 'player-2': false },
      deadlineMs: '10000',
    });

    expect(startedListener).toHaveBeenCalledTimes(1);
    expect(updatedListener).toHaveBeenCalledTimes(1);
    expect(updatedListener).toHaveBeenLastCalledWith(
      { 'player-1': true, 'player-2': false },
      10000,
    );
  });

  it('should emit events when a team action is finished', () => {
    const system = new CGTeamCheerSystem(eventForwarder, stateProvider);
    const listener = jest.fn();
    system.addListener('onTeamActionSucceeded', listener);
    system.addListener('onTeamActionFailed', listener);

    expect(listener).not.toHaveBeenCalled();

    eventForwarder.emitAll('onContextualTeamActionUpdate', {
      type: ContextualTeamActionType.CONTEXTUAL_TEAM_ACTION_TYPE_STREAMER_ACTIVATED,
      status: ContextualTeamActionStatus.CONTEXTUAL_TEAM_ACTION_STATUS_SUCCEEDED,
      participants: { 'player-1': true, 'player-2': true },
      deadlineMs: '10000',
    });

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith({ 'player-1': true, 'player-2': true });

    eventForwarder.emitAll('onContextualTeamActionUpdate', {
      type: ContextualTeamActionType.CONTEXTUAL_TEAM_ACTION_TYPE_STREAMER_ACTIVATED,
      status: ContextualTeamActionStatus.CONTEXTUAL_TEAM_ACTION_STATUS_FAILED,
      participants: { 'player-1': true, 'player-2': false },
      deadlineMs: '10000',
    });

    expect(listener).toHaveBeenCalledTimes(2);
    expect(listener).toHaveBeenLastCalledWith({ 'player-1': true, 'player-2': false });
  });

  it('should store the state of the current team action', () => {
    const system = new CGTeamCheerSystem(eventForwarder, stateProvider);

    expect(system.isActionInProgress).toEqual(false);
    expect(system.currentTimeLeftMs).toBeNull();
    expect(system.currentParticipants).toBeNull();
    expect(system.currentAcceptedParticipantCount).toEqual(0);
    expect(system.totalParticipants).toEqual(0);

    eventForwarder.emitAll('onContextualTeamActionUpdate', {
      type: ContextualTeamActionType.CONTEXTUAL_TEAM_ACTION_TYPE_STREAMER_ACTIVATED,
      status: ContextualTeamActionStatus.CONTEXTUAL_TEAM_ACTION_STATUS_ONGOING,
      participants: { 'player-1': true, 'player-2': false },
      deadlineMs: '10000',
    });

    expect(system.isActionInProgress).toEqual(true);
    expect(system.currentTimeLeftMs).toEqual(10000);
    expect(system.currentParticipants).toEqual({ 'player-1': true, 'player-2': false });
    expect(system.currentAcceptedParticipantCount).toEqual(1);
    expect(system.totalParticipants).toEqual(2);

    eventForwarder.emitAll('onContextualTeamActionUpdate', {
      type: ContextualTeamActionType.CONTEXTUAL_TEAM_ACTION_TYPE_STREAMER_ACTIVATED,
      status: ContextualTeamActionStatus.CONTEXTUAL_TEAM_ACTION_STATUS_SUCCEEDED,
      participants: { 'player-1': true, 'player-2': true },
      deadlineMs: '10000',
    });

    expect(system.isActionInProgress).toEqual(false);
    expect(system.currentTimeLeftMs).toBeNull();
    expect(system.currentParticipants).toBeNull();
    expect(system.currentAcceptedParticipantCount).toEqual(0);
    expect(system.totalParticipants).toEqual(0);
  });

  it('should cleanup state when the system is destroyed', () => {
    expect(eventForwarder.listenerCount).toEqual(0);

    // Make sure the system listens to events.
    const system = new CGTeamCheerSystem(eventForwarder, stateProvider);
    expect(eventForwarder.listenerCount).toEqual(1);

    // Make sure we add a listener.
    const listener = jest.fn();
    system.addListener('onTeamActionStarted', listener);
    expect(system.listenerCount('onTeamActionStarted')).toEqual(1);

    eventForwarder.emitAll('onContextualTeamActionUpdate', {
      type: ContextualTeamActionType.CONTEXTUAL_TEAM_ACTION_TYPE_STREAMER_ACTIVATED,
      status: ContextualTeamActionStatus.CONTEXTUAL_TEAM_ACTION_STATUS_ONGOING,
      participants: { 'player-1': true, 'player-2': false },
      deadlineMs: '10000',
    });

    // Make sure the system has updated the state.
    expect(listener).toHaveBeenCalledTimes(1);
    expect(system.isActionInProgress).toEqual(true);
    expect(system.currentTimeLeftMs).toEqual(10000);
    expect(system.currentParticipants).toEqual({ 'player-1': true, 'player-2': false });
    expect(system.currentAcceptedParticipantCount).toEqual(1);
    expect(system.totalParticipants).toEqual(2);

    // See ya
    system.destroy();

    // Make sure the listener is gone.
    expect(eventForwarder.listenerCount).toEqual(0);

    // Make sure the system has cleaned up the state.
    expect(system.listenerCount('onTeamActionStarted')).toEqual(0);
    expect(system.isActionInProgress).toEqual(false);
    expect(system.currentTimeLeftMs).toBeNull();
    expect(system.currentParticipants).toBeNull();
    expect(system.currentAcceptedParticipantCount).toEqual(0);
    expect(system.totalParticipants).toEqual(0);
  });

  it('should allow joining a team action', async () => {
    const mockMatchGroup = new MockMatchGroup('group', 'player');
    const system = new CGTeamCheerSystem(eventForwarder, stateProvider, mockMatchGroup);

    mockMatchGroup.joinTeamAction = jest.fn();
    expect(mockMatchGroup.joinTeamAction).not.toHaveBeenCalled();

    system.joinTeamCheer();
    expect(mockMatchGroup.joinTeamAction).toHaveBeenCalledTimes(1);
  });
});
