import { useMountEffect } from '@noice-com/common-react-core';
import { WithChildren } from '@noice-com/common-ui';
import classNames from 'classnames';
import { BiX } from 'react-icons/bi';

import styles from './Drawer.module.css';

import { IconButton } from '@common/button';
import { useDrawer } from '@common/drawer';

export interface DrawerProps extends WithChildren {
  title: string;
}

export function Drawer({ title, children }: DrawerProps) {
  const { drawerIsOpen, drawerContentRef, closeDrawer } = useDrawer();

  useMountEffect(() => {
    return () => {
      closeDrawer();
    };
  });

  return (
    <section
      className={classNames(styles.wrapper, { [styles.open]: drawerIsOpen })}
      ref={drawerContentRef}
    >
      <div className={styles.top}>
        <h3 className={styles.title}>{title}</h3>

        <IconButton
          icon={BiX}
          text="Close drawer"
          onClick={closeDrawer}
        />
      </div>

      {children}
    </section>
  );
}
