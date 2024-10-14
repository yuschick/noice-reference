import { CoreAssets } from '@noice-com/assets-core';
import { Icon } from '@noice-com/common-ui';

import styles from './BrowseChannelsEmpty.module.css';

export function BrowseChannelsEmpty() {
  return (
    <div className={styles.emptyContent}>
      <Icon
        icon={CoreAssets.Icons.Play}
        size={48}
      />

      <div className={styles.emptyText}>
        <h2 className={styles.emptyTitle}>No live streams at the moment</h2>

        <span>
          You will be notified when your favorite channels go live. Come back soon for all
          the action.
        </span>
      </div>
    </div>
  );
}
