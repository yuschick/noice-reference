import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import { useAuthentication } from '@noice-com/common-ui';
import { useLocation, useNavigate } from 'react-router';

import { useCheckIfAccountIsCompleted } from '@common/account-completion';
import { ACCOUNT_DELETED_PATH, ACCOUNT_SUSPENSION_PATH } from '@common/route/utils'; // To prevent circular dependencies
import {
  ApiEntityState,
  AuthAccountStatusFlag,
  useAppRouteRedirectsProfileQuery,
} from '@gen';

gql`
  query AppRouteRedirectsProfile($userId: ID!) {
    profile(userId: $userId) {
      userId
      account {
        flags
        state
      }
      ...CompleteAccountCheckProfile
    }

    platformBan(userId: $userId) {
      banId
    }
  }
`;

export function useAuthenticatedUserRedirects() {
  const { userId } = useAuthentication();
  const navigate = useNavigate();
  const location = useLocation();
  const { checkIsAccountCompletedWithRedirect } = useCheckIfAccountIsCompleted();

  useAppRouteRedirectsProfileQuery({
    ...variablesOrSkip({ userId }),
    // @todo: We can probably remove this when avatar editor updates cache with chosen avatar
    fetchPolicy: 'cache-and-network',
    onCompleted(data) {
      if (
        location.pathname !== ACCOUNT_DELETED_PATH &&
        (data.profile?.account?.state === ApiEntityState.EntityStateDeleted ||
          data.profile?.account?.flags.includes(
            AuthAccountStatusFlag.StatusFlagDeletionScheduled,
          ))
      ) {
        navigate(ACCOUNT_DELETED_PATH, {
          replace: true,
        });

        return;
      }

      // If user is not in ban page already, redirect there if user is banned
      if (location.pathname !== ACCOUNT_SUSPENSION_PATH && data?.platformBan?.banId) {
        navigate(ACCOUNT_SUSPENSION_PATH, {
          replace: true,
        });

        return;
      }

      if (!data.profile) {
        return;
      }

      if (
        !checkIsAccountCompletedWithRedirect({
          profile: data.profile,
          targetPath: location.state?.from ?? location.pathname,
        })
      ) {
        return;
      }
    },
  });
}
