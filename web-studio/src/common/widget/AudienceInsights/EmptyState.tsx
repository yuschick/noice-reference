import { CoreAssets } from '@noice-com/assets-core';
import { Icon } from '@noice-com/common-ui';

import styles from './AudienceInsights.module.css';

export function EmptyState() {
  return (
    <section className={styles.emptyStateWrapper}>
      <Icon
        color="text-light"
        icon={CoreAssets.Icons.Friends}
        size={24}
      />
      <div>There&apos;s nobody here yet</div>
      <p className={styles.emptyStateDescription}>
        Audience Insights will help you understand your audience composition when
        you&apos;re live.
      </p>
    </section>
  );
}
