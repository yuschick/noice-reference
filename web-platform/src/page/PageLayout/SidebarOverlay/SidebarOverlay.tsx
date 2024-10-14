import { WithChildren, useMountTransition } from '@noice-com/common-ui';
import classNames from 'classnames';
import { TransitionEventHandler, useEffect, useRef, useState } from 'react';
import { FocusOn } from 'react-focus-on';

import styles from './SidebarOverlay.module.css';

interface Props {
  position: 'start' | 'end';
  isExpanded: boolean;
  className?: string;
  onCollapse(): void;
}

export function SidebarOverlay({
  children,
  position,
  isExpanded,
  className,
  onCollapse,
}: WithChildren<Props>) {
  const [isVisible, setIsVisible] = useState(isExpanded);
  const portals = document.getElementById('portals');
  const { showTransitionChild, withTransitionStyles } = useMountTransition({
    duration: '--noi-duration-regular',
    isShown: isExpanded,
  });

  const wrapperRef = useRef<HTMLDivElement>(null);

  const onTransitionEnd: TransitionEventHandler<HTMLDivElement> = (event) => {
    // When is open is false, set overlay to be invisible after transition so all transition has time to be visible
    if (isExpanded) {
      return;
    }

    if (event.target !== wrapperRef.current) {
      return;
    }
    setIsVisible(isExpanded);
  };

  useEffect(() => {
    // When is open is true, set overlay to be visible before transition so all transition has time to be visible
    if (isExpanded) {
      setIsVisible(isExpanded);
    }
  }, [isExpanded]);

  const onClickOutside = (event: MouseEvent | TouchEvent) => {
    // Ignore FTUE components on outside click
    if (document.querySelector('[data-ftue]')?.contains(event.target as Node)) {
      return;
    }

    onCollapse();
  };

  return showTransitionChild ? (
    <div
      className={classNames(styles.wrapper, styles[position], {
        [styles.isOpen]: withTransitionStyles,
        [styles.isVisible]: isVisible,
      })}
      ref={wrapperRef}
      onTransitionEnd={onTransitionEnd}
    >
      <FocusOn
        className={classNames(styles.content, className)}
        enabled={isExpanded}
        shards={portals ? [portals] : []}
        onClickOutside={onClickOutside}
        onEscapeKey={onCollapse}
      >
        {isVisible && children}
      </FocusOn>
    </div>
  ) : null;
}
