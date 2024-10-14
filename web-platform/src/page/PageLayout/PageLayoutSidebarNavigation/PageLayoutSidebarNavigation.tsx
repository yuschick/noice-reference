import { PlatformNavigation } from '../PlatformNavigation';
import { SidebarChannels } from '../SidebarChannels';

import styles from './PageLayoutSidebarNavigation.module.css';

export function PageLayoutSidebarNavigation() {
  return (
    <aside
      aria-label="Navigation"
      className={styles.wrapper}
    >
      <PlatformNavigation />

      <SidebarChannels />
    </aside>
  );
}
