import { Nullable } from '@noice-com/utils';
import { createContext, useContext } from 'react';

import { useAuthentication } from './AuthProvider';

import { WithChildren } from '@common-types';

interface Context {
  userId: string;
  isImplicitAccount: boolean;
  isFullAccount: boolean;
  hasRole(role: string): boolean;
}

const AuthenticatedUserContext = createContext<Nullable<Context>>(null);

interface Props {
  userId: string;
}

export function AuthenticatedUserProvider({ userId, children }: WithChildren<Props>) {
  const { isImplicitAccount, isFullAccount, hasRole } = useAuthentication();

  return (
    <AuthenticatedUserContext.Provider
      value={{
        userId,
        isImplicitAccount,
        isFullAccount,
        hasRole,
      }}
    >
      {children}
    </AuthenticatedUserContext.Provider>
  );
}

export function useAuthenticatedUser() {
  const context = useContext(AuthenticatedUserContext);

  if (!context) {
    throw new Error(
      'useAuthenticatedUser must be used within a AuthenticatedUserProvider',
    );
  }

  return context;
}

export function MockAuthenticatedUserProvider({
  children,
  userId = 'me',
}: WithChildren<Props>) {
  return (
    <AuthenticatedUserContext.Provider
      value={{
        userId,
        isImplicitAccount: false,
        isFullAccount: true,
        hasRole: () => true,
      }}
    >
      {children}
    </AuthenticatedUserContext.Provider>
  );
}
