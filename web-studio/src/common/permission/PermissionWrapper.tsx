import { WithChildren } from '@noice-com/common-ui';

import { useChannelContext } from '@common/channel';
import { ChannelRole } from '@common/profile';

interface Props {
  /**
   * Default is admin and streamer.
   */
  allowedRoles?: ChannelRole[];
  forceHideFrom?: ChannelRole[];
}

const hasPermissionFromArray = (roles: ChannelRole[], permissions: ChannelRole[]) => {
  return permissions.some((permission) => roles.includes(permission));
};

/**
 * Content is always visible for admin and streamer, and for users with any of the allowed roles. You can also force hide content from admin or streamer.
 */
export function PermissionWrapper({
  allowedRoles,
  children,
  forceHideFrom,
}: WithChildren<Props>) {
  const { userChannelRoles } = useChannelContext();

  if (
    hasPermissionFromArray(userChannelRoles, [
      ...(allowedRoles ?? []),
      ...[ChannelRole.Admin, ChannelRole.Streamer].filter(
        (role) => !forceHideFrom?.includes(role),
      ),
    ])
  ) {
    return <>{children}</>;
  }

  return null;
}
