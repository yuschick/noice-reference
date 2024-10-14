import { WithChildren } from '@noice-com/common-ui';

import { useUserPermissions } from '../hooks';

import { allowedRoles } from '@common/route';

interface Props {
  /**
   * Default is admin only.
   */
  allowedRoles?: (typeof allowedRoles)[number][];
  forceHideFromAdmin?: boolean;
}

/**
 * Content is always visible for admin, and for users with any of the allowed roles. You can also force hide content from admin.
 */
export function PermissionWrapper({
  allowedRoles,
  children,
  forceHideFromAdmin,
}: WithChildren<Props>) {
  const { isAdmin, hasPermissionFromArray, loading } = useUserPermissions();

  if (loading) {
    return null;
  }

  // If user is admin and force hide is not on OR user has any of the allowed roles, render children.
  if (
    (isAdmin && !forceHideFromAdmin) ||
    (allowedRoles && hasPermissionFromArray(allowedRoles))
  ) {
    return <>{children}</>;
  }

  return null;
}
