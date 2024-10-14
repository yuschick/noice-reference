import { useEffect, useState } from 'react';

const VIDEO_START_TIMEOUT = 1500;

interface Props {
  isStreamerCard: boolean;
  isHovering: boolean;
}

export const useStreamerCardVideo = ({ isStreamerCard, isHovering }: Props) => {
  const [playVideo, setPlayVideo] = useState(false);

  useEffect(() => {
    // If no streamer card, do nothing
    if (!isStreamerCard) {
      return;
    }

    // Pause video & prevent video playing after mouse leave
    if (!isHovering) {
      setPlayVideo(false);
      return;
    }

    const timeout = window.setTimeout(() => {
      setPlayVideo(true);
    }, VIDEO_START_TIMEOUT);

    return () => {
      clearTimeout(timeout);
    };
  }, [isHovering, isStreamerCard]);

  return playVideo;
};
