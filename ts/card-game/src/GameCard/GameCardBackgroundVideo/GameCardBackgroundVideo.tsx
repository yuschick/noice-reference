import { gql } from '@apollo/client';
import { useAnalytics } from '@noice-com/common-ui';
import { useEffect, useRef } from 'react';

import styles from './GameCardBackgroundVideo.module.css';

import { GameCardBackgroundVideoStreamerCardFragment } from '@game-gen';

interface Props {
  className?: string;
  playVideoInline?: boolean;
  streamerCard: GameCardBackgroundVideoStreamerCardFragment;
}

export function GameCardBackgroundVideo({
  className,
  streamerCard,
  playVideoInline,
}: Props) {
  const { video } = streamerCard;
  const { trackEvent } = useAnalytics();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const currentVideo = videoRef.current;
    if (!currentVideo) {
      return;
    }

    const onPlay = () => {
      trackEvent({
        clientStreamerCardVideoHoverPlayStarted: {
          channelId: streamerCard.channel.id,
          cardId: streamerCard.id,
        },
      });
    };

    const onEnd = () => {
      trackEvent({
        clientStreamerCardVideoModalPlayEnded: {
          channelId: streamerCard.channel.id,
          cardId: streamerCard.id,
        },
      });
      // Loop video. Cant use loop attribute because it doesnt fire ended event
      currentVideo.play();
    };

    currentVideo.addEventListener('play', onPlay);
    currentVideo.addEventListener('ended', onEnd);

    return () => {
      currentVideo.removeEventListener('play', onPlay);
      currentVideo.removeEventListener('ended', onEnd);
    };
  }, [streamerCard, trackEvent]);

  return (
    <div className={className}>
      <video
        className={styles.gameCardBgVideo}
        playsInline={playVideoInline}
        ref={videoRef}
        src={video}
        autoPlay
        muted
      />
    </div>
  );
}

GameCardBackgroundVideo.fragments = {
  streamerCard: gql`
    fragment GameCardBackgroundVideoStreamerCard on GameLogicStreamerCard {
      id
      video
      channel {
        id
      }
    }
  `,
};
