import notifee, { AuthorizationStatus } from '@notifee/react-native';
import { useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';

export const useShouldAskForNotificationPermission = () => {
  const [shouldAsk, setShouldAsk] = useState(false);
  const [shouldPromptToSettings, setShouldPromptToSettings] = useState(false);
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      appState.current = nextAppState;
      setAppStateVisible(appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    const getStatus = async () => {
      const { authorizationStatus } = await notifee.getNotificationSettings();

      switch (authorizationStatus) {
        default:
        case AuthorizationStatus.AUTHORIZED:
        case AuthorizationStatus.PROVISIONAL:
          setShouldAsk(false);
          break;
        case AuthorizationStatus.DENIED:
          setShouldPromptToSettings(true);
          setShouldAsk(false);
          break;
        case AuthorizationStatus.NOT_DETERMINED:
          setShouldAsk(true);
      }
    };

    getStatus();
  }, [appStateVisible]);

  return { shouldAsk, shouldPromptToSettings };
};
