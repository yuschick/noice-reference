import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import {
  AuthenticatedUserProvider,
  useAuthentication,
  usePageViewAnalytics,
} from '@noice-com/common-ui';
import { makeLoggers } from '@noice-com/utils';
import { ReactElement } from 'react';
import { Navigate, RouteProps, useLocation, useNavigate } from 'react-router-dom';

import { Routes } from '../types';

import { useProtectedRouteProfileQuery } from '@gen';

const { log } = makeLoggers('AUTHENTICATION');

gql`
  query ProtectedRouteProfile($userId: ID!) {
    platformBan(userId: $userId) {
      banId
    }
  }
`;

export function ProtectedRoute({ children }: RouteProps): ReactElement | null {
  usePageViewAnalytics();

  const { isAuthenticated, initialized, userId } = useAuthentication();
  const location = useLocation();
  const navigate = useNavigate();

  useProtectedRouteProfileQuery({
    ...variablesOrSkip({ userId }),
    onCompleted(data) {
      if (data.platformBan?.banId && location.pathname !== Routes.Suspended) {
        navigate(Routes.Suspended, { replace: true });
      }
    },
  });

  if (!initialized) {
    return null;
  }

  if (!isAuthenticated() || !userId) {
    log('Player trying to go somewhere without authenticating. Redirecting to login');

    return (
      <Navigate
        state={{ from: location }}
        to={{
          pathname: Routes.LogIn,
          search: `from=${location.pathname}${encodeURIComponent(location.search)}`,
        }}
      />
    );
  }

  return (
    <AuthenticatedUserProvider userId={userId}>{children}</AuthenticatedUserProvider>
  );
}
