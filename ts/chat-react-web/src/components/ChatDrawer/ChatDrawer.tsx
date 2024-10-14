import { MountTransition, WithChildren, useOnOutsideClick } from '@noice-com/common-ui';
import classNames from 'classnames';
import { CSSProperties, RefObject, useRef } from 'react';

import styles from './ChatDrawer.module.css';

const CHAT_DRAWER_CLOSING_TIME = 150;

export interface ChatDrawerProps {
  showDrawer: boolean;
  className?: string;
  onOutsideClick?: () => void;
  outsideClickExemptions?: RefObject<HTMLElement>[];
}

type Props = WithChildren<ChatDrawerProps>;

export function ChatDrawer({
  children,
  className,
  onOutsideClick,
  outsideClickExemptions = [],
  showDrawer,
}: Props) {
  const drawerRef = useRef(null);
  const handleOutsideClick = () => {
    onOutsideClick?.();
  };

  useOnOutsideClick(drawerRef, handleOutsideClick, {
    exempt: [...outsideClickExemptions, 'portals'],
  });

  return (
    <MountTransition
      duration="--chat-drawer-closing-time"
      isShown={showDrawer}
      transitionClassName={styles.opened}
    >
      <div
        className={classNames(className, styles.container)}
        ref={drawerRef}
        style={
          {
            '--chat-drawer-closing-time': `${CHAT_DRAWER_CLOSING_TIME}ms`,
          } as CSSProperties
        }
      >
        <div className={styles.drawerPopup}>
          <div className={styles.drawerInner}>{children}</div>
        </div>
      </div>
    </MountTransition>
  );
}
