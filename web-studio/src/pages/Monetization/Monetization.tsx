import { CoreAssets } from '@noice-com/assets-core';
import {
  ButtonLink,
  Callout,
  NoiceSupportLinks,
  useBooleanFeatureFlag,
  useFeatureFlag,
} from '@noice-com/common-ui';
import classNames from 'classnames';
import { Outlet } from 'react-router';

import { AgreementForm } from './AgreementForm/AgreementForm';
import styles from './Monetization.module.css';

import { useChannelContext } from '@common/channel';
import { LookerStudioReport } from '@common/report';

export function Monetization() {
  const [showMonetizationEligibilityProgress] = useBooleanFeatureFlag(
    'reports_monetizationEligibilityProgress',
  );
  const [reportId] = useFeatureFlag(
    'analytics_monetizationEligibilityProgressReportId',
    '1a66d5cf-f984-4ebb-8448-bb09e0aa54b8/page/BRh9D',
  );
  const { channelOwnerAcceptedTerms, monetizationSettings } = useChannelContext();

  const hasSignedMonetizationAgreement = channelOwnerAcceptedTerms?.some(
    (term) => term.name === 'monetization-agreement',
  );

  if (!monetizationSettings?.eligible) {
    return (
      <div className={classNames(styles.wrapper, styles.notEligible)}>
        <Callout
          message="Your channel is not eligible for monetization."
          slots={{
            icon: CoreAssets.Icons.Lock,
            actions: {
              primary: (
                <ButtonLink
                  size="xs"
                  to={NoiceSupportLinks.MonetizationEligibility}
                >
                  Learn more
                </ButtonLink>
              ),
            },
          }}
          theme="gray"
          type="error"
          variant="bordered"
        />
        {showMonetizationEligibilityProgress && (
          <LookerStudioReport
            reportId={reportId}
            title="Monetization Eligibility Progression analytics"
          />
        )}
      </div>
    );
  }

  return (
    <section className={styles.wrapper}>
      <h2 className={styles.title}>Monetization</h2>
      {/* New accounts (post this release) will have the monetization agreement signed.
              But we must also check for 'enabled' to support legacy accounts that signed the agreement differently */}
      {hasSignedMonetizationAgreement || monetizationSettings.enabled ? (
        <Outlet />
      ) : (
        <AgreementForm />
      )}
    </section>
  );
}
