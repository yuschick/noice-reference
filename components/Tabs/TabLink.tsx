import { useContext, useEffect, useRef } from 'react';
import { NavLink, NavLinkProps } from 'react-router-dom';

import styles from './Tabs.module.css';
import { TabsContext, useTab } from './TabsProvider';

import { WithChildren } from '@common-types';

type Props = Omit<
  NavLinkProps,
  'aria-disabled' | 'className' | 'disabled' | 'id' | 'style'
>;

export function TabLink({ children, ...htmlAttributes }: WithChildren<Props>) {
  const context = useContext(TabsContext);
  const tab = useTab();
  const tabRef = useRef<HTMLAnchorElement>(null);

  if (!tab || !context) {
    throw new Error('Tabs.Tab must be used within a Tabs component');
  }

  const selectedTabIndex = context.store.state.selectedTabIndex;

  useEffect(() => {
    if (
      !tabRef.current ||
      !context.store.state.tabs.current ||
      (tabRef && context.store.state.tabs.current.includes(tabRef.current))
    ) {
      return;
    }

    context.store.state.tabs.current.push(tabRef.current);
  }, [context.store.state.tabs]);

  return (
    <NavLink
      {...htmlAttributes}
      aria-posinset={tab.index + 1}
      aria-setsize={context.store.state.tabsCount}
      className={styles.tabsListTab}
      id={`${context.store.state.tabsId}-tabs-tab-${tab.index}`}
      ref={tabRef}
      role="tab"
      tabIndex={selectedTabIndex === tab.index ? 0 : -1}
      onClick={(event) => {
        htmlAttributes?.onClick?.(event);
        context.store.actions.handleChange(tab.index);
      }}
    >
      {children}
    </NavLink>
  );
}
