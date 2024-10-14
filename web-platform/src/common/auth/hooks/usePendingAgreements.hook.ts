import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import { useAuthentication } from '@noice-com/common-ui';
import { ClientToS } from '@noice-com/utils';
import { useNavigate } from 'react-router';

import { ACCOUNT_PENDING_AGREEMENTS_PATH } from '@common/route';
import { AuthConsentStatus, useUserPendingAgreementsQuery } from '@gen';

gql`
  query UserPendingAgreements($userId: ID!) {
    profile(userId: $userId) {
      userId
      account {
        uid
        pendingAgreements {
          name
          revision
          url
        }
        marketingConsent
      }
    }
  }
`;

export function usePendingAgreements() {
  const navigate = useNavigate();
  const { userId, hasRole } = useAuthentication();

  const userPendingQueryArguments = variablesOrSkip({ userId });
  useUserPendingAgreementsQuery({
    ...userPendingQueryArguments,
    skip: userPendingQueryArguments.skip || !hasRole('full_user'),
    // avoid showing agreements which user doesn't need to sign
    fetchPolicy: 'network-only',
    onCompleted(data) {
      if (
        data?.profile?.account?.pendingAgreements?.find((agreement) =>
          ClientToS.isCurrentAgreement(agreement),
        )
      ) {
        navigate(ACCOUNT_PENDING_AGREEMENTS_PATH, { replace: true });
      }

      if (
        data?.profile?.account?.marketingConsent ===
        AuthConsentStatus.ConsentStatusUnspecified
      ) {
        navigate(ACCOUNT_PENDING_AGREEMENTS_PATH, { replace: true });
      }
    },
  });
}
