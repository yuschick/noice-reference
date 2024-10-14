import { LoadingSkeleton } from '@noice-com/common-ui';
import { MathUtils } from '@noice-com/utils';

import styles from './StatsComponent.module.css';

export interface Props {
  title: string;
  value: number;
}

export function StatsComponent({ title, value }: Props) {
  const shortValue = MathUtils.transformNumberToShortString(value);

  return (
    <div className={styles.wrapper}>
      <span className={styles.value}>{shortValue}</span>
      <div className={styles.title}>{title}</div>
    </div>
  );
}

StatsComponent.Loading = () => (
  <div className={styles.wrapper}>
    <LoadingSkeleton className={styles.loadingValue} />
    <LoadingSkeleton className={styles.loadingTitle} />
  </div>
);
