import { FeatureFlagProvider, useAuthentication } from '@noice-com/common-ui';

import { useNavigateOnLogout } from '../navigation/hooks/useNavigateOnLogout.hook';

import { StreamAlerts } from './StreamAlerts/StreamAlerts';

import { Routes } from '@common/route';

export function StreamAlertsRoute() {
  const { isAuthenticated, initialized } = useAuthentication();

  useNavigateOnLogout({
    to: {
      pathname: Routes.PopoutWaitForLogin,
      search: `from=${location.pathname}${encodeURIComponent(location.search)}`,
    },
  });

  if (!initialized || !isAuthenticated()) {
    return null;
  }

  return (
    <FeatureFlagProvider>
      <StreamAlerts />
    </FeatureFlagProvider>
  );
}
