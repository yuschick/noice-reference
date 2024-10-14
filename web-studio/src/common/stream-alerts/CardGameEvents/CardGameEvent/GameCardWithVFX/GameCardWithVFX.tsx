import { CardGameAssets } from '@noice-com/card-game';
import { WithChildren, VfxVideo } from '@noice-com/common-ui';
import classNames from 'classnames';
import { CSSProperties } from 'react';

import styles from './GameCardWithVFX.module.css';

export interface GameCardWithVFXProps {
  className?: string;
  duration: number;
  delay: number;
  appearType: 'fast' | 'slow';
  vfxVideos?: string[];
}
export function GameCardWithVFX({
  className,
  children,
  duration,
  delay,
  vfxVideos,
  appearType,
}: WithChildren<GameCardWithVFXProps>) {
  return (
    <div
      className={classNames(styles.wrapper, className)}
      style={
        {
          '--game-card-with-vfx-duration': `${duration}ms`,
          '--game-card-back-side-image-url': `url(${CardGameAssets.Images.CardBackSide})`,
        } as CSSProperties
      }
    >
      <div
        className={classNames(styles.content, {
          [styles.fastFront]: appearType === 'fast',
          [styles.slowFront]: appearType === 'slow',
        })}
      >
        {vfxVideos && (
          <div className={styles.videoWrapper}>
            <VfxVideo
              className={styles.video}
              delay={delay}
              src={vfxVideos}
              isPlaying
            />
          </div>
        )}
        {children}
      </div>
      <div className={styles.backside} />
    </div>
  );
}
