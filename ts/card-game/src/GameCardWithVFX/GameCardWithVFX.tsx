import { useEffect, useRef } from 'react';

import { GameCard, GameCardProps } from '../GameCard';

import styles from './GameCardWithVFX.module.css';

export type Props = GameCardProps & {
  vfxWebmUrl: string;
};

export function GameCardWithVFX({ vfxWebmUrl, ...gameCardProps }: Props) {
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!video.current) {
      return;
    }

    video.current.src = vfxWebmUrl;
    video.current.currentTime = 0;
    video.current.play();
  }, [vfxWebmUrl]);

  return (
    <div className={styles.gameCardWithVfxWrapper}>
      <GameCard {...gameCardProps} />
      <div className={styles.gameCardWithVfxVideoWrapper}>
        <video
          className={styles.gameCardWithVfxVideo}
          ref={video}
          loop
          muted
        >
          <source type="video/webm"></source>
        </video>
      </div>
    </div>
  );
}
