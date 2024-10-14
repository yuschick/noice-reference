import { Nullable } from '@noice-com/utils';
import EventEmitter, { EventNames, EventArgs } from 'eventemitter3';
import { createContext, PropsWithChildren, useCallback, useContext } from 'react';

interface APIEvents {
  onToggleApplyingBooster: [applying: boolean];
  onPlaySoloRequested: [];
  onJoinTeamRequested: [];
  onChangeTeamRequested: [];
  onChangeTeamSucceeded: [solo: boolean];
  onChangeTeamResultNoVacantTeams: [];
  onToggleCardSelect: [open: boolean];
  onChatIconClicked: [];
  onMatchEndSequenceCompleted: [];
}

interface CardGameAPIInternal {
  emitAPIEvent(...args: Parameters<EventEmitter<APIEvents>['emit']>): Promise<void>;
}

interface CardGameAPIExternal {
  events: {
    addListener: EventEmitter<APIEvents>['addListener'];
    removeListener: EventEmitter<APIEvents>['removeListener'];
  };
}

const Context = createContext<Nullable<CardGameAPIExternal>>(null);

const events = new EventEmitter<APIEvents>();
const addListener = events.addListener.bind(events);
const removeListener = events.removeListener.bind(events);
const listeners = {
  addListener,
  removeListener,
};
export function CardGameAPIProvider({ children }: PropsWithChildren) {
  return (
    <Context.Provider
      value={{
        events: listeners,
      }}
    >
      {children}
    </Context.Provider>
  );
}

// This is the hook for external usage
export function useCardGameAPI(): CardGameAPIExternal {
  const context = useContext(Context);

  if (!context) {
    throw new Error('Trying to access CardGameAPIContext without CardGameAPIProvider');
  }

  return {
    events: context.events,
  };
}

// This is the hook for internal usage within the package
export function useCardGameAPIInternal(): CardGameAPIInternal {
  const context = useContext(Context);

  // Make a version of emit that can be awaited until listener callbacks are done
  const emitAPIEvent = useCallback(
    async (
      event: EventNames<APIEvents>,
      ...args: EventArgs<APIEvents, EventNames<APIEvents>>
    ): Promise<void> => {
      const promises = events.listeners(event);
      await Promise.all(promises.map((fn) => fn(...args)));
    },
    [],
  );

  // Since API is optional, we don't want to throw an error if it's not provided.
  if (!context) {
    return {
      emitAPIEvent,
    };
  }

  return {
    emitAPIEvent,
    ...context,
  };
}
