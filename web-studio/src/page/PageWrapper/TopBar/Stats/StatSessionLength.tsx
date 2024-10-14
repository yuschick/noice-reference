import { useId } from 'react';

import { useStreamSessionStartTime } from '../hooks/useStreamSessionStartTime.hook';
import styles from '../TopBar.module.css';
import { getMatchStatus } from '../utils';

import { useStreamContext } from '@common/stream';

export function StatSessionLength() {
  const sessionLengthTimerId = useId();

  const context = useStreamContext();
  const matchStatus = getMatchStatus(context);
  const { streamId } = context;

  const { days, hours, minutes, seconds } = useStreamSessionStartTime({
    streamId,
    matchStatus: matchStatus.status,
  });

  return (
    <>
      <span
        className={styles.streamStatLabel}
        id={sessionLengthTimerId}
      >
        Session length
      </span>
      <span
        aria-labelledby={sessionLengthTimerId}
        className={styles.streamStatValue}
        role="timer"
      >
        {`${days ? days + 'd ' : ''}` +
          `${hours}:${minutes < 10 ? '0' : ''}${minutes}:` +
          `${seconds < 10 ? '0' : ''}${seconds}`}
      </span>
    </>
  );
}
