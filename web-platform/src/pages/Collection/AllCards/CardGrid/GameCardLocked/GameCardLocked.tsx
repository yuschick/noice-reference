import { CoreAssets } from '@noice-com/assets-core';
import { Icon } from '@noice-com/common-ui';

import styles from './GameCardLocked.module.css';

interface Props {
  lockedReason?: string;
}

export function GameCardLocked({ lockedReason }: Props) {
  return (
    <div className={styles.cardLockedWrapper}>
      <Icon
        className={styles.lockIcon}
        icon={CoreAssets.Icons.Lock}
      />
      <span className={styles.label}>{lockedReason}</span>
    </div>
  );
}
