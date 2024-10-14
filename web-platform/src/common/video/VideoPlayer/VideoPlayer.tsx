import { VisuallyHidden } from '@noice-com/common-ui';
import classNames from 'classnames';
import { useState, useRef, ComponentProps } from 'react';

import { useVideoPlayer } from './hooks/useVideoPlayer.hook';
import { InitPlayButton } from './InitPlayButton/InitPlayButton';
import { PlaybackControls } from './PlaybackControls/PlaybackControls';
import { VideoControls } from './types';
import styles from './VideoPlayer.module.css';

export interface VideoPlayerProps
  extends Omit<ComponentProps<'video'>, 'ref' | 'onProgress'> {
  src: string;
  title?: string;
  volume: number;
  clickToPause?: boolean;
  disabledControls?: VideoControls[];
  className?: string;
  onProgress?(currentTime: number, duration: number): void;
  onPlay?(): void;
  onPause?(): void;
  onEnded?(): void;
}

export function VideoPlayer({
  src,
  title,
  volume,
  clickToPause,
  disabledControls,
  className,
  onProgress,
  onPlay,
  onPause,
  onEnded,
  ...props
}: VideoPlayerProps) {
  const [fullscreen, setFullScreen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const {
    video,
    paused,
    hasPlayed,
    canPlay,
    duration,
    currentTime,
    pauseVideo,
    playVideo,
    setVideoVolume,
    setVideoCurrentTime,
    currentVolume,
    toggleVideo,
  } = useVideoPlayer({
    volume,
    onPlay,
    onEnded,
    onPause,
    onProgress,
  });

  const setVideoFullscreen = (fullscreen: boolean) => {
    if (!wrapperRef.current) {
      return;
    }

    setFullScreen(fullscreen);

    if (fullscreen) {
      wrapperRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div
      className={classNames(styles.wrapper, className, {
        [styles.hasNotPlayed]: !hasPlayed,
      })}
      ref={wrapperRef}
    >
      <video
        className={styles.video}
        ref={video}
        src={src}
        {...props}
      />

      {canPlay && !hasPlayed && (
        <InitPlayButton
          className={classNames(styles.initPlayButton, {
            [styles.hasNotPlayed]: !hasPlayed,
          })}
          playVideo={playVideo}
        />
      )}

      {canPlay && (
        <div className={styles.overlayWrapper}>
          {clickToPause && (
            <button
              className={styles.toggleButton}
              onClick={toggleVideo}
            >
              <VisuallyHidden>{paused ? 'Play video' : 'Pause video'}</VisuallyHidden>
            </button>
          )}

          {!!title && <div className={styles.title}>{title}</div>}

          <PlaybackControls
            currentTime={currentTime}
            disabledControls={disabledControls}
            duration={duration}
            fullscreen={fullscreen}
            muted={currentVolume === 0}
            paused={paused}
            volume={currentVolume}
            onFullscreen={setVideoFullscreen}
            onPause={pauseVideo}
            onPlay={playVideo}
            onSeek={setVideoCurrentTime}
            onVolume={setVideoVolume}
          />
        </div>
      )}
    </div>
  );
}
