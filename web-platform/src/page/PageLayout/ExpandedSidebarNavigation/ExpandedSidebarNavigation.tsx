import { CoreAssets } from '@noice-com/assets-core';
import { IconButton, NoiceLogo } from '@noice-com/common-ui';
import { Link } from 'react-router-dom';

import { PlatformNavigation } from '../PlatformNavigation';
import { SidebarChannels } from '../SidebarChannels';
import { SidebarOverlay } from '../SidebarOverlay';
import { EXPANDED_NAVIGATION_SIDEBAR_ID } from '../utils';

import styles from './ExpandedSidebarNavigation.module.css';

import { Routes } from '@common/route';

interface Props {
  isExpanded: boolean;
  onCollapse(): void;
}

export function ExpandedSidebarNavigation({ isExpanded, onCollapse }: Props) {
  return (
    <SidebarOverlay
      className={styles.sidebar}
      isExpanded={isExpanded}
      position="start"
      onCollapse={onCollapse}
    >
      <aside className={styles.sidebarWrapper}>
        <div
          className={styles.wrapper}
          id={EXPANDED_NAVIGATION_SIDEBAR_ID}
        >
          <section className={styles.header}>
            <IconButton
              aria-controls={EXPANDED_NAVIGATION_SIDEBAR_ID}
              aria-expanded={isExpanded ? 'true' : 'false'}
              icon={CoreAssets.Icons.Close}
              label="Collapse"
              level="secondary"
              shape="sharp"
              size="lg"
              onClick={onCollapse}
            />

            <Link
              aria-label="Go to home"
              className={styles.betaLogo}
              to={Routes.Home}
            >
              <NoiceLogo
                className={styles.logo}
                theme="light"
                variant="horizontal"
                width={113}
              />

              <span className={styles.betaPill}>Open Beta</span>
            </Link>
          </section>

          <div className={styles.content}>
            <PlatformNavigation mode="expanded" />

            <SidebarChannels mode="expanded" />
          </div>
        </div>
      </aside>
    </SidebarOverlay>
  );
}
