import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';

import { useChannelContext, useChannelRouteContext } from '@common/channel';
import { routePermissions } from '@common/route';

export function usePermissionRedirect() {
  const { userChannelRoles } = useChannelContext();
  const location = useLocation();
  const { matchChannelPath } = useChannelRouteContext();
  const navigate = useNavigate();

  useEffect(() => {
    // Don't redirect if user is on home page
    if (location.pathname === '/' || matchChannelPath('/', location.pathname)) {
      return;
    }

    const pathPermissionEntry = Object.entries(routePermissions).find(
      ([path]) => !!matchChannelPath(path, location.pathname),
    );

    // Do nothing if current page doesn't have a permission entry
    if (!pathPermissionEntry) {
      return;
    }

    const pathPermissionsRoles = pathPermissionEntry[1];

    if (!pathPermissionsRoles.some((role) => userChannelRoles.includes(role))) {
      // Navigate to home page if user doesn't have permission to view current page
      navigate('/', { replace: true });
    }
  }, [location, matchChannelPath, navigate, userChannelRoles]);
}
