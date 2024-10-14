import { useCallback, useEffect, useRef, useState } from 'react';

interface UseStopwatchProps {
  autoStart?: boolean;
  offsetMilliseconds?: number;
}

type Callback = () => void;

function useInterval(callback: Callback, delay: number | null) {
  const callbackRef = useRef<Callback>();

  // update callback function with current render callback that has access to latest props and state
  useEffect(() => {
    callbackRef.current = callback;
  });

  useEffect(() => {
    if (!delay) {
      return () => {};
    }

    const interval = setInterval(() => {
      callbackRef.current && callbackRef.current();
    }, delay);

    return () => clearInterval(interval);
  }, [delay]);
}

class Time {
  public static GetTimeFromSeconds(secs: number) {
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

  public static GetSecondsFromStart(start: number, shouldRound: boolean) {
    const now = new Date().getTime();
    const milliSecondsDistance = now - start;
    const val = milliSecondsDistance / 1000;

    return shouldRound ? Math.round(val) : val;
  }
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
    offsetMilliseconds ? Time.GetSecondsFromStart(offsetMilliseconds, true) : 0,
  );
  const [isRunning, setIsRunning] = useState(autoStart);

  useInterval(
    () => {
      setPassedSeconds(Time.GetSecondsFromStart(startTime, true));
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
    const newPassedSeconds = offset ? Time.GetSecondsFromStart(offset, true) : 0;
    setIsRunning(newAutoStart);
    setStartTime(offset);
    setPassedSeconds(newPassedSeconds);
  }, []);

  return {
    ...Time.GetTimeFromSeconds(passedSeconds),
    start,
    stop,
    reset,
    isRunning,
  };
}
