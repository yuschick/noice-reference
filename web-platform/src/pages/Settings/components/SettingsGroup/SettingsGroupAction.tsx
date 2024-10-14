import { WithChildren } from '@noice-com/common-ui';

import styles from './SettingsGroup.module.css';

export function SettingsGroupAction({ children }: WithChildren) {
  return <div className={styles.groupHeaderAction}>{children}</div>;
}
