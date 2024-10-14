import { gql } from '@apollo/client';
import { useMountEffect } from '@noice-com/common-react-core';
import { useEffect, useState } from 'react';

import { useChannelContext } from '@common/channel';
import { useStreamContext } from '@common/stream';
import { ChannelLiveStatus, useLatestStreamDataLazyQuery } from '@gen';

gql`
  query LatestStreamData($channelId: ID!) {
    streams(channelId: $channelId, cursor: { first: 1 }) {
      streams {
        streamId
        segments {
          segmentId
          startTime
        }
      }
    }
  }
`;

export const useLatestStreamReportStream = () => {
  const [streamId, setStreamId] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);
  const { streamStatus, streamId: currentStreamId } = useStreamContext();
  const { channelId } = useChannelContext();
  const [getLatestStreamData] = useLatestStreamDataLazyQuery({
    variables: { channelId },
  });

  useMountEffect(() => {
    if (streamStatus === ChannelLiveStatus.LiveStatusLive) {
      return;
    }

    getLatestStreamData({
      onCompleted(data) {
        const streamSegments = data.streams?.streams[0]?.segments;
        const latestStreamStartTime = streamSegments?.[0].startTime;
        const latestStream = data.streams?.streams[0].streamId;
        const date = new Date();
        date.setDate(date.getDate() - 2);

        if (
          latestStreamStartTime &&
          new Date(latestStreamStartTime) >= date &&
          latestStream
        ) {
          // latest stream analytics is available if the start time of the latest stream is less than 2 days ago (in UTC).
          setStreamId(latestStream);
        }

        setIsLoading(false);
      },
    });
  });

  useEffect(() => {
    if (streamStatus === ChannelLiveStatus.LiveStatusLive && currentStreamId) {
      // latest stream report becomes available as soon as stream is live
      setStreamId(currentStreamId);
      setIsLoading(false);
      return;
    }
  }, [currentStreamId, streamStatus]);

  return {
    loading: isLoading,
    streamId,
  };
};
