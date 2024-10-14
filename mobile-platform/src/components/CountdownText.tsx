import { DateTime, Duration } from 'luxon';
import { useEffect, useState } from 'react';

import { Typography, TypographyProps } from './Typography';

interface Props extends TypographyProps {
  countdownToMs: number;
  onComplete?: () => void;
}

const getFormat = (duration: Duration) => {
  if (duration.hours > 0) {
    return `${Math.round(duration.hours)}hrs`;
  }

  if (duration.minutes > 0) {
    return `${Math.round(duration.minutes)}min ${Math.round(duration.seconds)}sec`;
  }

  if (duration.seconds > 0) {
    return `${Math.round(duration.seconds)}sec`;
  }

  return '0sec';
};

export const CountdownText = ({
  countdownToMs,
  onComplete,
  ...typographyProps
}: Props) => {
  const [timeLabel, setTimeLabel] = useState<string>();

  useEffect(() => {
    const date = DateTime.fromMillis(countdownToMs);

    const updateLabel = () => {
      const diff = date.diff(DateTime.now(), ['hours', 'minutes', 'seconds']);
      const formatted = getFormat(diff);
      setTimeLabel(formatted);

      if (diff.seconds <= 0) {
        onComplete?.();
        clearInterval(interval);
      }
    };

    const interval = setInterval(updateLabel, 1000);

    // Instantly set the label before the interval runs
    updateLabel();

    return () => {
      clearInterval(interval);
    };
  }, [countdownToMs, onComplete]);

  return <Typography {...typographyProps}>{timeLabel}</Typography>;
};
