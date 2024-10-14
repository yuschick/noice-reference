import classNames from 'classnames';
import { CSSProperties } from 'react';

import styles from './CardHighlightBooster.module.css';

import boosterFailVfx from '@game-assets/vfx/booster-highlight-fail-vfx.webp';
import boosterSuccessVfx from '@game-assets/vfx/booster-highlight-success-vfx.webp';
import { Booster } from '@game-common/booster';
import { BoosterType } from '@game-types';

interface Props {
  className?: string;
  style?: CSSProperties;
  booster: {
    boosterId: BoosterType;
    points?: number;
  };
  duration: number;
  delay?: number;
}

export function CardHighlightBooster({
  className,
  style,
  booster,
  delay,
  duration,
}: Props) {
  const { boosterId, points } = booster;
  const hasSucceeded = !!points;

  return (
    <div
      className={classNames(styles.cardHighlightBoosterRoot, className)}
      style={
        {
          ...(style ?? {}),
          // This is the method which allows me to avoid using heavy sprite sheet tecnique but still maintaining playback control.
          // I am adding something to the url at the end so it always rerenders on new state.
          // This is because animated webp is done that it loops only once to avoid being repeated and therefore create visual glitch.
          // Without this it shows only once per page refresh
          '--booster-highlight-success-vfx-url': `url(${boosterSuccessVfx}?x=${Math.random()})`,
          '--booster-highlight-fail-vfx-url': `url(${boosterFailVfx}?x=${Math.random()})`,
          '--_booster-highlight-duration': `${duration}ms`,
          '--_booster-highlight-delay': `${delay ?? 0}ms`,
        } as CSSProperties
      }
    >
      <Booster
        boosterIconClassName={classNames(
          hasSucceeded ? styles.successIcon : styles.failIcon,
        )}
        boosterId={boosterId}
        className={classNames(
          styles.cardHighlightBooster,
          hasSucceeded ? styles.success : styles.fail,
        )}
        key={boosterId}
      />
    </div>
  );
}
