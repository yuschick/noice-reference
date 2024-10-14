import { createContext, useContext, useEffect, useCallback } from 'react';

import {
  FTUEActionArgs,
  FTUEActionListener,
  FTUEActionNames,
  FTUEActionsHandler,
} from '@common-classes';
import { WithChildren } from '@common-types';

type Context = FTUEActionsHandler;

const FTUEActionHandlerContext = createContext<Context | null>(null);

interface Props {
  actionHandler: FTUEActionsHandler;
}

export function FTUEActionHandlerProvider({
  children,
  actionHandler,
}: WithChildren<Props>) {
  return (
    <FTUEActionHandlerContext.Provider value={actionHandler}>
      {children}
    </FTUEActionHandlerContext.Provider>
  );
}

export function useFTUEActionHandler(): Context {
  const listeners = useContext(FTUEActionHandlerContext);

  if (!listeners) {
    throw new Error(
      'Trying to access FTUE action handler from context without FTUEActionHandlerContext',
    );
  }

  return listeners as unknown as FTUEActionsHandler;
}

export function useListenToFTUEAction(
  actionType: FTUEActionNames | undefined,
  refetchFn: FTUEActionListener,
): void {
  const context = useFTUEActionHandler();

  // Given function instance is subscribed and unsubsribed when changed / unmounted
  useEffect(() => {
    if (!actionType) {
      return;
    }

    context.addListener(actionType, refetchFn);

    return () => {
      context.removeListener(actionType, refetchFn);
    };
  }, [context, actionType, refetchFn]);
}

export function useTriggerFTUEAction() {
  const handler = useFTUEActionHandler();

  const triggerFn = useCallback(
    async (key: FTUEActionNames, ...args: FTUEActionArgs) => {
      return handler.emitPromise(key, ...args);
    },
    [handler],
  );

  return triggerFn;
}
