import { CoreAssets } from '@noice-com/assets-core';
import { Icon } from '@noice-com/common-ui';

import styles from './ActivityFeed.module.css';

export function EmptyState() {
  return (
    <section className={styles.emptyStateWrapper}>
      <Icon
        color="text-light"
        icon={CoreAssets.Icons.List}
        size={24}
      />
      <div>No events to show yet</div>
      <p className={styles.emptyStateDescription}>
        Activity feed will show new joiners, followers, subscribers and other channel &
        stream events.
      </p>
    </section>
  );
}
