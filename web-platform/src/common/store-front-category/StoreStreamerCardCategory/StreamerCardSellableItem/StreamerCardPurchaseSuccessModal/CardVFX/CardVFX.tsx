import { VfxVideo, WithChildren } from '@noice-com/common-ui';
import classNames from 'classnames';
import { CSSProperties } from 'react';

import styles from './CardVFX.module.css';

import cardBacksideImage from '@assets/images/card-backside.webp';
import cardVfxMp4 from '@assets/vfx/creator-card-purchase-vfx.mp4';
import cardVfxWebm from '@assets/vfx/creator-card-purchase-vfx.webm';

export interface GameVFXProps {
  className?: string;
}

const cardVfxVideos = [cardVfxWebm, cardVfxMp4];
export function CardVFX({ className, children }: WithChildren<GameVFXProps>) {
  return (
    <div className={classNames(styles.wrapper, className)}>
      <div className={styles.highlightContainer}>
        <div className={styles.highlight}></div>
      </div>
      <div className={styles.cardItem}>{children}</div>
      <div
        className={styles.cardBackside}
        style={
          {
            '--game-card-backside-image': `url(${cardBacksideImage})`,
          } as CSSProperties
        }
      ></div>
      <div className={styles.videoWrapper}>
        <VfxVideo
          className={styles.video}
          delay={160}
          src={cardVfxVideos}
          isPlaying
        />
        <div className={styles.backGlow}></div>
      </div>
    </div>
  );
}
