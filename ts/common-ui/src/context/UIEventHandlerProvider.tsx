import { createContext, useContext, useEffect, useCallback } from 'react';

import {
  CommonUIEvents,
  UIEventsHandler,
  EventNames,
  EventListener,
  EventArgs,
} from '@common-classes';
import { WithChildren } from '@common-types';

type Context = UIEventsHandler;

const UIEventHandlerContext = createContext<Context | null>(null);

interface Props<T extends CommonUIEvents> {
  uiEventsHandler: UIEventsHandler<T>;
}

export function UIEventHandlerProvider<T extends CommonUIEvents>({
  children,
  uiEventsHandler,
}: WithChildren<Props<T>>) {
  return (
    <UIEventHandlerContext.Provider value={uiEventsHandler}>
      {children}
    </UIEventHandlerContext.Provider>
  );
}

export function useUIEventHandler<E extends CommonUIEvents>(): Context {
  const listeners = useContext(UIEventHandlerContext);

  if (!listeners) {
    throw new Error(
      'Trying to access ui event handler from context without UIEventHandlerProvider',
    );
  }

  return listeners as unknown as UIEventsHandler<E>;
}

export function useListenToUIEvent<E extends CommonUIEvents, T extends EventNames<E>>(
  eventType: T | undefined,
  refetchFn: EventListener<E, T>,
): void {
  const context = useUIEventHandler<E>();

  // Given function instance is subscribed and unsubsribed when changed / unmounted
  useEffect(() => {
    if (!eventType) {
      return;
    }

    context.addListener(eventType, refetchFn);

    return () => {
      context.removeListener(eventType, refetchFn);
    };
  }, [context, eventType, refetchFn]);
}

export function useTriggerUIEvent<E extends CommonUIEvents>() {
  const handler = useUIEventHandler<E>();

  const triggerFn = useCallback(
    async <T extends EventNames<E>>(key: T, ...args: EventArgs<E, T>) => {
      return handler.emitPromise(key, ...args);
    },
    [handler],
  );

  return triggerFn;
}
