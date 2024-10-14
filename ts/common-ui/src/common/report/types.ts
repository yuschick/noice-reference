import { SupportReportReason } from '@common-gen';

export enum ReportType {
  ChannelChat,
  Livestream,
  User,
  Channel,
}

export interface Report {
  reasonText: string;
  reason: SupportReportReason;
  description?: string;
}
