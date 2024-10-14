import { useMountEffect } from '@noice-com/common-react-core';
import { SetTimeoutId } from '@noice-com/common-ui';
import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';

import { NotificationListItem } from '../NotificationListItem';
import { NotificationsList } from '../types';

import styles from './PopNotifications.module.css';

const DEFAULT_NOTIFICATION_DURATION = 5000;

interface Props {
  notifications: NotificationsList;
  removeNotification: (id: string) => void;
}

export function PopNotifications({ notifications, removeNotification }: Props) {
  const preventHide = useRef(false);
  const timeouts = useRef<
    Record<
      string,
      { timeout?: SetTimeoutId; start: number; remaining: number; preventPause?: boolean }
    >
  >({});

  /*
    This contains the ids of notifications that are being hidden (animated).
   */
  const [hiddenNotifications, setHiddenNotifications] = useState<string[]>([]);

  /*
    To be able to animate the notification when its dismissed, we need to have an
    internal state for the notifications here, because the actual notification is
    removed instantly from the provider when its dismissed.
   */
  const [internalNotifications, setInternalNotifications] =
    useState<NotificationsList>(notifications);

  // Handle the diff when notifications change
  useEffect(() => {
    setInternalNotifications((prev) => {
      const removed = prev.filter(
        (internalNotif) =>
          !notifications.find((notification) => notification.id === internalNotif.id),
      );

      const removedIds = removed.map((notification) => notification.id);

      setHiddenNotifications((prev) => [
        ...prev,
        ...removedIds.filter((id) => !prev.includes(id)),
      ]);

      return [...notifications, ...removed];
    });
  }, [notifications]);

  const startHideTimeout = (id: string) => {
    const { remaining } = timeouts.current[id];

    const timeout = setTimeout(() => {
      removeNotification(id);
    }, remaining);

    timeouts.current[id].timeout = timeout;
  };

  const handleCloseClicked = (id: string, onCloseListener?: () => void) => {
    onCloseListener?.();
    removeNotification(id);
  };

  /*
    This function gets triggered twice during notification lifecycle
    1. After notification has appeared
    2. After notification is hidden
   */
  const onAnimationEnd = (id: string, duration?: number) => {
    // This happens when the notification hide animation has completed
    if (hiddenNotifications.includes(id)) {
      const timeout = timeouts.current[id]?.timeout;

      if (timeout) {
        clearTimeout(timeout);
        delete timeouts.current[id];
      }

      setInternalNotifications((prev) => {
        return prev.filter((notification) => notification.id !== id);
      });

      setHiddenNotifications((prev) => {
        return prev.filter((hiddenId) => hiddenId !== id);
      });

      return;
    }

    // This happens when the notification appear animation has completed
    if (duration === 0) {
      return;
    }

    const preventPause = !!duration;

    timeouts.current[id] = {
      start: Date.now(),
      remaining: duration ?? DEFAULT_NOTIFICATION_DURATION,
      preventPause,
    };

    if (preventPause || !preventHide.current) {
      startHideTimeout(id);
    }
  };

  const onMouseEnter = () => {
    // Prevent all hides when mouse is over the notifications
    preventHide.current = true;

    Object.entries(timeouts.current)
      .filter(([_id, { preventPause }]) => !preventPause)
      .forEach(([id, { timeout, remaining, start }]) => {
        // Clear all timeouts on mouse enter
        if (timeout) {
          clearTimeout(timeout);
        }

        // Update the remaining time
        timeouts.current[id] = {
          ...timeouts.current[id],
          remaining: remaining - (Date.now() - start),
        };
      });
  };

  const onMouseLeave = () => {
    // Allow all hides when mouse is left the notifications
    preventHide.current = false;

    Object.entries(timeouts.current)
      .filter(([_id, { preventPause }]) => !preventPause)
      .forEach(([id]) => {
        // Update the start time
        timeouts.current[id] = {
          ...timeouts.current[id],
          start: Date.now(),
        };

        // Start the timeout again
        startHideTimeout(id);
      });
  };

  useMountEffect(() => {
    const timeoutsToClear = timeouts.current;

    // Clear all existing timeouts on unmount
    return () => {
      Object.values(timeoutsToClear).forEach(
        ({ timeout }) => timeout && clearTimeout(timeout),
      );
    };
  });

  if (!internalNotifications.length) {
    return null;
  }

  return (
    <div
      aria-live="polite"
      className={styles.wrapper}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <ul className={styles.list}>
        {internalNotifications.map((notification) => {
          if (!notification) {
            return null;
          }

          const duration = notification.options?.duration;

          return (
            <NotificationListItem
              className={classNames(styles.notification, {
                [styles.hidden]: hiddenNotifications.includes(notification.id),
              })}
              key={notification.id}
              onAnimationEnd={() => onAnimationEnd(notification.id, duration)}
              onCloseClick={() =>
                handleCloseClicked(notification.id, notification.events?.onCloseClicked)
              }
            >
              <>
                <span className={styles.highlightWrapper} />
                <notification.component.type {...notification.component.props} />
              </>
            </NotificationListItem>
          );
        })}
      </ul>
    </div>
  );
}
