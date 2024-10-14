import { useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';

/**
 * This hook will call the provided functions when the app state changes from background to active.
 * @param refetchFunctions any number of functions that will be called when the app state changes
 */
export const useRefetchOnAppStateChange = (...refetchFunctions: (() => void)[]) => {
  const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState);
  const appStateRef = useRef<AppStateStatus>(appState);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (appStateRef.current.match(/inactive|background/) && nextAppState === 'active') {
        refetchFunctions.forEach((refetch) => refetch());
      }
      appStateRef.current = nextAppState;
      setAppState(nextAppState);
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, [refetchFunctions]);
};
