import { ReactEventHandler, useEffect, useState } from 'react';

import { Props } from '../types';

interface HookResult {
  playVideo: boolean;
  onEnded: ReactEventHandler<HTMLVideoElement>;
}

type HookProps = Pick<Props, 'delay' | 'isPlaying' | 'onEnded'>;

export function usePlayVfxVideo({ delay, isPlaying, onEnded }: HookProps): HookResult {
  const [playVideo, setPlayVideo] = useState(false);

  useEffect(() => {
    if (!isPlaying) {
      setPlayVideo(false);
      return;
    }

    if (!delay) {
      setPlayVideo(true);
      return;
    }

    const timeout = setTimeout(() => {
      setPlayVideo(true);
    }, delay);

    return () => {
      clearTimeout(timeout);
    };
  }, [isPlaying, delay]);

  const onEndedFunc: ReactEventHandler<HTMLVideoElement> = (event) => {
    setPlayVideo(false);
    onEnded?.(event);
  };

  return {
    playVideo,
    onEnded: onEndedFunc,
  };
}
