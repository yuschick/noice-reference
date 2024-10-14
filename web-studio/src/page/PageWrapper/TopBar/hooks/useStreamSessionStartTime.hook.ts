import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import { useTimeDuration } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import { useEffect, useState } from 'react';

import { Status } from '@common/status';
import { useTopBarStreamQuery } from '@gen';

gql`
  query TopBarStream($id: ID!) {
    stream(id: $id) {
      streamId
      segments {
        startTime
        segmentId
      }
    }
  }
`;

interface Props {
  matchStatus: Status;
  streamId: Nullable<string>;
}

export function useStreamSessionStartTime({ streamId, matchStatus }: Props) {
  const [startTime, setStartTime] = useState<Nullable<number>>(null);
  const { days, hours, minutes, seconds, reset, stop, isRunning } = useTimeDuration({
    autoStart: false,
  });

  useTopBarStreamQuery({
    ...variablesOrSkip({ id: streamId }),
    onCompleted(data) {
      if (!data.stream?.segments.length) {
        return;
      }

      setStartTime(new Date(data.stream.segments[0].startTime).getTime());
    },
  });

  useEffect(() => {
    // Reset time when status is not offline and there is start time
    if (matchStatus !== Status.Offline && startTime) {
      reset(startTime);
      return;
    }

    // Stop the timer when the status is offline or there is no start time
    stop();
  }, [reset, startTime, stop, matchStatus]);

  return { days, hours, minutes, seconds, isRunning };
}
