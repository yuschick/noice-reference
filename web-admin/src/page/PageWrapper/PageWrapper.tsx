import { WithChildren } from '@noice-com/common-ui';
import classNames from 'classnames';

import styles from './PageWrapper.module.css';
import { StaticSidebar } from './StaticSidebar/StaticSidebar';
import { TopBar } from './TopBar/TopBar';

import { useSidebarState } from '@module-common';

export function PageWrapper({ children }: WithChildren) {
  const { sidebarOpen, hideStaticSidebar } = useSidebarState();

  return (
    <div
      className={classNames(styles.wrapper, {
        [styles.sidebarClosed]: !sidebarOpen,
        [styles.noSidebar]: hideStaticSidebar,
      })}
    >
      <TopBar className={styles.topBar} />

      {!hideStaticSidebar && <StaticSidebar className={styles.sidebar} />}

      <div className={styles.content}>{children}</div>
    </div>
  );
}
