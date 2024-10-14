import classNames from 'classnames';
import { CSSProperties } from 'react';

import styles from './Countdown.module.css';

interface Props {
  durationSeconds: number;
  enabled: boolean;
}

export function Countdown({ durationSeconds, enabled }: Props) {
  return (
    <div
      className={styles.countdown}
      style={
        {
          '--countdown-total-duration': `${durationSeconds * 1000}ms`,
          '--countdown-segment-duration': `${(durationSeconds * 1000) / 4}ms`,
        } as CSSProperties
      }
    >
      <div className={styles.countdownSegments}>
        <div
          className={classNames(styles.countdownSegment, styles.countdownSegmentTopLeft, {
            [styles.enabled]: enabled,
          })}
        />
        <div
          className={classNames(
            styles.countdownSegment,
            styles.countdownSegmentTopRight,
            {
              [styles.enabled]: enabled,
            },
          )}
        />
        <div
          className={classNames(
            styles.countdownSegment,
            styles.countdownSegmentBottomLeft,
            {
              [styles.enabled]: enabled,
            },
          )}
        />
        <div
          className={classNames(
            styles.countdownSegment,
            styles.countdownSegmentBottomRight,
            {
              [styles.enabled]: enabled,
            },
          )}
        />
      </div>
    </div>
  );
}
