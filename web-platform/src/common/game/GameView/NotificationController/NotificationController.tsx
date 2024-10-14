import { useNotifications, NotificationItem } from '@noice-com/card-game';
import { Nullable } from '@noice-com/utils';
import { useCallback, useEffect, useRef, useState } from 'react';

import styles from './NotificationController.module.css';

export function NotificationController(): JSX.Element {
  const [stack, add, remove] = useNotifications();
  const [activeNotification, setActiveNotification] =
    useState<Nullable<NotificationItem>>(null);
  const activeNotifRef = useRef<Nullable<HTMLElement>>(null);
  const currentTimerRef = useRef<number>(-1);

  // Clear out any currently going timers on unmount
  useEffect(() => {
    return () => {
      window.clearTimeout(currentTimerRef.current);
    };
  }, [add]);

  // This should only happen when a new notification mounts.
  useEffect(() => {
    if (stack.length > 0 && activeNotification === null) {
      setActiveNotification(stack[0]);
      return;
    }
  }, [stack, activeNotification]);

  const transitionRef = useCallback(
    (ref: Nullable<HTMLElement>) => {
      if (ref !== null) {
        // Delay for a frame to add the `in` class
        activeNotifRef.current = ref;
        window.setTimeout(() => ref.classList.add('in'), 0);
        currentTimerRef.current = window.setTimeout(() => {
          ref.classList.remove('in');
        }, activeNotification?.duration ?? 1);
      }
    },
    [activeNotification],
  );

  const onCloseClicked = useCallback(() => {
    activeNotifRef.current?.classList.remove('in');
    clearTimeout(currentTimerRef.current);
  }, []);

  const onTransitionEnd = useCallback(() => {
    if (
      !activeNotifRef.current?.classList.contains('in') &&
      activeNotification !== null
    ) {
      remove(activeNotification.id);
      activeNotifRef.current = null;
      setActiveNotification(null);
    }
  }, [activeNotification, remove]);

  return (
    <div className={styles.container}>
      {activeNotification ? (
        <activeNotification.view
          {...(activeNotification.props ?? {})}
          key={'notif-' + activeNotification.id}
          ref={transitionRef}
          onClose={onCloseClicked}
          onTransitionEnd={onTransitionEnd}
        />
      ) : null}
    </div>
  );
}
