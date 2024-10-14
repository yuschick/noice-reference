import { Icon } from '@noice-com/common-ui';
import classNames from 'classnames';

import styles from './StatsRow.module.css';

interface Props {
  icon: SvgrComponent;
  prefix: string;
  suffix: string;
  className?: string;
}

export function StatsRow({ icon, prefix, suffix, className }: Props) {
  return (
    <div className={classNames(styles.wrapper, className)}>
      <Icon
        className={styles.icon}
        icon={icon}
      />
      <div className={styles.textWrapper}>
        <span className={styles.prefix}>{prefix}</span>
        <span className={styles.suffix}>{suffix}</span>
      </div>
    </div>
  );
}
