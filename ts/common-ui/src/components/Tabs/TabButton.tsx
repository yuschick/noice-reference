import { useContext, useEffect, useRef } from 'react';

import { HTMLButtonAttributes } from '../Button/Button.types';

import styles from './Tabs.module.css';
import { TabsContext, useTab } from './TabsProvider';

import { WithChildren } from '@common-types';

type Props = Omit<
  HTMLButtonAttributes,
  'aria-disabled' | 'className' | 'disabled' | 'id' | 'style'
>;

export function TabButton({ children, ...htmlAttributes }: WithChildren<Props>) {
  const context = useContext(TabsContext);
  const tab = useTab();
  const tabRef = useRef<HTMLButtonElement>(null);

  if (!tab || !context) {
    throw new Error('Tabs.Tab must be used within a Tabs component');
  }

  const selectedTabIndex = context.store.state.selectedTabIndex;

  useEffect(() => {
    if (
      !tabRef.current ||
      !context.store.state.tabs ||
      (tabRef && context.store.state.tabs.includes(tabRef))
    ) {
      return;
    }

    context.store.actions.setTabs([...context.store.state.tabs, tabRef]);
  }, [context.store]);

  return (
    <button
      {...htmlAttributes}
      aria-controls={`${context.store.state.tabsId}-tabs-panel-${tab.index}`}
      aria-posinset={tab.index + 1}
      aria-selected={selectedTabIndex === tab.index}
      aria-setsize={context.store.state.tabsCount}
      className={styles.tabsListTab}
      id={`${context.store.state.tabsId}-tabs-tab-${tab.index}`}
      ref={tabRef}
      role="tab"
      type="button"
      onClick={(event) => {
        htmlAttributes?.onClick?.(event);
        context.store.actions.handleChange(tab.index);
      }}
    >
      {children}
    </button>
  );
}
