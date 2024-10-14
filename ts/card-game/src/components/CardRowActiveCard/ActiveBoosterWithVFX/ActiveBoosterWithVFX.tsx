import { AnimatedPngPlayer } from '@noice-com/common-ui';
import classNames from 'classnames';
import { useEffect } from 'react';

import styles from './ActiveBoosterWithVFX.module.css';

import BoosterIconAppliedSpriteSheet from '@game-assets/vfx/booster-icon-apply-vfx.png';
import { Booster } from '@game-common/booster';
import { BoosterProps } from '@game-common/booster/Booster';

interface Props extends BoosterProps {
  showVfx?: boolean;
  onVfxCompleted?: () => void;
}

const VFX_DURATION = 1800;

export function ActiveBoosterWithVFX({
  showVfx,
  className,
  boosterIconClassName,
  onVfxCompleted,
  ...restOfBoosterProps
}: Props) {
  // We want to be sure that we call the VFX done even if this is unmounted.
  // IMHO shouldn't been part of CssSprite so having it here.
  useEffect(() => {
    if (!showVfx || !onVfxCompleted) {
      return;
    }

    setTimeout(onVfxCompleted, VFX_DURATION);
  }, [showVfx, onVfxCompleted]);

  return (
    <div
      className={classNames(styles.activeBoostersPreviewBoosterRoot, {
        [styles.showVfx]: showVfx,
      })}
    >
      <Booster
        boosterIconClassName={classNames(
          styles.activeBoostersPreviewBoosterIcon,
          boosterIconClassName,
        )}
        className={classNames(styles.activeBoostersPreviewBooster, className)}
        {...restOfBoosterProps}
      />
      {showVfx && (
        <div className={classNames(styles.activeBoostersPreviewBoosterVfxWrapper)}>
          <AnimatedPngPlayer
            animationCount={1}
            delay={100}
            duration={VFX_DURATION}
            src={BoosterIconAppliedSpriteSheet}
            onCompleted={onVfxCompleted}
          />
        </div>
      )}
    </div>
  );
}
