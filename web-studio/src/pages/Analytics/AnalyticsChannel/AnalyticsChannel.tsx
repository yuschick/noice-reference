import { useFeatureFlag } from '@noice-com/common-ui';

import { LookerStudioReport } from '@common/report';

export function AnalyticsChannel() {
  const [reportId] = useFeatureFlag(
    'analytics_channelReportId',
    '8e8e0e58-7688-41fe-b1b2-6fc68ac5b72e/page/BRh9D',
  );

  return (
    <LookerStudioReport
      reportId={reportId}
      title="Channel analytics"
    />
  );
}
