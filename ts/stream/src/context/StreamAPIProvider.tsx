import { ContentMode } from '@noice-com/schemas/rendering/transitions.pb';
import { Nullable } from '@noice-com/utils';
import EventEmitter, { EventNames, EventArgs } from 'eventemitter3';
import { PropsWithChildren, createContext, useCallback, useContext } from 'react';

import { StreamProp } from '@stream-types';

interface APIEvents {
  onStreamLoading: [boolean];
  onContentMode: [StreamProp<ContentMode>];
}

interface StreamAPIInternal {
  emitAPIEvent(...args: Parameters<EventEmitter<APIEvents>['emit']>): Promise<void>;
}

interface StreamAPIExternal {
  events: {
    addListener: EventEmitter<APIEvents>['addListener'];
    removeListener: EventEmitter<APIEvents>['removeListener'];
  };
}

const Context = createContext<Nullable<StreamAPIExternal>>(null);
const events = new EventEmitter<APIEvents>();
const addListener = events.addListener.bind(events);
const removeListener = events.removeListener.bind(events);

const listeners = {
  events: {
    addListener,
    removeListener,
  },
};

export function StreamAPIProvider({ children }: PropsWithChildren) {
  return <Context.Provider value={listeners}>{children}</Context.Provider>;
}

// This is the hook for external usage
export function useStreamAPI(): StreamAPIExternal {
  const context = useContext(Context);

  if (!context) {
    throw new Error('Trying to access StreamAPIContext without StreamAPIProvider');
  }

  return {
    events: context.events,
  };
}

// This is the hook for internal usage within the package
export function useStreamAPIInternal(): StreamAPIInternal {
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
