import { Countdown } from '@noice-com/common-ui';
import { useEffect, useState } from 'react';

import { OverlayView } from '../../types';

import styles from './HighScoringCardOverlay.module.css';

export interface HighScoringCardOverlayProps {
  view: OverlayView;
  countDownDuration: number;
  onCountdownCompleted?(): void;
}

const getCountdownTarget = (duration: number): Date => new Date(Date.now() + duration);

export function HighScoringCardOverlay({
  view,
  countDownDuration,
  onCountdownCompleted,
}: HighScoringCardOverlayProps) {
  const [countdownTarget, setCountdownTarget] = useState<Date>(
    getCountdownTarget(countDownDuration),
  );

  useEffect(() => {
    setCountdownTarget(getCountdownTarget(countDownDuration));
  }, [countDownDuration]);

  return (
    <div className={styles.overlayWrapper}>
      {view === 'countdown' && (
        <div className={styles.countdownWrapper}>
          <span className={styles.brightLabel}>Shown to everyone in</span>
          <Countdown
            className={styles.currentProgressLabel}
            secondsSuffix=""
            target={countdownTarget}
            onCompleted={onCountdownCompleted}
          />
        </div>
      )}
    </div>
  );
}
