import { CoreAssets } from '@noice-com/assets-core';
import { Icon } from '@noice-com/common-ui';

import styles from './AudienceInsights.module.css';

export function NoActiveFilters() {
  return (
    <section className={styles.emptyStateWrapper}>
      <Icon
        color="text-light"
        icon={CoreAssets.Icons.Filter}
        size={24}
      />
      <div>There are no active filters</div>
      <p className={styles.emptyStateDescription}>
        Enable a filter to see audience insights.
      </p>
    </section>
  );
}
