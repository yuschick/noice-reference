import { CoreAssets } from '@noice-com/assets-core';
import classNames from 'classnames';
import { Children, isValidElement, useContext, useMemo } from 'react';

import { IconButton } from '../IconButton';

import { TabButton } from './TabButton';
import { TabLink } from './TabLink';
import styles from './Tabs.module.css';
import { TabProvider, TabsContext } from './TabsProvider';

import { WithChildren } from '@common-types';

export function TabsList({ children }: WithChildren) {
  const context = useContext(TabsContext);

  if (!context) {
    throw new Error('Tabs.List must be used within a Tabs component');
  }

  const { store } = context;

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) {
      return;
    }

    if (child.type !== TabButton && child.type !== TabLink) {
      throw new Error(`Tabs.List: Invalid child type: ${child.type}`);
    }
  });

  context.store.state.tabsCount = useMemo(
    () => Children.toArray(children).length,
    [children],
  );

  return (
    <div className={classNames(styles.tabsWrapper, styles[context.store.state.variant])}>
      {store.state.hasOverflow.includes('prev') && (
        <div className={styles.prev}>
          <IconButton
            aria-controls={store.state.tabsId}
            icon={CoreAssets.Icons.ChevronLeft}
            label={`Scroll back in tabs list`}
            level="secondary"
            size="sm"
            onClick={() => store.actions.scrollTo('prev')}
          />
        </div>
      )}

      <div
        aria-labelledby={context?.store.state.tabsTitleId}
        aria-orientation="horizontal"
        className={styles.tabListContainer}
        id={store.state.tabsId}
        ref={store.state.tabsListRef}
        role="tablist"
      >
        {Children.map(children, (child, index) => {
          return (
            <TabProvider
              index={index}
              key={index}
            >
              {child}
            </TabProvider>
          );
        })}
      </div>

      {store.state.hasOverflow.includes('next') && (
        <div className={styles.next}>
          <IconButton
            aria-controls={store.state.tabsId}
            icon={CoreAssets.Icons.ChevronRight}
            label={`Scroll forward in tabs list`}
            level="secondary"
            size="sm"
            onClick={() => store.actions.scrollTo('next')}
          />
        </div>
      )}
    </div>
  );
}
