import { Client } from '@noice-com/platform-client';
import { Nullable, makeLoggers } from '@noice-com/utils';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

import { WithChildren } from '@common-types';
import { handleLogout, restoreSession, saveSessionInStorage } from '@common-utils';

const { logError } = makeLoggers('AuthProvider');

interface IAuthContext {
  userId: Nullable<string>;
  initialized: boolean;
  isImplicitAccount: boolean;
  isFullAccount: boolean;
  isAuthenticated(): boolean;
  hasRole(role: string): boolean;
}

const AuthContext = createContext<IAuthContext>({
  userId: null,
  initialized: false,
  isImplicitAccount: false,
  isFullAccount: false,
  isAuthenticated: () => false,
  hasRole: () => false,
});

interface Props {
  client: Client;
  loginRoute: string;
  restoreSession?: typeof restoreSession;
  redirect?: boolean;
}

export function AuthProvider({
  children,
  client,
  restoreSession: resSession = restoreSession,
  loginRoute,
  redirect,
}: WithChildren<Props>) {
  const [userId, setUserId] = useState<Nullable<string>>(null);
  const [initialized, setInitialized] = useState(false);
  const [roles, setRoles] = useState<Nullable<string[]>>(null);

  useEffect(() => {
    return client.onAuthenticated((auth) => {
      saveSessionInStorage(client.getSession());
      setUserId(auth.uid ?? null);
      setInitialized(true);
      setRoles(auth.roles ?? null);
    });
  }, [client]);

  useEffect(() => {
    return client.onLogout(async (auth) => {
      if (!initialized) {
        // Not really a logout if we never managed to restore the session
        return;
      }

      try {
        await client.AnalyticsService.sendEventsImmediately({ keepalive: true });
      } catch (err) {
        logError('failed to flush session before logout', err);
      }

      handleLogout(loginRoute, auth?.roles ?? [], redirect);
    });
  }, [client, initialized, loginRoute, redirect]);

  const initSession = useCallback(async () => {
    if (!client) {
      return;
    }

    // Restore session if we can
    const success = await resSession(client, loginRoute, redirect);

    if (!success) {
      setInitialized(true);
      return;
    }
  }, [client, resSession, loginRoute, redirect]);

  useEffect(() => {
    initSession();
  }, [initSession]);

  const isAuthenticated = useCallback(() => !!userId, [userId]);

  const hasRole = useCallback(
    (role: string) => {
      if (!roles) {
        return false;
      }

      return roles.includes(role);
    },
    [roles],
  );

  const isImplicitAccount = hasRole('user') && !hasRole('full_user');
  const isFullAccount = hasRole('full_user');

  const context = {
    hasRole,
    userId,
    isImplicitAccount,
    isFullAccount,
    initialized,
    isAuthenticated,
  };

  return <AuthContext.Provider value={context}>{children}</AuthContext.Provider>;
}

export interface MockProps {
  userId?: string;
}

export function MockAuthProvider({ children, userId = 'me' }: WithChildren<MockProps>) {
  return (
    <AuthContext.Provider
      value={{
        userId,
        hasRole: () => true,
        isAuthenticated: () => true,
        initialized: true,
        isImplicitAccount: false,
        isFullAccount: true,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthentication(): IAuthContext {
  const auth = useContext(AuthContext);

  if (!auth) {
    throw new Error('Trying to access auth from context without AuthProvider');
  }

  return auth;
}
