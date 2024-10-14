import { CoreAssets } from '@noice-com/assets-core';
import { Icon } from '@noice-com/common-ui';
import classNames from 'classnames';

import styles from './GameEventBonus.module.css';

export interface Props {
  className?: string;
  points: number;
}

export function GameEventBonus({ className, points }: Props) {
  return (
    <div className={classNames(styles.wrapper, className)}>
      <span className={styles.title}>Victory</span>

      <span className={styles.bonus}>Bonus</span>

      <span className={styles.points}>+{points}</span>

      <Icon
        className={styles.icon}
        icon={CoreAssets.Icons.VictoryRoyale}
      />
    </div>
  );
}
