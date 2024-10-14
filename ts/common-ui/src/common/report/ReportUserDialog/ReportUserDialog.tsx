import { ReportDialog } from '../ReportDialog';
import { ReportType } from '../types';

interface Props {
  reportedUserId: string;
  onDismiss(): void;
}

export function ReportUserDialog({ reportedUserId, onDismiss }: Props) {
  return (
    <ReportDialog
      reportContext={{ reportType: ReportType.User, reportedUserId }}
      onDismiss={onDismiss}
    />
  );
}
