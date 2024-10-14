import { gql } from '@apollo/client';
import { useEffect, useState } from 'react';

import { ReportDialog } from '../ReportDialog';
import { ReportType } from '../types';

import { useReportStreamTimestampQuery } from '@common-gen';

gql`
  query ReportStreamTimestamp($streamId: ID!) {
    stream(id: $streamId) {
      streamId
      segments {
        startTime
      }
    }
  }
`;

interface Props {
  reportedUserId: string;
  streamId: string;
  channelId: string;
  onDismiss(): void;
}

export function ReportStreamDialog({
  onDismiss,
  reportedUserId,
  streamId,
  channelId,
}: Props) {
  const [startAt, setStartAt] = useState<number>();
  const { data } = useReportStreamTimestampQuery({ variables: { streamId } });

  useEffect(() => {
    if (data?.stream) {
      setStartAt(
        Math.max(
          0,
          Math.floor(
            (new Date().getTime() -
              new Date(data.stream.segments[0].startTime).getTime()) /
              1000,
          ),
        ),
      );
    }
  }, [data]);

  if (startAt === undefined) {
    return null;
  }

  return (
    <ReportDialog
      reportContext={{
        reportType: ReportType.Livestream,
        channelId,
        streamId,
        startAt,
        reportedUserId,
      }}
      onDismiss={onDismiss}
    />
  );
}
