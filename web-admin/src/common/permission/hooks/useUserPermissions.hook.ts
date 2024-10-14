import { gql } from '@apollo/client';
import { useAuthenticatedUser } from '@noice-com/common-ui';

import { AuthPlatformRole, useUserPermissionsQuery } from '@gen';

gql`
  query UserPermissions($userId: ID!) {
    profile(userId: $userId) {
      userId
      account {
        uid
        roles
      }
    }
  }
`;

interface HookResult {
  roles: AuthPlatformRole[];
  isAdmin: boolean;
  loading: boolean;
  hasPermissionFromArray: (permissions: AuthPlatformRole[]) => boolean;
}

export function useUserPermissions(): HookResult {
  const { userId } = useAuthenticatedUser();

  const { data, loading } = useUserPermissionsQuery({
    variables: {
      userId,
    },
  });

  const roles = data?.profile?.account?.roles ?? [];

  const isAdmin = roles.includes(AuthPlatformRole.PlatformRoleAdmin);

  const hasPermissionFromArray = (permissions: AuthPlatformRole[]) => {
    return permissions.some((permission) => roles.includes(permission));
  };

  return {
    roles,
    isAdmin,
    loading,
    hasPermissionFromArray,
  };
}
