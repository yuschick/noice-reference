import { gql } from '@apollo/client';
import { useEffect, useState } from 'react';

import { UserRole } from '../reasons';
import { ReportType, Report } from '../types';

import { ReportReasonProvider } from './context';
import { ReasonSelect } from './ReasonSelect';
import styles from './ReportDialog.module.css';
import { ReportDialogActions } from './ReportDialogActions';
import { ReportStreamerProfile } from './ReportStreamerProfile';
import { ReportUserProfile } from './ReportUserProfile';

import { Dialog, useDialog, Button } from '@common-components';
import {
  SupportReportContextChannelInput,
  SupportReportContextChatMessageInput,
  SupportReportContextStreamInput,
  SupportReportContextUserInput,
  useReportedChannelLazyQuery,
  useReportedUserProfileLazyQuery,
  useReportUserMutation,
} from '@common-gen';

gql`
  mutation ReportUser(
    $reason: SupportReportReason!
    $description: String
    $context: SupportReportContextInput!
  ) {
    createReport(reason: $reason, description: $description, context: $context) {
      createdAt
    }
  }

  query ReportedUserProfile($userId: ID!) {
    profile(userId: $userId) {
      userId
      ...ReportedUserProfile
      ...ReasonSelectProfile
    }
  }

  query ReportedChannel($channelId: ID!) {
    channel(id: $channelId) {
      id
      ...ReasonSelectChannel
      ...ReportedChannel
    }
  }
`;

type RequiredNotNull<T> = {
  [P in keyof T]-?: NonNullable<T[P]>;
};

export interface StreamReportProps
  extends RequiredNotNull<Omit<SupportReportContextStreamInput, 'userId'>> {
  reportedUserId: string;
  reportType: ReportType.Livestream;
}

export interface ChatMessageReportProps
  extends RequiredNotNull<Omit<SupportReportContextChatMessageInput, 'userId'>> {
  reportedUserId: string;
  reportType: ReportType.ChannelChat;
}

interface UserReportProps
  extends RequiredNotNull<Omit<SupportReportContextUserInput, 'userId' | 'target'>> {
  reportedUserId: string;
  reportType: ReportType.User;
}

interface ChannelReportProps
  extends RequiredNotNull<Omit<SupportReportContextChannelInput, 'target'>> {
  reportType: ReportType.Channel;
}

interface Props {
  reportContext:
    | StreamReportProps
    | ChatMessageReportProps
    | UserReportProps
    | ChannelReportProps;
  onDismiss(): void;
}

enum ReportStep {
  ReasonSelection,
  ReportSubmitted,
}

const getUserRole = (reportType: ReportType) => {
  if (reportType === ReportType.Livestream || reportType === ReportType.Channel) {
    return UserRole.Creator;
  }

  return UserRole.User;
};

export function ReportDialog({ onDismiss, reportContext }: Props) {
  const [reportUser] = useReportUserMutation();
  const [reportStep, setReportStep] = useState(ReportStep.ReasonSelection);

  const userRole = getUserRole(reportContext.reportType);

  const dialog = useDialog({
    initialState: 'open',
    title: `Report ${userRole}`,
    onClose: onDismiss,
  });

  const [fetchUser, { data: userData }] = useReportedUserProfileLazyQuery();
  const user = userData?.profile ?? null;

  const [fetchChannel, { data: channelData }] = useReportedChannelLazyQuery();
  const channel = channelData?.channel ?? null;

  useEffect(() => {
    if (
      reportContext.reportType === ReportType.User ||
      reportContext.reportType === ReportType.ChannelChat
    ) {
      fetchUser({
        variables: {
          userId: reportContext.reportedUserId,
        },
      });
      return;
    }

    if (
      reportContext.reportType === ReportType.Channel ||
      reportContext.reportType === ReportType.Livestream
    ) {
      fetchChannel({
        variables: {
          channelId: reportContext.channelId,
        },
      });
    }
  }, [fetchUser, reportContext.reportType, reportContext, fetchChannel]);

  const reportReasonSubmit = (report: Report) => {
    switch (reportContext.reportType) {
      case ReportType.ChannelChat:
        reportUser({
          variables: {
            reason: report.reason,
            description: report.description,
            context: {
              chatMessage: {
                userId: reportContext.reportedUserId,
                channelId: reportContext.channelId,
                chatId: reportContext.chatId,
                messageId: reportContext.messageId,
              },
            },
          },
        });
        break;

      case ReportType.Livestream:
        reportUser({
          variables: {
            reason: report.reason,
            description: report.description,
            context: {
              stream: {
                userId: reportContext.reportedUserId,
                channelId: reportContext.channelId,
                streamId: reportContext.streamId,
                startAt: reportContext.startAt,
              },
            },
          },
        });
        break;

      case ReportType.User:
        reportUser({
          variables: {
            reason: report.reason,
            description: report.description,
            context: {
              user: {
                userId: reportContext.reportedUserId,
              },
            },
          },
        });
        break;

      case ReportType.Channel:
        reportUser({
          variables: {
            reason: report.reason,
            description: report.description,
            context: {
              channel: {
                channelId: reportContext.channelId,
              },
            },
          },
        });
        break;
    }

    setReportStep(ReportStep.ReportSubmitted);
  };

  return (
    <ReportReasonProvider
      reportType={reportContext.reportType}
      userRole={userRole}
      onReportReasonSubmit={reportReasonSubmit}
    >
      <Dialog store={dialog}>
        <Dialog.Header />
        <Dialog.Close />
        <Dialog.Content>
          {reportStep === ReportStep.ReasonSelection && (
            <div className={styles.content}>
              {(reportContext.reportType === ReportType.ChannelChat ||
                reportContext.reportType === ReportType.User) && (
                <ReportUserProfile user={user} />
              )}

              {(reportContext.reportType === ReportType.Livestream ||
                reportContext.reportType === ReportType.Channel) && (
                <ReportStreamerProfile channel={channel} />
              )}

              <ReasonSelect
                channel={channel}
                reportType={reportContext.reportType}
                user={user}
              />
            </div>
          )}

          {reportStep === ReportStep.ReportSubmitted && (
            <div className={styles.description}>
              <h2 className={styles.title}>Thank you</h2>

              <p>We&apos;ve received your report and it is now being reviewed.</p>

              <p className={styles.bold}>What happens next?</p>

              <p>
                We will look through your report, which may include human review, and take
                action as appropriate. Once it is processed, we will let you know whether
                or not we found the behavior you reported to be against our guidelines.
              </p>
            </div>
          )}
        </Dialog.Content>

        <Dialog.Actions>
          {reportStep === ReportStep.ReportSubmitted ? (
            <Button
              theme="dark"
              onClick={onDismiss}
            >
              Close
            </Button>
          ) : (
            <ReportDialogActions />
          )}
        </Dialog.Actions>
      </Dialog>
    </ReportReasonProvider>
  );
}
