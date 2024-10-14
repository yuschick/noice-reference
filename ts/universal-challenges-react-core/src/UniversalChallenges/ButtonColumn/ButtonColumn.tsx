import { CoreAssets } from '@noice-com/assets-core';
import { IconButton } from '@noice-com/common-ui';

import styles from './ButtonColumn.module.css';

export function ButtonColumn() {
  return (
    <div className={styles.universalChallengesButtonColumnContainer}>
      <div className={styles.secondaryButtonsContainer}>
        <IconButton
          icon={CoreAssets.Icons.Info}
          label="Universal Challenges information"
          level="secondary"
          size="sm"
        />
        <IconButton
          icon={CoreAssets.Icons.ArrowDown}
          label="Hide"
          level="secondary"
          size="sm"
        />
      </div>

      <IconButton
        icon={CoreAssets.Icons.Cards}
        label="Switch to Card Game"
        level="secondary"
        size="md"
      />
    </div>
  );
}
