import { ReportDialog } from '../ReportDialog';
import { ReportType } from '../types';

interface Props {
  channelId: string;
  onDismiss(): void;
}

export function ReportChannelDialog({ channelId, onDismiss }: Props) {
  return (
    <ReportDialog
      reportContext={{ reportType: ReportType.Channel, channelId }}
      onDismiss={onDismiss}
    />
  );
}
