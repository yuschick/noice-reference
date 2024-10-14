import { WithChildren } from '@noice-com/common-ui';

import styles from './BaseLayout.module.css';

export function BaseLayout({ children }: WithChildren) {
  return (
    <div className={styles.browserSourceBaseMainWrapper}>
      <div className={styles.browserSourceBaseMainContainer}>{children}</div>
    </div>
  );
}
