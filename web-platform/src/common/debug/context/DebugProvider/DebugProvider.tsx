import { WithChildren } from '@noice-com/common-ui';
import { createContext, Dispatch, SetStateAction, useContext } from 'react';

import { useDebugState } from './hooks';

interface Context {
  forceChannelOnline: boolean;
  canForceChannelOnline: boolean;
  setCanForceChannelOnline: Dispatch<SetStateAction<boolean>>;
  onForceChannelOnlineButtonClick(): void;
}

const DebugContext = createContext<Context | null>(null);

export function DebugProvider({ children }: WithChildren) {
  const state = useDebugState();

  return <DebugContext.Provider value={state}>{children}</DebugContext.Provider>;
}

export function useDebugContext(): Context {
  const context = useContext(DebugContext);

  if (!context) {
    throw new Error('Trying to access DebugContext without DebugProvider');
  }

  return context;
}
