import { useResetAnimation } from '@noice-com/common-ui';
import classNames from 'classnames';
import { CSSProperties, useEffect, useRef, useState } from 'react';

import styles from './AnimatedBoosterScore.module.css';

import bonusScoreVfx from '@game-assets/vfx/animated-score-bonus-vfx.webp';
import { Booster } from '@game-common/booster/Booster';
import { BoosterType } from '@game-types';

export interface Props {
  className?: string;
  duration: number;
  delay: number;
  booster: {
    boosterId: BoosterType;
    points?: number;
  };
}

export function AnimatedBoosterScore({ className, booster, duration, delay }: Props) {
  const [showBooster, setShowBooster] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useResetAnimation({ ref, triggerDependencies: [showBooster] });

  useEffect(() => {
    // We don't show score for failed boosters
    if (!booster.points) {
      return;
    }

    const timeout = setTimeout(() => {
      setShowBooster(true);
    }, delay ?? 0);

    return () => {
      clearTimeout(timeout);
    };
  }, [delay, duration, booster]);

  if (!showBooster) {
    return null;
  }

  return (
    <div
      className={classNames(styles.animatedBoosterScore, className)}
      ref={ref}
      style={
        {
          '--_booster-score-duration': `${duration}ms`,
          '--_booster-bonus-score-vfx-url': `url(${bonusScoreVfx}?x=${Math.random()})`,
        } as CSSProperties
      }
    >
      <Booster
        boosterId={booster.boosterId}
        className={styles.animatedBoosterScoreIcon}
      />
      <span className={styles.animatedBoosterScoreText}>+{booster.points}</span>
    </div>
  );
}
