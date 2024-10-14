import { useMountEffect } from '@noice-com/common-react-core';
import { Button, LoadingSpinner, useKeyContentLoadTracker } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import classNames from 'classnames';
import { ImVolumeMute2, ImPlay3 } from 'react-icons/im';

import { useMediaStream } from './hooks';
import styles from './MediaStreamVideo.module.css';

interface Props {
  stream: Nullable<MediaStream>;
  isMuted?: boolean;
  className?: string;
  videoClassName?: string;
  egressType?: string;
  livepeerUrl?: string;
  signalFirstFrame: () => Promise<void>;
  onVideoClick?: (videoElement: Nullable<HTMLVideoElement>) => void;
  onPlayerInit?: (videoElement: Nullable<HTMLVideoElement>) => void;
}

export function MediaStreamVideo({
  stream,
  isMuted,
  className: wrapperClassName,
  videoClassName,
  egressType,
  livepeerUrl,
  signalFirstFrame,
  onVideoClick,
  onPlayerInit,
}: Props) {
  const {
    videoElementRef,
    needsInteractionToUnmute,
    videoPlayFailed,
    loading,
    play,
    unmute,
  } = useMediaStream({
    stream,
    isMutedStream: !!isMuted,
    egressType,
    livepeerUrl,
    signalFirstFrame,
  });

  useKeyContentLoadTracker('media_stream', loading);

  useMountEffect(() => {
    onPlayerInit?.(videoElementRef.current);
  });

  return (
    <div className={classNames(styles.videoWrapper, wrapperClassName)}>
      <video
        className={classNames(styles.video, videoClassName)}
        ref={videoElementRef}
        // eslint-disable-next-line react/no-unknown-property
        webkit-playsinline="true"
        playsInline
        onClick={() => {
          onVideoClick?.(videoElementRef.current);
        }}
      />
      {loading && (
        <div className={styles.loadingWrapper}>
          <LoadingSpinner />
        </div>
      )}
      {videoPlayFailed ? (
        <div className={styles.streamActionButton}>
          <Button
            iconStart={ImPlay3}
            level="secondary"
            size="sm"
            onClick={() => play()}
          >
            Play stream
          </Button>
        </div>
      ) : needsInteractionToUnmute ? (
        <div className={styles.streamActionButton}>
          <Button
            iconStart={ImVolumeMute2}
            level="secondary"
            size="sm"
            onClick={unmute}
          >
            Unmute
          </Button>
        </div>
      ) : null}
    </div>
  );
}
