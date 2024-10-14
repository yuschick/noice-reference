import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';

// eslint-disable-next-line import/no-restricted-paths
import { useAppLocalStorage } from '@common/localstorage';

interface HookResult {
  forceChannelOnline: boolean;
  canForceChannelOnline: boolean;
  setCanForceChannelOnline: Dispatch<SetStateAction<boolean>>;
  onForceChannelOnlineButtonClick(): void;
}

export function useDebugState(): HookResult {
  const localStorage = useAppLocalStorage();

  const [forceChannelOnline, setForceChannelOnline] = useState(
    localStorage.GetValue('debug.forceChannelOnline'),
  );
  const [canForceChannelOnline, setCanForceChannelOnline] = useState(false);

  const onForceChannelOnlineButtonClick = useCallback(() => {
    setForceChannelOnline((prev) => !prev);
  }, []);

  useEffect(() => {
    localStorage.SetValue('debug.forceChannelOnline', forceChannelOnline);
  }, [forceChannelOnline, localStorage]);

  return {
    forceChannelOnline: canForceChannelOnline && forceChannelOnline,
    canForceChannelOnline,
    setCanForceChannelOnline,
    onForceChannelOnlineButtonClick,
  };
}
