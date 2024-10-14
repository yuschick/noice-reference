import { useAnimatedNumber } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import { useEffect, useState } from 'react';

import styles from './GenericTimerTooltipContent.module.css';

import { GameTimer } from '@game-logic/timer';

interface Props {
  tooltip: string;
  timer: Nullable<GameTimer>;
  isTimerPaused?: boolean;
  isReady?: boolean;
  timerTooltip?: string;
}

export function GenericTimerTooltipContent({
  isReady,
  timer,
  isTimerPaused,
  timerTooltip,
  tooltip,
}: Props) {
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!timer || isTimerPaused) {
      return;
    }

    setDuration(timer.timeLeft);
  }, [timer, isTimerPaused]);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    setDuration(0);
  }, [isReady]);

  const timerStart = duration > 0 ? Math.floor(duration / 1000) : 0;

  const { value: timeLeft, isAnimating } = useAnimatedNumber({
    initialValue: timerStart,
    target: 0,
    duration: duration ?? 0,
    suffix: ' sec',
    isPaused: isTimerPaused,
  });

  return (
    <div className={styles.tooltipContent}>
      {isAnimating ? (
        <>
          {timerTooltip}
          <br />
          <span className={styles.timer}>{timeLeft}</span>
        </>
      ) : (
        tooltip
      )}
    </div>
  );
}
