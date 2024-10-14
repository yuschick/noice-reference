import {
  Notification,
  routeNotificationContentContentDelegate,
} from '@noice-com/schemas/notification/notification.pb';

/**
 * Triggers emulated NotificationService notifications
 * @example
 * // window.NOICE.triggerNotification({
 * //  progressionUpdate: {
 * //    updates: [
 * //      { level: { newLevel: { number: '1' } } },
 * //      { level: { newLevel: { number: '2' } } },
 * //    ],
 * //  },
 * // })
 */
window.NOICE.triggerNotification = (content: Notification) => {
  const timestamp = new Date().getTime().toString();
  const notification: Notification = {
    id: timestamp,
    new: true,
    persisted: false,
    createdAt: timestamp,
    content: content.content,
  };
  routeNotificationContentContentDelegate<Notification>(
    notification,
    content.content ?? {},
    window.NOICE.__NotificationDelegate,
  );
};
