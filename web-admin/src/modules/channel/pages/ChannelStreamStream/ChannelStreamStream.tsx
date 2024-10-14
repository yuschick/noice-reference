import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import { Anchor } from '@noice-com/common-ui';
import { DateAndTimeUtils } from '@noice-com/utils';
import { useParams } from 'react-router';
import { useSearchParams } from 'react-router-dom';

import { StreamWithClipping } from './StreamWithClipping';

import { TextField } from '@common/input';
import { ContentModulePage } from '@common/page-components';
import { useChannelStreamsStreamQuery } from '@gen';

gql`
  query ChannelStreamsStream($streamId: ID!) {
    stream(id: $streamId) {
      streamId
      matureRatedContent
      segments {
        startTime
        endTime
        gameId
        title
      }
    }
  }
`;

const getOffset = (searchParams: URLSearchParams) => {
  if (!searchParams.has('offset')) {
    return 0;
  }

  return parseInt(searchParams.get('offset') ?? '0', 10);
};

export function ChannelStreamStream() {
  const { channelId, streamId } = useParams();
  const [searchParams] = useSearchParams();

  const { data } = useChannelStreamsStreamQuery({
    ...variablesOrSkip({ streamId }),
  });

  if (!streamId || !channelId || !data) {
    return null;
  }

  const duration = data?.stream?.segments.map((segment) =>
    DateAndTimeUtils.getTimeDifferenceInSeconds({
      end: segment.endTime || new Date().toString(),
      start: segment.startTime,
    }),
  )[0];
  const envAbbreviation =
    process.env.NODE_ENV === 'production'
      ? 'prd'
      : process.env.NODE_ENV === 'development'
      ? 'dev'
      : 'stg';

  const recordingGCSLink = `https://console.cloud.google.com/storage/browser/noice-${envAbbreviation}-europe-west4-0-stream-storage/stream-${channelId}/${streamId};tab=objects?project=noice-${envAbbreviation}&prefix=&forceOnObjectsSortingFiltering=false`;
  const recordingGSUtilCmd = `gsutil -m cp -r gs://noice-${envAbbreviation}-europe-west4-0-stream-storage/stream-${channelId}/${streamId}/ .`;

  return (
    <ContentModulePage key={streamId}>
      <ContentModulePage.Content title="Stream">
        <StreamWithClipping
          channelId={channelId}
          offset={getOffset(searchParams)}
          streamId={streamId}
        />
      </ContentModulePage.Content>

      <ContentModulePage.Content title="Stream data">
        <TextField
          defaultValue={data?.stream?.streamId}
          label="Stream id"
          readOnly
        />

        <TextField
          defaultValue={data?.stream?.segments
            .map(
              (segment) =>
                `${DateAndTimeUtils.getShortDate(segment.startTime, {
                  showInUTC: true,
                })} ${DateAndTimeUtils.getTime(segment.startTime, { showInUTC: true })}`,
            )
            .join(', ')}
          label="Start time (UTC)"
          readOnly
        />

        <TextField
          defaultValue={data?.stream?.segments
            .map((segment) =>
              segment.endTime
                ? `${DateAndTimeUtils.getShortDate(segment.endTime, {
                    showInUTC: true,
                  })} ${DateAndTimeUtils.getTime(segment.endTime, { showInUTC: true })}`
                : 'Live',
            )
            .join(', ')}
          label="End time (UTC)"
          readOnly
        />

        <TextField
          defaultValue={data?.stream?.segments
            .map((segment) => segment.gameId)
            .join(', ')}
          label="Game id(s)"
          readOnly
        />

        <TextField
          defaultValue={data?.stream?.segments.map((segment) => segment.title).join(', ')}
          label="Title(s)"
          readOnly
        />

        <TextField
          defaultValue={data?.stream?.matureRatedContent ? 'Yes' : 'No'}
          label="Mature rated content"
          readOnly
        />
      </ContentModulePage.Content>

      <ContentModulePage.Content title="Download stream commands">
        <TextField
          defaultValue={`/get-replay ${channelId} ${streamId}`}
          label="Slack"
          readOnly
        />

        <TextField
          defaultValue={`gsutil -m cp -r "gs://noice-${envAbbreviation}-europe-west4-0-hls-storage/${channelId}/${streamId}/hls" .; pushd hls; echo "#EXT-X-ENDLIST " >> main.m3u8;  ffmpeg -probesize 50M -analyzeduration 100M -ss 00:00:00.00 -t ${duration} -i main.m3u8 -c copy ../dump.mp4; popd; rm -rf hls`}
          label="Local (FFmpeg)"
          readOnly
        />

        <TextField
          defaultValue={recordingGSUtilCmd}
          label="Raw recording gsutil copy command"
          readOnly
        />

        <Anchor
          href={recordingGCSLink}
          rel="noopener noreferrer"
          target="_blank"
        >
          Raw recording in GCS bucket
        </Anchor>
      </ContentModulePage.Content>
    </ContentModulePage>
  );
}
