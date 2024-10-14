// eslint-disable-next-line no-restricted-imports
import { Link, LinkProps, matchPath, resolvePath } from 'react-router-dom';

// This is special case, and the ugly import is for preventing dependency cycle
// eslint-disable-next-line import/no-restricted-paths
import { useModuleRouter } from '../../../module-common/context/ModuleRouterProvider';
import { useUserPermissions } from '../hooks';

/**
 * This component checks if user has access to the given link
 * If not, it renders only span with given attributes
 */
export function PermissionLink(props: LinkProps) {
  const { isAdmin, hasPermissionFromArray } = useUserPermissions();
  const { modulePathPermissions } = useModuleRouter();

  // Admin has access to all pages
  if (isAdmin) {
    return <Link {...props} />;
  }

  const pathPermissionEntry = Object.entries(modulePathPermissions).find(([path]) =>
    matchPath(path, resolvePath(props.to).pathname),
  );

  if (!pathPermissionEntry) {
    return <Link {...props} />;
  }

  const pathPermissions = pathPermissionEntry[1];

  if (!pathPermissions || !hasPermissionFromArray(pathPermissions)) {
    return <span {...props} />;
  }

  return <Link {...props} />;
}
