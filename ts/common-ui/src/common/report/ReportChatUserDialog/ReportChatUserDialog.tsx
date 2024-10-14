import { ReportDialog } from '../ReportDialog';
import { ReportType } from '../types';

interface Props {
  channelId: string;
  chatId: string;
  messageId: string;
  reportedUserId: string;
  onDismiss(): void;
}

export function ReportChatUserDialog({
  channelId,
  chatId,
  messageId,
  reportedUserId,
  onDismiss,
}: Props) {
  return (
    <ReportDialog
      reportContext={{
        reportType: ReportType.ChannelChat,
        channelId,
        chatId,
        messageId,
        reportedUserId,
      }}
      onDismiss={onDismiss}
    />
  );
}
