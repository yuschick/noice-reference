import { WithChildren } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { v4 as uuid } from 'uuid';

import {
  AddNotificationResult,
  Notification,
  NotificationComponentBaseProps,
  NotificationsList,
} from '../types';

import { useNotificationServiceNotifications } from './hooks/useNotificationServiceNotifications.hook';
import { usePartyInviteNotification } from './hooks/usePartyInviteNotification.hook';
import { usePartyLeaderChangedStream } from './hooks/usePartyLeaderChangedStream.hook';

export type AddNotificationFunc = <T extends NotificationComponentBaseProps>({
  component,
  options,
  events,
}: Omit<Notification<T>, 'id' | 'component'> & {
  component: Omit<Notification<T>['component'], 'props'> & {
    props: Omit<Notification<T>['component']['props'], 'notificationId'>;
  };
}) => AddNotificationResult;

export interface Context {
  notifications: NotificationsList;
  actions: {
    addNotification: AddNotificationFunc;
    removeNotification: (id: string) => void;
  };
}

const NotificationsContext = createContext<Nullable<Context>>(null);

export function NotificationProvider({ children }: WithChildren) {
  const [notifications, setNotifications] = useState<NotificationsList>([]);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => {
      const removedIndex = prev.findIndex((notification) => notification.id === id);

      if (removedIndex < 0) {
        return prev;
      }

      const removed = prev?.[removedIndex];

      if (!removed) {
        return prev;
      }

      removed.events?.onRemoved?.();
      const newNotifs = [...prev];
      newNotifs.splice(removedIndex, 1);

      if (newNotifs.length === prev.length) {
        return prev;
      }

      return newNotifs;
    });
  }, []);

  const addNotification: AddNotificationFunc = useCallback(
    ({ component, options, events }) => {
      const id = uuid();

      setNotifications((prev) => {
        return [
          ...prev,
          {
            component: {
              type: component.type,
              props: { ...component.props, notificationId: id },
            },
            options,
            events,
            id,
          },
        ];
      });

      return {
        id,
        actions: {
          update: (props) => {
            setNotifications((prev) => {
              const existingIndex = prev.findIndex(
                (notification) => notification.id === id,
              );

              const existing = prev?.[existingIndex];

              if (existingIndex < 0 || !existing) {
                return prev;
              }

              const newNotifs = [...prev];

              newNotifs.splice(existingIndex, 1, {
                id,
                component: {
                  props: { ...existing.component.props, ...props },
                  type: existing.component.type,
                },
                options: existing.options,
                events: existing.events,
              });

              return newNotifs;
            });
          },
          remove: () => removeNotification(id),
        },
      };
    },
    [removeNotification],
  );

  useNotificationServiceNotifications({
    actions: { addNotification, removeNotification },
  });

  usePartyInviteNotification({ actions: { addNotification, removeNotification } });
  usePartyLeaderChangedStream({ actions: { addNotification, removeNotification } });

  const notificationActions = useMemo(() => {
    return {
      addNotification,
      removeNotification,
    };
  }, [addNotification, removeNotification]);

  return (
    <NotificationsContext.Provider
      value={{ notifications, actions: notificationActions }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationsContext);

  if (!context) {
    throw new Error('Trying to access notifications without NotificationsProvider');
  }

  return context;
}
