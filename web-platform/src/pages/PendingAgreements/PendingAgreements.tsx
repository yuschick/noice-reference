import { gql } from '@apollo/client';
import { SignupContent, useAuthenticatedUser } from '@noice-com/common-ui';
import { ClientToS, Nullable } from '@noice-com/utils';
import { useState } from 'react';
import { useNavigate } from 'react-router';

import { MarketingConsentForm } from './MarketingConsentForm/MarketingConsentForm';
import styles from './PendingAgreements.module.css';
import { TermsFormError } from './TermFormError/TermFormError';
import { TermsOfServiceAgreement } from './TermsOfServiceAgreementForm/TermsOfServiceAgreementForm';
import { MissingAgreement } from './types';

import { Routes } from '@common/route';
import { AuthConsentStatus, useUserTagQuery } from '@gen';
import { NoAccessPage } from '@pages/common/NoAccessPage';

gql`
  query UserTag($userId: ID!) {
    profile(userId: $userId) {
      userId
      userTag
      temporary
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

export function PendingAgreements() {
  const [missingAgreements, setMissingAgreements] = useState<MissingAgreement[]>([]);
  const [error, setError] = useState<Nullable<string>>(null);

  const navigate = useNavigate();
  const { userId } = useAuthenticatedUser();

  const { data, loading: userDataLoading } = useUserTagQuery({
    variables: { userId },
    onCompleted: (data) => {
      if (data.profile?.temporary) {
        navigate(Routes.Home, { replace: true });
        return;
      }

      const missingAgreements: MissingAgreement[] = [];

      const termsOfServiceAgreement = data?.profile?.account?.pendingAgreements?.find(
        (agreement) => ClientToS.isCurrentAgreement(agreement),
      );

      if (termsOfServiceAgreement) {
        missingAgreements.push('tos');
      }

      const missingMarketingOptIn =
        data?.profile?.account?.marketingConsent ===
        AuthConsentStatus.ConsentStatusUnspecified;

      if (missingMarketingOptIn) {
        missingAgreements.push('marketing-consent');
      }

      // If nothing is missing, navigate to home
      if (!missingAgreements.length) {
        navigate(Routes.Home, { replace: true });
        return;
      }

      setMissingAgreements(missingAgreements);
    },
    // fetch the most actual agreements to be signed
    fetchPolicy: 'network-only',
  });

  const onCompleted = (type: MissingAgreement) => {
    setMissingAgreements((prev) => {
      const missingAgreements = prev.filter((agreement) => agreement !== type);

      // If there is nothing left, navigate to home
      if (!missingAgreements.length) {
        navigate(Routes.Home, { replace: true });
      }

      return missingAgreements;
    });
  };

  return (
    <NoAccessPage
      loading={userDataLoading}
      title="Please review the updated terms"
      withBackground
    >
      {data?.profile && (
        <div className={styles.wrapper}>
          {!error ? (
            <SignupContent>
              <SignupContent.Main>
                {missingAgreements?.[0] === 'tos' && (
                  <TermsOfServiceAgreement
                    userTag={data.profile.userTag}
                    onCompleted={() => onCompleted('tos')}
                    onError={setError}
                  />
                )}

                {missingAgreements?.[0] === 'marketing-consent' && (
                  <MarketingConsentForm
                    onCompleted={() => onCompleted('marketing-consent')}
                    onError={setError}
                  />
                )}
              </SignupContent.Main>
            </SignupContent>
          ) : (
            <TermsFormError onError={() => setError(null)} />
          )}
        </div>
      )}
    </NoAccessPage>
  );
}
