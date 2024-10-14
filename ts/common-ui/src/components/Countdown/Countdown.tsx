import { useEffect } from 'react';
import { useTimer } from 'react-timer-hook';

export interface CountdownProps {
  label?: string;
  target: Date;
  className?: string;
  daysSuffix?: string;
  hoursSuffix?: string;
  minutesSuffix?: string;
  secondsSuffix?: string;
  onCompleted?(): void;
}

export function Countdown({
  label,
  target,
  className,
  daysSuffix = 'd',
  hoursSuffix = 'h',
  minutesSuffix = 'min',
  secondsSuffix = 'sec',
  onCompleted,
}: CountdownProps) {
  const { seconds, minutes, hours, days, restart } = useTimer({
    expiryTimestamp: target,
    onExpire: onCompleted,
  });

  useEffect(() => {
    if (target) {
      restart(target);
    }
    // restart() function is not wrapped in useCallback() inside the lib
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  return (
    <span
      aria-label={label}
      className={className}
      role="timer"
    >
      {days > 0 && `${days}${daysSuffix} `}
      {hours > 0 && `${hours}${hoursSuffix} `}
      {days === 0 && minutes > 0 && `${minutes}${minutesSuffix} `}
      {days === 0 && hours === 0 && seconds > 0 && `${seconds}${secondsSuffix}`}
      {days === 0 && hours === 0 && minutes === 0 && seconds === 0 && `0`}
    </span>
  );
}
