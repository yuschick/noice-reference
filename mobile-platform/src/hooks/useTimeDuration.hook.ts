/** Copied from common-ui */
import { useCallback, useState } from 'react';

import { useInterval } from './useInterval.hook';

interface UseStopwatchProps {
  autoStart?: boolean;
  offsetMilliseconds?: number;
}

export function getTimeFromSeconds(secs: number) {
  const totalSeconds = Math.ceil(secs);
  const days = Math.floor(totalSeconds / (60 * 60 * 24));
  const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  return {
    seconds,
    minutes,
    hours,
    days,
  };
}

export function getSecondsFromStart(start: number, shouldRound: boolean) {
  const now = new Date().getTime();
  const milliSecondsDistance = now - start;
  const val = milliSecondsDistance / 1000;

  return shouldRound ? Math.round(val) : val;
}

/**
 * This is a fixed and stripped down version of https://github.com/amrlabib/react-timer-hook
 *
 * @param autoStart when created or not
 * @param offsetMilliseconds the start time
 */
export function useTimeDuration({ autoStart, offsetMilliseconds }: UseStopwatchProps) {
  const [startTime, setStartTime] = useState<number>(
    offsetMilliseconds ? Math.floor(offsetMilliseconds / 1000) : new Date().getTime(),
  );
  const [passedSeconds, setPassedSeconds] = useState<number>(
    offsetMilliseconds ? getSecondsFromStart(offsetMilliseconds, true) : 0,
  );
  const [isRunning, setIsRunning] = useState(autoStart);

  useInterval(
    () => {
      setPassedSeconds(getSecondsFromStart(startTime, true));
    },
    isRunning ? 1000 : null,
  );

  const start = useCallback(() => {
    setIsRunning(true);
    setPassedSeconds(0);
  }, []);

  const stop = useCallback(() => {
    setIsRunning(false);
    setPassedSeconds(0);
  }, []);

  const reset = useCallback((offset = 0, newAutoStart = true) => {
    const newPassedSeconds = offset ? getSecondsFromStart(offset, true) : 0;
    setIsRunning(newAutoStart);
    setStartTime(offset);
    setPassedSeconds(newPassedSeconds);
  }, []);

  return {
    ...getTimeFromSeconds(passedSeconds),
    start,
    stop,
    reset,
    isRunning,
  };
}
