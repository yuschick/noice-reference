import { useClient } from '@noice-com/common-react-core';
import { Nullable, getErrorMessage, makeLoggers } from '@noice-com/utils';
import { useCallback, useEffect } from 'react';
import { create } from 'zustand';

import { LocalStorage } from '../utils/storage';

const { logError, log } = makeLoggers('useAuth');

interface AuthStore {
  userId: Nullable<string>;
  initialized: boolean;
  isAuthenticated: boolean;
  setUserId: (userId: Nullable<string>) => void;
  setInitialized: (initialized: boolean) => void;
}

const useAuthStore = create<AuthStore>((set) => ({
  userId: null,
  initialized: false,
  isAuthenticated: false,
  setUserId: (userId) => set({ userId, isAuthenticated: !!userId }),
  setInitialized: (initialized: boolean) => set({ initialized }),
}));

export const useAuth = () => {
  const client = useClient();
  const { initialized, userId, setUserId, setInitialized, isAuthenticated } =
    useAuthStore();

  const refreshSession = useCallback(async () => {
    try {
      const storedSession = LocalStorage.getAuthSession();

      if (!storedSession) {
        log('No session to restore.');
        return;
      }

      await client.restoreSession(storedSession);

      setUserId(client.auth?.uid ?? null);
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      logError('Failed to restore session', errorMessage);
      client.clearSession();
    }
  }, [client, setUserId]);

  useEffect(() => {
    /**
     * useAuth might be used in any part of the app but we only
     * want to subscribe to client auth events once.
     *  */
    if (initialized) {
      return;
    }

    client.onAuthenticated((auth) => {
      setUserId(auth.uid ?? null);
      LocalStorage.setAuthSession(client.getSession());
    });

    client.onLogout(() => {
      LocalStorage.setAuthSession(null);
      setUserId(null);
    });

    refreshSession()
      .then(() => log('Session restored'))
      .then(() => setInitialized(true))
      .catch((err) => logError('Failed to restore session', getErrorMessage(err)));
  }, [client, initialized, refreshSession, setInitialized, setUserId, userId]);

  return {
    userId,
    initialized,
    isAuthenticated,
  };
};
