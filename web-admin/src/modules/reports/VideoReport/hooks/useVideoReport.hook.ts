import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';

import {
  SupportReportContextStream,
  useVideoReportCaseQuery,
  useVideoReportChannelQuery,
  useVideoReportStreamQuery,
} from '@gen';

gql`
  query VideoReportCase($caseId: ID!) {
    reportCase(id: $caseId) {
      id
      status
      resolution
      context {
        value {
          ... on SupportReportContextStream {
            streamId
            startAt
          }
        }
      }
    }

    reports(filter: { caseId: $caseId }, cursor: { first: 20 }) {
      reports {
        ...VideoReport
      }
    }
  }
`;

gql`
  query VideoReportStream($streamId: ID!) {
    stream(id: $streamId) {
      channelId
      streamId
    }
  }
`;

gql`
  query VideoReportChannel($channelId: ID!) {
    channel(id: $channelId) {
      ...VideoReportChannel
    }
  }
`;

export function useVideoReport(caseId?: string) {
  const { data: caseData, loading: caseLoading } = useVideoReportCaseQuery({
    ...variablesOrSkip({ caseId }),
  });
  const streamId = caseData?.reportCase?.context
    ? (caseData.reportCase.context.value as SupportReportContextStream).streamId
    : null;

  const { data: streamData, loading: streamLoading } = useVideoReportStreamQuery({
    ...variablesOrSkip({ streamId }),
  });

  const channelId = streamData?.stream?.channelId;
  const { data: channelData, loading: channelLoading } = useVideoReportChannelQuery({
    ...variablesOrSkip({ channelId }),
  });

  return {
    loading: streamLoading || caseLoading || channelLoading,
    reportCase: caseData?.reportCase || null,
    reports: caseData?.reports || null,
    channel: channelData?.channel || null,
    stream: streamData?.stream || null,
  };
}
