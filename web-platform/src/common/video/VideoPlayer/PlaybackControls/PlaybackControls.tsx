import { useCallback } from 'react';

import { CurrentTime } from '../CurrentTime/CurrentTime';
import { FullscreenButton } from '../FullscreenButton/FullscreenButton';
import { MuteButton } from '../MuteButton/MuteButton';
import { PlayButton } from '../PlayButton/PlayButton';
import { Slider } from '../Slider/Slider';
import { VideoControls } from '../types';

import styles from './PlaybackControls.module.css';

export interface PlaybackControlsInterface {
  disabledControls?: VideoControls[];
  currentTime: number;
  duration: number;
  volume: number;
  paused: boolean;
  muted: boolean;
  fullscreen: boolean;
  onPlay?(): void;
  onPause?(): void;
  onSeek?(currentTime: number): void;
  onVolume?(volume: number): void;
  onFullscreen?(fullscreen: boolean): void;
}

export function PlaybackControls({
  disabledControls,
  currentTime,
  duration,
  volume,
  paused,
  muted,
  fullscreen,
  onPlay,
  onPause,
  onSeek,
  onVolume,
  onFullscreen,
}: PlaybackControlsInterface) {
  const onPlayButtonClick = useCallback(
    (paused: boolean) => {
      if (paused) {
        onPause?.();
        return;
      }

      onPlay?.();
    },
    [onPause, onPlay],
  );

  const onMuteClick = useCallback(
    (muted: boolean, volume: number) => {
      onVolume?.(muted ? 0 : volume);
    },
    [onVolume],
  );

  return (
    <div className={styles.wrapper}>
      {!disabledControls?.includes('seek') && (
        <Slider
          color="red"
          label="Change current position"
          max={duration}
          min={0}
          value={currentTime}
          onChange={onSeek}
        />
      )}

      <div className={styles.bottomRow}>
        <div className={styles.basicControls}>
          {!disabledControls?.includes('play') && (
            <PlayButton
              paused={paused}
              onClick={onPlayButtonClick}
            />
          )}

          {!disabledControls?.includes('mute') && (
            <MuteButton
              muted={muted}
              volume={volume}
              onClick={onMuteClick}
            />
          )}

          {!disabledControls?.includes('volume') && (
            <Slider
              className={styles.volumeBar}
              color="white"
              label="Change volume"
              max={1}
              min={0}
              value={volume}
              onChange={onVolume}
            />
          )}

          {!disabledControls?.includes('time') && (
            <CurrentTime
              currentTime={currentTime}
              duration={duration}
            />
          )}
        </div>

        {!disabledControls?.includes('fullscreen') && (
          <FullscreenButton
            fullscreen={fullscreen}
            onClick={onFullscreen}
          />
        )}
      </div>
    </div>
  );
}
