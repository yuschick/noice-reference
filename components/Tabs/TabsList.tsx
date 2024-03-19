import classNames from 'classnames';
import { Children, isValidElement, useContext, useMemo } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

import { IconButton } from '../IconButton';

import { TabButton } from './TabButton';
import { TabLink } from './TabLink';
import styles from './Tabs.module.css';
import { TabProvider, TabsContext } from './TabsProvider';

import { useHorizontalScrollNavigation } from '@common-hooks';
import { WithChildren } from '@common-types';

export function TabsList({ children }: WithChildren) {
  const context = useContext(TabsContext);

  const {
    containerRef,
    leftNavVisible,
    rightNavVisible,
    onLeftNavClick,
    onRightNavClick,
  } = useHorizontalScrollNavigation();

  if (!context) {
    throw new Error('Tabs.List must be used within a Tabs component');
  }

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
    <div
      className={classNames(styles.tabsWrapper, styles[context.store.state.variant], {
        [styles.showStartScrollButton]: leftNavVisible,
        [styles.showEndScrollButton]: rightNavVisible,
      })}
    >
      <div
        aria-hidden={leftNavVisible ? undefined : true}
        className={classNames(styles.navigationButton, styles.start)}
      >
        <IconButton
          icon={FaChevronLeft}
          label="Scroll left"
          level="secondary"
          size="sm"
          onClick={onLeftNavClick}
        />
      </div>

      <div
        className={styles.tabsListWrapper}
        ref={containerRef}
      >
        <div
          aria-labelledby={context?.store.state.tabsTitleId}
          aria-orientation="horizontal"
          className={styles.tabListContainer}
          ref={context.store.state.tabsListRef}
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
      </div>

      <div
        aria-hidden={rightNavVisible ? undefined : true}
        className={classNames(styles.navigationButton, styles.end)}
      >
        <IconButton
          icon={FaChevronRight}
          label="Scroll right"
          level="secondary"
          size="sm"
          onClick={onRightNavClick}
        />
      </div>
    </div>
  );
}
