import { SetTimeoutId } from '@noice-com/common-ui';
import { ConnectionErrorMsg, ConnectionState } from '@noice-com/platform-client';
import { Nullable } from '@noice-com/utils';
import { useEffect, useState } from 'react';

import { useStreamGame } from '../context';
import { CardGameOnConnectionStatusChanged } from '../types';

interface HookResult {
  hide: boolean;
  state: ConnectionState;
  error: Nullable<ConnectionErrorMsg>;
}

export function useConnectionStatusChange(): HookResult {
  const [hide, setHide] = useState(true);
  const [currentState, setCurrentState] = useState(ConnectionState.CONNECTED);
  const [error, setError] = useState<Nullable<ConnectionErrorMsg>>(null);

  const { gameInstance } = useStreamGame();

  useEffect(() => {
    if (!gameInstance) {
      return;
    }

    let hideTimeout: Nullable<SetTimeoutId> = null;
    let reconnectTimeout: Nullable<SetTimeoutId> = null;

    const handleConnectionStatusChanged = ({
      state,
      closedMessage,
      error,
    }: CardGameOnConnectionStatusChanged) => {
      if (state === ConnectionState.DISCONNECTED && closedMessage) {
        return;
      }

      if (state === ConnectionState.RECONNECTING) {
        // We don't want to show reconnecting right away since reconnect logic might save us quickly
        reconnectTimeout = setTimeout(() => {
          setCurrentState(ConnectionState.RECONNECTING);
          setHide(false);
          setError(error);
        }, 2000);

        return;
      }

      // Set current state
      setCurrentState(state);

      // Start up our hide timeout when we connect
      if (state === ConnectionState.CONNECTED) {
        // If reconnect message was timed, we can cancel it since again connected
        if (reconnectTimeout) {
          clearTimeout(reconnectTimeout);
          reconnectTimeout = null;
        }

        setHide((alreadyHidden: boolean) => {
          if (alreadyHidden) {
            return true;
          }

          // If not already hidden, set a timeout
          hideTimeout = setTimeout(() => setHide(true), 2500);
          return false;
        });
        return;
      }

      if (!error) {
        return;
      }

      setError(error);

      if (state === ConnectionState.DISCONNECTED) {
        setHide(false);
      }
    };

    gameInstance?.addListener('onConnectionStatusChanged', handleConnectionStatusChanged);
    return () => {
      gameInstance?.removeListener(
        'onConnectionStatusChanged',
        handleConnectionStatusChanged,
      );

      if (hideTimeout) {
        clearTimeout(hideTimeout);
      }

      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
    };
  }, [gameInstance]);

  return {
    hide,
    state: currentState,
    error,
  };
}
