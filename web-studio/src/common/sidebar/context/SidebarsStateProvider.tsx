import { WithChildren } from '@noice-com/common-ui';
import { createContext, useContext, useMemo } from 'react';

import { NavigationSidebarMode } from '../types';

interface Context {
  navigationSidebarMode: NavigationSidebarMode;
  onChangeNavigationSidebarMode(mode: NavigationSidebarMode): void;
}

const SidebarsStateContext = createContext<Context | null>(null);

export function SidebarsStateProvider({
  navigationSidebarMode,
  onChangeNavigationSidebarMode,
  children,
}: WithChildren<Context>) {
  const value = useMemo(
    () => ({
      navigationSidebarMode,
      onChangeNavigationSidebarMode,
    }),
    [navigationSidebarMode, onChangeNavigationSidebarMode],
  );

  return (
    <SidebarsStateContext.Provider value={value}>
      {children}
    </SidebarsStateContext.Provider>
  );
}

export function useSidebarStates(): Context {
  return useContext(SidebarsStateContext) as Context;
}
