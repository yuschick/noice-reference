import { Navigate, PathMatch, generatePath, matchPath, useLocation } from 'react-router';

// This is special case, and the ugly import is for preventing dependency cycle
// eslint-disable-next-line import/no-restricted-paths
import { useModuleRouter } from '../../../module-common/context/ModuleRouterProvider';

// Prevent dependency cycle
import { useUserPermissions } from '@common/permission/hooks/useUserPermissions.hook';

const generatePathFromPermissionPath = (
  permissionPath: string,
  currentPath: PathMatch<string>,
) =>
  `/${generatePath(permissionPath, {
    ...currentPath?.params,
  })}`;

export function RedirectByPermission() {
  const { isAdmin, roles } = useUserPermissions();
  const location = useLocation();
  const { modulePathPermissions } = useModuleRouter();

  const currentPathName = Object.keys(modulePathPermissions).find((path) =>
    matchPath(path, location.pathname),
  );

  const currentPath = matchPath(currentPathName ?? '', location.pathname);

  if (!currentPathName || !currentPath) {
    return null;
  }

  const currentPathChildrenWithPermissions = Object.entries(modulePathPermissions).filter(
    ([path]) => path !== currentPathName && path.startsWith(currentPathName),
  );

  if (isAdmin) {
    return (
      <Navigate
        to={generatePathFromPermissionPath(
          currentPathChildrenWithPermissions[0][0],
          currentPath,
        )}
        replace
      />
    );
  }

  const permissionPath = currentPathChildrenWithPermissions.find(([, pathRoles]) =>
    pathRoles.some((pathRole) => roles.includes(pathRole)),
  )?.[0];

  if (!permissionPath) {
    return null;
  }

  return (
    <Navigate
      to={generatePathFromPermissionPath(permissionPath, currentPath)}
      replace
    />
  );
}
