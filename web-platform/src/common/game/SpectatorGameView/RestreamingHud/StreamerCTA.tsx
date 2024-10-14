import { Nullable } from '@noice-com/utils';
import classNames from 'classnames';

import styles from './StreamerCTA.module.css';

export interface Props {
  channelName?: Nullable<string>;
}

export function StreamerCTA({ channelName }: Props) {
  return (
    <div className={styles.ctaWrapper}>
      <div className={styles.cta}>
        <div className={classNames(styles.arrow, styles.left)}></div>
        <div className={classNames(styles.arrow, styles.left, styles.inner)}></div>
        <div className={classNames(styles.arrow, styles.right)}></div>
        <div className={classNames(styles.arrow, styles.right, styles.inner)}></div>
        <div className={styles.title}>Play {channelName}&apos;s stream</div>
        <div className={styles.subtitle}>noice.com/{channelName}</div>
        <div className={classNames(styles.diamond, styles.top)}></div>
        <div className={classNames(styles.diamond, styles.bottom)}></div>
      </div>
    </div>
  );
}
