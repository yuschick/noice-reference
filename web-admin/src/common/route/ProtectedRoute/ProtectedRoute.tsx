import { gql } from '@apollo/client';
import {
  AuthenticatedUserProvider,
  useAuthentication,
  usePageViewAnalytics,
} from '@noice-com/common-ui';
import { makeLoggers } from '@noice-com/utils';
import { ReactElement } from 'react';
import { Navigate, RouteProps, matchPath, useLocation } from 'react-router-dom';

import { allowedRoles } from '../consts';
import { LoginRoutes } from '../types';

import { useProtectedRoutePermissionQuery } from '@gen';

gql`
  query ProtectedRoutePermission($userId: ID!) {
    profile(userId: $userId) {
      userId
      account {
        uid
        roles
      }
    }
  }
`;

const { log } = makeLoggers('AUTHENTICATION');

export function ProtectedRoute({ children }: RouteProps): ReactElement | null {
  usePageViewAnalytics();
  const { isAuthenticated, initialized, userId } = useAuthentication();
  const location = useLocation();

  const { data, loading } = useProtectedRoutePermissionQuery({
    variables: {
      userId: userId ?? '',
    },
    skip: !userId || !!matchPath(LoginRoutes.NoAccess, location.pathname),
  });

  if (!initialized || loading) {
    return null;
  }

  if (!isAuthenticated() || !userId) {
    log('Player trying to go somewhere without authenticating. Redirecting to login');

    return (
      <Navigate
        state={{ from: location }}
        to={LoginRoutes.LogIn}
      />
    );
  }

  if (
    !matchPath(LoginRoutes.NoAccess, location.pathname) &&
    !data?.profile?.account?.roles.some((role) => allowedRoles.includes(role))
  ) {
    return (
      <Navigate
        to={LoginRoutes.NoAccess}
        replace
      />
    );
  }

  return (
    <AuthenticatedUserProvider userId={userId}>{children}</AuthenticatedUserProvider>
  );
}
