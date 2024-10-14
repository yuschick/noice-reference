import { gql } from '@apollo/client';
import { DateAndTimeUtils } from '@noice-com/utils';
import { useParams } from 'react-router';

import styles from './ChannelStreams.module.css';

import { PaginatedQueryTableModulePage } from '@common/page-components';
import { PermissionLink } from '@common/permission';
import { Pill } from '@common/text';
import {
  ChannelStreamsQuery,
  ChannelStreamsQueryVariables,
  useChannelStreamsQuery,
} from '@gen';

gql`
  query ChannelStreams($channelId: ID!, $cursor: APICursorInput) {
    streams(channelId: $channelId, cursor: $cursor) {
      streams {
        channelId
        streamId
        segments {
          startTime
          endTime
          gameId
        }
      }
      pageInfo {
        endCursor
        hasNextPage
        startCursor
        hasPreviousPage
      }
    }
  }
`;

export function ChannelStreams() {
  const { channelId } = useParams();
  const dataTransform = (data: ChannelStreamsQuery) => {
    return (
      data?.streams?.streams.map((stream) => {
        return ((stream) => ({
          streamId: (
            <PermissionLink to={stream.streamId}>{stream.streamId}</PermissionLink>
          ),
          'startTime (UTC)': `${DateAndTimeUtils.getShortDate(
            stream.segments[0].startTime,
            { showInUTC: true },
          )} ${DateAndTimeUtils.getTime(stream.segments[0].startTime, {
            showInUTC: true,
          })}`,
          'endTime (UTC)': stream.segments[0]?.endTime ? (
            `${DateAndTimeUtils.getShortDate(stream.segments[0].endTime, {
              showInUTC: true,
            })} ${DateAndTimeUtils.getTime(stream.segments[0].endTime, {
              showInUTC: true,
            })}`
          ) : (
            <Pill
              size="small"
              text="Live"
              type="positive"
            />
          ),
          sessionLength:
            stream.segments[0].endTime && stream.segments[0].startTime
              ? DateAndTimeUtils.getDateTimeDifference({
                  end: stream.segments[0].endTime,
                  start: stream.segments[0].startTime,
                })
              : '',
          category: (
            <span className={styles.capitalize}>{stream.segments[0].gameId}</span>
          ),
        }))(stream);
      }) ?? []
    );
  };

  const getPageInfo = (data: ChannelStreamsQuery) => data.streams?.pageInfo ?? null;

  return (
    <PaginatedQueryTableModulePage<ChannelStreamsQuery, ChannelStreamsQueryVariables>
      caption="Streams"
      dataTransform={dataTransform}
      getPageInfo={getPageInfo}
      hook={useChannelStreamsQuery}
      idField="streamId"
      minifyCells={['startTime', 'endTime', 'sessionLength', 'noicePredictions']}
      skip={!channelId}
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      variables={{ channelId: channelId! }}
      includeIdField
    />
  );
}
