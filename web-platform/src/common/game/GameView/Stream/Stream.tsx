import { gql } from '@apollo/client';
import { StreamPlacement } from '@noice-com/schemas/stream/egress.pb';
import { StreamError } from '@noice-com/stream';
// We need to import this directly because of threejs related importing issue
// eslint-disable-next-line no-restricted-imports
import { Stream as StreamComponent } from '@noice-com/stream/src/components/Stream/Stream';
import { Nullable } from '@noice-com/utils';
import { useCallback } from 'react';

import { GameDisabledStream } from './GameDisabledStream';
import styles from './Stream.module.css';
import { TheaterModeStream } from './TheaterModeStream';

import { useStreamComponentDataQuery } from '@gen';

interface StreamProps {
  groupId: Nullable<string>;
  streamId: string;
  isMinimizedStream?: boolean;
  isTheaterMode?: boolean;
  placement: StreamPlacement;
  onTooManyViewersErrorCallback?(): void;
}

gql`
  query StreamComponentData($id: ID!) {
    streamSummary(id: $id) {
      serverRenderingEnabled
    }
  }
`;

export function Stream({
  streamId,
  groupId,
  isMinimizedStream,
  isTheaterMode,
  onTooManyViewersErrorCallback,
  placement,
}: StreamProps) {
  const onErrorCallback = useCallback(
    (error: StreamError) => {
      if (error === StreamError.TooManyViewers) {
        onTooManyViewersErrorCallback?.();
      }
    },
    [onTooManyViewersErrorCallback],
  );

  const { loading, data } = useStreamComponentDataQuery({
    variables: {
      id: streamId,
    },
    skip: !streamId,
    defaultOptions: {
      fetchPolicy: 'cache-only',
    },
  });

  const crStreamAvailable = !!data?.streamSummary?.serverRenderingEnabled;

  if (loading) {
    return null;
  }

  if (!groupId) {
    return (
      <GameDisabledStream
        placement={placement}
        streamId={streamId}
        onErrorCallback={onErrorCallback}
      />
    );
  }

  if (isTheaterMode) {
    return (
      <TheaterModeStream
        groupId={groupId}
        isMinimizedStream={isMinimizedStream}
        placement={placement}
        streamId={streamId}
        onErrorCallback={onErrorCallback}
      />
    );
  }

  return (
    <StreamComponent
      className={styles.gameStreamWrapper}
      crStreamAvailable={crStreamAvailable}
      groupId={groupId}
      hideSpotlights={isMinimizedStream}
      placement={placement}
      streamId={streamId}
      onErrorCallback={onErrorCallback}
    />
  );
}
