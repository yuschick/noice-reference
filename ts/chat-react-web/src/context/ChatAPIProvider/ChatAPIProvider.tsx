import { WithChildren } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import EventEmitter, { EventNames, EventArgs } from 'eventemitter3';
import { createContext, useCallback, useContext } from 'react';

import { useBoosterRequests } from './hooks/useBoosterRequests.hook';

interface APIEventsExternal {
  onTeamChatMessagesAmountChange: [newAmount: number];
}

interface APIEventsInternal {
  onAddBoosterRequest: [targetUserId: string, requestUserId: string];
  onRemoveBoosterRequest: [targetUserId: string, requestUserId: string];
  onClearPlayerBoosterRequests: [playerId: string];
  onClearAllBoosterRequests: [];
}

interface ChatAPIContextType {
  addBoosterRequest: (targetUserId: string, requestUserId: string) => void;
  removeBoosterRequest: (targetUserId: string, requestUserId: string) => void;
  clearPlayerBoosterRequests: (playerId: string) => void;
  clearAllBoosterRequests: () => void;
}

interface ChatAPIInternal {
  events: {
    addListener: EventEmitter<APIEventsInternal>['addListener'];
    removeListener: EventEmitter<APIEventsInternal>['removeListener'];
  };
  emitAPIEvent(
    ...args: Parameters<EventEmitter<APIEventsExternal>['emit']>
  ): Promise<void>;
}

interface ChatAPIExternal
  extends Pick<
    ChatAPIContextType,
    | 'addBoosterRequest'
    | 'removeBoosterRequest'
    | 'clearAllBoosterRequests'
    | 'clearPlayerBoosterRequests'
  > {
  events: {
    addListener: EventEmitter<APIEventsExternal>['addListener'];
    removeListener: EventEmitter<APIEventsExternal>['removeListener'];
  };
}

const ChatAPIContext = createContext<Nullable<ChatAPIContextType>>(null);

const externalEvents = new EventEmitter<APIEventsExternal>();
const externalListeners = {
  addListener: externalEvents.addListener.bind(externalEvents),
  removeListener: externalEvents.removeListener.bind(externalEvents),
};

const internalEvents = new EventEmitter<APIEventsInternal>();
const internalListeners = {
  addListener: internalEvents.addListener.bind(internalEvents),
  removeListener: internalEvents.removeListener.bind(internalEvents),
};

export function ChatAPIProvider({ children }: WithChildren) {
  const onAddBoosterRequest = useCallback(
    (targetUserId: string, requestUserId: string) => {
      internalEvents.emit('onAddBoosterRequest', targetUserId, requestUserId);
    },
    [],
  );

  const onRemoveBoosterRequest = useCallback(
    (targetUserId: string, requestUserId: string) => {
      internalEvents.emit('onRemoveBoosterRequest', targetUserId, requestUserId);
    },
    [],
  );

  const onClearPlayerBoosterRequests = useCallback((playerId: string) => {
    internalEvents.emit('onClearPlayerBoosterRequests', playerId);
  }, []);

  const onClearAllBoosterRequests = useCallback(() => {
    internalEvents.emit('onClearAllBoosterRequests');
  }, []);

  const {
    addBoosterRequest,
    removeBoosterRequest,
    clearPlayerBoosterRequests,
    clearAllBoosterRequests,
  } = useBoosterRequests({
    onAddBoosterRequest,
    onRemoveBoosterRequest,
    onClearPlayerBoosterRequests,
    onClearAllBoosterRequests,
  });

  return (
    <ChatAPIContext.Provider
      value={{
        addBoosterRequest,
        removeBoosterRequest,
        clearPlayerBoosterRequests,
        clearAllBoosterRequests,
      }}
    >
      {children}
    </ChatAPIContext.Provider>
  );
}

export function useChatAPI(): ChatAPIExternal {
  const context = useContext(ChatAPIContext);

  if (!context) {
    throw new Error('Trying to access chat context without ChatAPIProvider');
  }

  return {
    events: externalListeners,
    ...context,
  };
}

export function useChatAPIInternal(): ChatAPIInternal {
  const context = useContext(ChatAPIContext);

  // Make a version of emit that can be awaited until listener callbacks are done
  const emitAPIEvent = useCallback(
    async (
      event: EventNames<APIEventsExternal>,
      ...args: EventArgs<APIEventsExternal, EventNames<APIEventsExternal>>
    ): Promise<void> => {
      const promises = externalEvents.listeners(event);
      await Promise.all(promises.map((fn) => fn(...args)));
    },
    [],
  );

  // Since API is optional, we don't want to throw an error if it's not provided.
  if (!context) {
    return {
      emitAPIEvent,
      events: internalListeners,
    };
  }

  return {
    emitAPIEvent,
    events: internalListeners,
    ...context,
  };
}
