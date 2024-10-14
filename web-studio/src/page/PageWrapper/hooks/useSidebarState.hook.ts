import { useCallback, useState } from 'react';

import { useStudioLocalStorage } from '@common/local-storage';
import { NavigationSidebarMode } from '@common/sidebar';

interface HookResult {
  navigationSidebarMode: NavigationSidebarMode;
  onChangeNavigationSidebarMode(mode: NavigationSidebarMode): void;
}

export function useSidebarState(): HookResult {
  const localStorage = useStudioLocalStorage();

  const [navigationSidebarMode, setMode] = useState(
    localStorage?.GetValue('layout.navigationSidebarMode') ||
      NavigationSidebarMode.Expanded,
  );

  const onChangeNavigationSidebarMode = useCallback(
    (mode: NavigationSidebarMode) => {
      setMode(mode);
      localStorage?.SetValue('layout.navigationSidebarMode', mode);
    },
    [localStorage],
  );

  return {
    navigationSidebarMode,
    onChangeNavigationSidebarMode,
  };
}
