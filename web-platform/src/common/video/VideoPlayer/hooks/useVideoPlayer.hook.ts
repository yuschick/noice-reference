import { RefObject, useCallback, useEffect, useRef, useState } from 'react';

interface HookResult {
  video: RefObject<HTMLVideoElement>;
  paused: boolean;
  hasPlayed: boolean;
  canPlay: boolean;
  currentTime: number;
  duration: number;
  currentVolume: number;
  pauseVideo(): void;
  playVideo(): void;
  setVideoVolume(volume: number): void;
  setVideoCurrentTime(currentTime: number): void;
  toggleVideo(): void;
}

interface Props {
  volume: number;
  onPlay?(): void;
  onPause?(): void;
  onEnded?(): void;
  onProgress?(currentTime: number, duration: number): void;
}

export function useVideoPlayer({
  volume,
  onPlay,
  onPause,
  onEnded,
  onProgress,
}: Props): HookResult {
  const [paused, setPaused] = useState(true);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [canPlay, setCanPlay] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentVolume, setCurrentVolume] = useState(volume);

  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!video.current) {
      return;
    }

    video.current.onloadedmetadata = () => {
      if (!video.current) {
        return;
      }

      const videoAspectRatio = video.current.videoWidth / video.current.videoHeight;

      // Do nothing when it is the default
      if (videoAspectRatio === 16 / 9) {
        return;
      }

      // Set correct aspect ratio
      video.current.style.setProperty(
        '--video-player-aspect-ratio',
        `${videoAspectRatio}`,
      );
    };

    video.current.onplay = () => {
      setPaused(false);
      setHasPlayed(true);
      onPlay?.();
    };

    video.current.onpause = () => {
      setPaused(true);
      onPause?.();
    };

    video.current.oncanplay = () => {
      setCanPlay(true);
    };

    video.current.onloadstart = () => {
      if (!video.current) {
        return;
      }

      video.current.volume = volume;
    };

    video.current.onloadeddata = (event: Event) => {
      const target = event.target as HTMLVideoElement;
      setDuration(target.duration);
    };

    video.current.onended = () => {
      setHasPlayed(false);
      onEnded?.();
    };

    video.current.ontimeupdate = (event: Event) => {
      const target = event.target as HTMLVideoElement;
      setCurrentTime(target.currentTime);
      setDuration(target.duration);
      onProgress?.(target.currentTime, target.duration);
    };
  }, [onEnded, onPause, onPlay, onProgress, volume]);

  const pauseVideo = () => {
    video.current?.pause();
  };

  const playVideo = () => {
    video.current?.play();
  };

  const toggleVideo = useCallback(() => {
    if (!video.current) {
      return;
    }

    if (paused) {
      video.current.play();
      return;
    }

    video.current.pause();
  }, [paused]);

  const setVideoVolume = (volume: number) => {
    if (!video.current) {
      return;
    }

    video.current.volume = volume;
    setCurrentVolume(volume);
  };

  const setVideoCurrentTime = (currentTime: number) => {
    if (!video.current) {
      return;
    }

    video.current.currentTime = currentTime;
  };

  return {
    video,
    paused,
    hasPlayed,
    canPlay,
    duration,
    currentTime,
    currentVolume,
    pauseVideo,
    playVideo,
    setVideoVolume,
    setVideoCurrentTime,
    toggleVideo,
  };
}
