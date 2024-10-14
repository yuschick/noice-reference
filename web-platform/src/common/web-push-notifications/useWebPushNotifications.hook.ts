import { CoreAssets } from '@noice-com/assets-core';
import { useAnalytics } from '@noice-com/common-ui';
import { AnalyticsEventClientWebPushNotificationActionAction } from '@noice-com/schemas/analytics/analytics.pb';
import { useCallback } from 'react';

import { useWebPushAPI } from './context';

import { useAppLocalStorage } from '@common/localstorage';
import { Notifications, useNotifications } from '@common/notification';
import { GenericButtonsNotificationContent } from '@common/notification/content';
import { PUSH_NOTIFICATIONS_HELP_PAGE_LINK } from '@common/web-push-notifications/constant';

type PushNotificationType = 'channel-live';

const DID_YOU_GET_PUSH_NOTIFICATION_NOTIFICATION_TIMEOUT = 6000;
export const useWebPushNotifications = (type: PushNotificationType) => {
  const { actions: notificationActions } = useNotifications();
  const localStorage = useAppLocalStorage();
  const {
    isPushAPISupported,
    isPushNotificationsBlockedByUser,
    enablePushNotifications,
    isPushNotificationsEnabled,
    sendTestPushNotification,
  } = useWebPushAPI();
  const { trackEvent } = useAnalytics();

  const askPermissionForWebPushNotifications = useCallback(
    (shouldSendTestNotification = false) => {
      const onNotificationEnabled = () => {
        if (!shouldSendTestNotification) {
          return;
        }

        const inAppNotificationTimeoutId = setTimeout(() => {
          notificationActions.addNotification({
            options: {
              duration: 0,
            },
            component: {
              type: Notifications.GenericLinkButtonNotificationContent,
              props: {
                icon: CoreAssets.Icons.Bell,
                description:
                  'Browser notifications are on! Did you get the Noice notification?',
                subtext:
                  "If you're having issues with notifications, visit profile settings for help.",
                buttonLink: {
                  content: 'Get help',
                  to: PUSH_NOTIFICATIONS_HELP_PAGE_LINK,
                  onClick: (id) => {
                    notificationActions.removeNotification(id);
                  },
                },
                dismissButton: {
                  content: 'Dismiss',
                  onClick: (id) => {
                    notificationActions.removeNotification(id);
                  },
                },
              },
            },
          });
        }, DID_YOU_GET_PUSH_NOTIFICATION_NOTIFICATION_TIMEOUT);

        const onClose = () => {
          trackEvent({
            clientWebPushNotificationAction: {
              action:
                AnalyticsEventClientWebPushNotificationActionAction.ACTION_TEST_CONFIRMED,
            },
          });
          clearTimeout(inAppNotificationTimeoutId);
        };

        sendTestPushNotification(onClose);
      };

      const showPushNotificationError = () => {
        notificationActions.addNotification({
          options: {
            duration: 0,
          },
          component: {
            type: GenericButtonsNotificationContent,
            props: {
              icon: CoreAssets.Icons.Error,
              description: 'Failed to enable desktop notifications on this browser',
              subtext: 'Something went wrong.',
              acceptButton: {
                content: 'Try again',
                onClick: (notificationId: string) => {
                  enablePushNotifications(
                    onNotificationEnabled,
                    showPushNotificationError,
                  );
                  notificationActions.removeNotification(notificationId);
                },
              },
            },
          },
        });
      };

      if (
        !isPushAPISupported ||
        isPushNotificationsEnabled ||
        localStorage.GetValue('web-push-notifications.popup.actioned') ||
        isPushNotificationsBlockedByUser
      ) {
        return;
      }

      const handleNotificationClose = (notificationId: string) => {
        localStorage.SetValue('web-push-notifications.popup.actioned', true);
        notificationActions.removeNotification(notificationId);
      };

      const getNotificationDescription = () => {
        switch (type) {
          case 'channel-live':
            return 'Allow desktop notifications on this browser when channels go live';
          default:
            return 'Allow desktop notifications on this browser';
        }
      };

      notificationActions.addNotification({
        options: {
          duration: 0,
        },
        component: {
          type: GenericButtonsNotificationContent,
          props: {
            icon: CoreAssets.Icons.Bell,
            description: getNotificationDescription(),
            subtext: 'You can adjust global notification from your Profile settings.',
            acceptButton: {
              content: 'Allow',
              onClick: (notificationId: string) => {
                enablePushNotifications(onNotificationEnabled, showPushNotificationError);
                handleNotificationClose(notificationId);
              },
            },
            declineButton: {
              content: 'No thanks',
              onClick: (notificationId: string) => {
                handleNotificationClose(notificationId);
              },
            },
          },
        },
      });
    },
    [
      enablePushNotifications,
      isPushAPISupported,
      isPushNotificationsBlockedByUser,
      isPushNotificationsEnabled,
      localStorage,
      notificationActions,
      sendTestPushNotification,
      trackEvent,
      type,
    ],
  );

  return {
    askPermissionForWebPushNotifications,
  };
};
