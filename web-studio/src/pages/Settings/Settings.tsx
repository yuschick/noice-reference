import { Navigate, Outlet, useLocation } from 'react-router';

import styles from './Settings.module.css';

import { useChannelContext, useChannelRouteContext } from '@common/channel';
import { ChannelRole } from '@common/profile';
import { Routes, routePermissions } from '@common/route';

const getFirstRouteWhereAccess = (userChannelRoles: ChannelRole[]) => {
  return Object.entries(routePermissions)
    .filter(([route]) => route.startsWith(`${Routes.Settings}/`))
    .find(
      ([_route, roles]) => !!roles.some((role) => userChannelRoles.includes(role)),
    )?.[0];
};

export function Settings() {
  const { userChannelRoles } = useChannelContext();
  const { transformPathToChannelPath, matchChannelPath } = useChannelRouteContext();
  const location = useLocation();

  const redirect = getFirstRouteWhereAccess(userChannelRoles);

  if (matchChannelPath(Routes.Settings, location.pathname)) {
    return (
      <Navigate
        to={redirect ? transformPathToChannelPath(redirect) : Routes.NoAccess}
        replace
      />
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
}
