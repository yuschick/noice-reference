import { WithChildren, VfxVideo } from '@noice-com/common-ui';
import classNames from 'classnames';
import { CSSProperties } from 'react';

import styles from './GameCardWithVFX.module.css';
import { VFXCardAnimationState } from './types';

import cardBackSideImage from '@game-assets/images/card-back-side.png';
import highscoreVfxMp4 from '@game-assets/vfx/promoted-highscore-mp4.mp4';
import highscoreVfxWebm from '@game-assets/vfx/promoted-highscore-vfx.webm';

export interface GameCardWithVFXProps {
  className?: string;
  animation: VFXCardAnimationState;
  duration: number;
}

const highscoreVfxVideos = [highscoreVfxMp4, highscoreVfxWebm];
export function GameCardWithVFX({
  className,
  children,
  animation,
  duration,
}: WithChildren<GameCardWithVFXProps>) {
  const showEffects =
    animation === VFXCardAnimationState.PersonalBest ||
    animation === VFXCardAnimationState.Success;

  return (
    <div
      className={classNames(styles.wrapper, className, {
        [styles.success]: animation === VFXCardAnimationState.Success,
        [styles.failure]: animation === VFXCardAnimationState.Failure,
        [styles.personalBest]: animation === VFXCardAnimationState.PersonalBest,
      })}
      style={
        {
          '--game-card-with-vfx-duration': `${duration}ms`,
          '--game-card-back-side-image-url': `url(${cardBackSideImage})`,
        } as CSSProperties
      }
    >
      <div className={styles.content}>
        {showEffects && (
          <div className={styles.videoWrapper}>
            <VfxVideo
              className={styles.video}
              delay={550}
              src={highscoreVfxVideos}
              isPlaying
            />
          </div>
        )}
        {children}
        {showEffects && (
          <div className={styles.highlightContainer}>
            <div className={styles.highlight} />
          </div>
        )}
      </div>
      <div className={styles.backside}></div>
    </div>
  );
}
