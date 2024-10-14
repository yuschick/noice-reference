import { CoreAssets } from '@noice-com/assets-core';
import { Notification } from '@noice-com/schemas/notification/notification.pb';
import { UserDataExportCompleteEvent } from '@noice-com/schemas/privacy/privacy.pb';
import { Nullable } from '@noice-com/utils';
import { useCallback, useRef } from 'react';

import { GenericLinkButtonNotificationContent } from '../../content';
import { AddNotificationFunc } from '../NotificationProvider';

import {
  AddNotificationResult,
  NotificationComponentBaseProps,
} from '@common/notification/types';

interface HookResult {
  onUserDataExportComplete(ctx: Notification, ev: UserDataExportCompleteEvent): void;
}

interface Props {
  addNotification: AddNotificationFunc;
}

export function useUserDataExportCompleteNotification({
  addNotification,
}: Props): HookResult {
  const currentNotification =
    useRef<Nullable<AddNotificationResult<NotificationComponentBaseProps>>>(null);

  const onUserDataExportComplete = useCallback(
    async (ctx: Notification, ev: UserDataExportCompleteEvent) => {
      if (!ctx.id || !ev.dataUrl) {
        return;
      }

      currentNotification.current = addNotification({
        component: {
          type: GenericLinkButtonNotificationContent,
          props: {
            icon: CoreAssets.Icons.Check,
            description: 'Your data request is ready!',
            buttonLink: {
              content: 'Download file',
              to: ev.dataUrl,
              onClick() {
                currentNotification.current?.actions.remove();
              },
            },
          },
        },
      });
    },
    [addNotification],
  );

  return { onUserDataExportComplete };
}
