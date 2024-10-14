import { Navigate } from 'react-router';

import { useChannelContext, useChannelRouteContext } from '@common/channel';
import { useOnboardingContext } from '@common/onboarding';
import { ChannelRole } from '@common/profile';
import { Routes, routePermissions } from '@common/route';

const getFirstRouteWhereAccess = (
  userChannelRoles: ChannelRole[],
  shouldCompleteOnboarding: boolean,
) => {
  if (shouldCompleteOnboarding) {
    return Routes.GettingStarted;
  }

  return (
    Object.entries(routePermissions)
      // Exclude GettingStarted route from the selection
      .filter(([route]) => route !== Routes.GettingStarted)
      .find(([_, roles]) => {
        return roles.some((role) => userChannelRoles.includes(role));
      })?.[0]
  );
};

export function Home() {
  const { userChannelRoles, loadingUserChannelRoles } = useChannelContext();
  const { transformPathToChannelPath } = useChannelRouteContext();
  const { shouldCompleteOnboarding, isOnboardingDataLoading } = useOnboardingContext();

  const redirect = getFirstRouteWhereAccess(userChannelRoles, shouldCompleteOnboarding);

  if (loadingUserChannelRoles || isOnboardingDataLoading) {
    return null;
  }

  return (
    <Navigate
      to={redirect ? transformPathToChannelPath(redirect) : Routes.NoAccess}
      replace
    />
  );
}
