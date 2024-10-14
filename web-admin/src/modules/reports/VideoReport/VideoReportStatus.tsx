import classNames from 'classnames';

import styles from './VideoReportStatus.module.css';

import { SupportReportCaseStatus, SupportReportCaseResolution } from '@gen';

interface Props {
  status: SupportReportCaseStatus;
  resolution?: SupportReportCaseResolution;
}

const reportCaseStatusMap: Record<SupportReportCaseStatus, string> = {
  [SupportReportCaseStatus.ReportCaseStatusOpen]: 'Pending',
  [SupportReportCaseStatus.ReportCaseStatusClosed]: 'Closed',
  [SupportReportCaseStatus.ReportCaseStatusUnspecified]: 'Unspecified',
};

const reportCaseResolutionMap: Record<SupportReportCaseResolution, string> = {
  [SupportReportCaseResolution.ReportCaseResolutionAllowContent]: '(content allowed)',
  [SupportReportCaseResolution.ReportCaseResolutionRemoveContent]: '(content removed)',
  [SupportReportCaseResolution.ReportCaseResolutionUnspecified]: '',
};

export function VideoReportStatus({ status, resolution }: Props) {
  return (
    <span
      className={classNames(styles.status, {
        [styles.pending]: status === SupportReportCaseStatus.ReportCaseStatusOpen,
        [styles.removed]:
          resolution === SupportReportCaseResolution.ReportCaseResolutionRemoveContent,
        [styles.allowed]:
          resolution === SupportReportCaseResolution.ReportCaseResolutionAllowContent,
      })}
    >
      {reportCaseStatusMap[status]}{' '}
      {resolution ? reportCaseResolutionMap[resolution] : ''}
    </span>
  );
}
