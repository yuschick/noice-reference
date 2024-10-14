import { CoreAssets } from '@noice-com/assets-core';
import { Violation } from '@noice-com/schemas/channel/moderation.pb';
import { Notification } from '@noice-com/schemas/notification/notification.pb';
import { UsernameChange } from '@noice-com/schemas/profile/profile.pb';
import { useCallback } from 'react';

import { GenericLinkButtonNotificationContent } from '../../content';
import { Context } from '../NotificationProvider';

import { Routes, SettingsRoutes } from '@common/route';

interface HookResult {
  onUsernameChange(ctx: Notification, ev: UsernameChange): void;
}

type Props = Context['actions'];

export function useUsernameChangeNotification({
  addNotification,
  removeNotification,
}: Props): HookResult {
  const onUsernameChange = useCallback(
    (_ctx: Notification, ev: UsernameChange) => {
      // Do not show notification if there is no violation reason for username change
      if (!ev.reason || ev.reason === Violation.VIOLATION_UNSPECIFIED) {
        return;
      }

      addNotification({
        component: {
          type: GenericLinkButtonNotificationContent,
          props: {
            icon: CoreAssets.Icons.Exclamation,
            description: 'Your username has been rejected',
            subtext: 'A new username has been assigned to you.',
            buttonLink: {
              content: 'Change your username',
              to: `${Routes.Settings}/${SettingsRoutes.Profile}`,
              onClick(notificationId: string) {
                removeNotification(notificationId);
              },
            },
          },
        },
        options: {
          duration: 0,
        },
      });
    },
    [addNotification, removeNotification],
  );

  return { onUsernameChange };
}
