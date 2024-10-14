import { LoadingSpinner, useFeatureFlag } from '@noice-com/common-ui';

import styles from './AnalyticsLatestStream.module.css';

import { useLatestStreamReportStream } from '@common/channel-analytics';
import { LayoutBox, PageHeading } from '@common/layout';
import { LookerStudioReport } from '@common/report';

export function AnalyticsLatestStreamWrapper() {
  const { streamId, loading } = useLatestStreamReportStream();
  const [reportId] = useFeatureFlag(
    'analytics_latestStreamReportId',
    '42b6a98d-059a-4bbe-ae9f-cbdee0e0f335/page/BRh9D',
  );

  if (loading) {
    return (
      <div className={styles.wrapper}>
        <LoadingSpinner />
      </div>
    );
  }

  if (!streamId) {
    return (
      <div className={styles.noReportWrapper}>
        <div className={styles.content}>
          <PageHeading title="Latest stream report" />
          <LayoutBox>
            <div className={styles.message}>
              <div className={styles.main}>Start streaming to see your stats</div>
              <div className={styles.secondary}>
                Your report will be available for 48H
              </div>
            </div>
          </LayoutBox>
        </div>
      </div>
    );
  }

  return (
    <LookerStudioReport
      customParams={{
        'ds1.streamid': streamId,
      }}
      reportId={reportId}
      title="Latest Stream analytics"
    />
  );
}
