import { HTMLAttributes, useContext, useEffect, useState } from 'react';

import styles from './Tabs.module.css';
import { TabsContext, usePanel } from './TabsProvider';

import { WithChildren } from '@common-types';

interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style'> {
  lazyBehavior?: 'keepMounted' | 'unmount';
}

export function Panel({
  children,
  lazyBehavior = 'unmount',
  ...htmlAttributes
}: WithChildren<Props>) {
  const [keepPanelMounted, setKeepPanelMounted] = useState(false);

  const context = useContext(TabsContext);
  const panel = usePanel();

  if (!panel || !context) {
    throw new Error('Tabs.Panel must be used within a Tabs component');
  }

  const isActive = context.store.state.selectedTabIndex === panel.index;
  const shouldKeepMounted = lazyBehavior === 'keepMounted';

  useEffect(() => {
    if (keepPanelMounted || !shouldKeepMounted) {
      return;
    }

    if (isActive) {
      setKeepPanelMounted(true);
    }
  }, [keepPanelMounted, isActive, shouldKeepMounted]);

  return isActive ? (
    <div
      {...htmlAttributes}
      aria-labelledby={`${context.store.state.tabsId}-tabs-tab-${panel.index}`}
      className={styles.tabsPanel}
      id={`${context.store.state.tabsId}-tabs-panel-${panel.index}`}
      role="tabpanel"
      tabIndex={0}
    >
      {children}
    </div>
  ) : keepPanelMounted ? (
    <div
      {...htmlAttributes}
      aria-hidden="true"
      aria-labelledby={`${context.store.state.tabsId}-tabs-tab-${panel.index}`}
      className={styles.tabsPanel}
      id={`${context.store.state.tabsId}-tabs-panel-${panel.index}`}
      role="tabpanel"
      tabIndex={-1}
    >
      {children}
    </div>
  ) : null;
}
