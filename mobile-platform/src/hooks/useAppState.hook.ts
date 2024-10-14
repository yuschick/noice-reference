import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';

type Props = {
  onEnterForeground?: () => void;
  onEnterBackground?: () => void;
  onBecomeInactive?: () => void;
};

export const useAppState = ({
  onEnterBackground,
  onEnterForeground,
  onBecomeInactive,
}: Props) => {
  const currentAppState = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (
        (currentAppState.current === 'background' ||
          currentAppState.current === 'inactive') &&
        nextAppState === 'active'
      ) {
        onEnterForeground?.();
      }

      if (currentAppState.current === 'active' && nextAppState === 'background') {
        onEnterBackground?.();
      }

      if (nextAppState === 'inactive') {
        onBecomeInactive?.();
      }

      currentAppState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [onBecomeInactive, onEnterBackground, onEnterForeground]);
};
