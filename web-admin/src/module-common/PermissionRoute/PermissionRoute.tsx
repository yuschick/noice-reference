import { WithChildren } from '@noice-com/common-ui';

// eslint-disable-next-line import/no-restricted-paths
import { NotFoundPage } from '../../page/NotFoundPage';
import { useModule } from '../context';

import { useUserPermissions } from '@common/permission';

export function PermissionRoute({ children }: WithChildren) {
  const { isAdmin, hasPermissionFromArray, loading } = useUserPermissions();
  const { activePage } = useModule();

  if (loading) {
    return null;
  }

  if (isAdmin) {
    return <>{children}</>;
  }

  if (!activePage?.permissions) {
    return <NotFoundPage />;
  }

  if (hasPermissionFromArray(activePage.permissions)) {
    return <>{children}</>;
  }

  return <NotFoundPage />;
}
