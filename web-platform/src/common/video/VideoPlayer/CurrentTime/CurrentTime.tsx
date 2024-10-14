import { StringUtils, DateAndTimeUtils } from '@noice-com/utils';

import styles from './CurrentTime.module.css';

export interface CurrentTimeProps {
  currentTime: number;
  duration: number;
}

// Have a shorthand function for padStart
const pad = (num: number) => StringUtils.padStart(num.toString(), '0', 2);

const getTimeStr = (time: number) => {
  const hours = DateAndTimeUtils.getHours(time);
  const minutes = DateAndTimeUtils.getMinutes(time);
  const seconds = DateAndTimeUtils.getSeconds(time);

  return `${hours > 0 ? pad(hours) + ':' : ''}${pad(minutes)}:${pad(seconds)}`;
};

export function CurrentTime({ currentTime, duration }: CurrentTimeProps) {
  const currentTimeMs = currentTime * 1000;
  const durationMs = duration * 1000;

  return (
    <div className={styles.wrapper}>
      <span>{getTimeStr(currentTimeMs)}</span>
      <span>/</span>
      <span>{getTimeStr(durationMs)}</span>
    </div>
  );
}
