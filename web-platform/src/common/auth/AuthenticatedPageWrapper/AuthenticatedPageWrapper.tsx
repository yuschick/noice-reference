import {
  AuthenticatedUserProvider,
  FullscreenSpinner,
  useAuthentication,
  WithChildren,
} from '@noice-com/common-ui';
import { Navigate, useLocation } from 'react-router';

import { useAuthInBackgroundState } from '../context';

import { Routes } from '@common/route/types'; /* prevent circular dependency */

export function AuthenticatedPageWrapper({ children }: WithChildren) {
  const { userId } = useAuthentication();
  const { isAuthLoading } = useAuthInBackgroundState();
  const location = useLocation();

  if (isAuthLoading) {
    return <FullscreenSpinner />;
  }

  if (!userId) {
    // @todo change this to be home page when home page is usable for non auth users
    return (
      <Navigate
        to={{
          pathname: Routes.Signup,
          search: `from=${location.pathname}${encodeURIComponent(location.search)}`,
        }}
        replace
      />
    );
  }

  return (
    <AuthenticatedUserProvider userId={userId}>{children}</AuthenticatedUserProvider>
  );
}
