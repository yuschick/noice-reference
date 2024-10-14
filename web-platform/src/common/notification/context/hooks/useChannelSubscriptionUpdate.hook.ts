import { gql } from '@apollo/client';
import { CoreAssets } from '@noice-com/assets-core';
import { Notification } from '@noice-com/schemas/notification/notification.pb';
import {
  ChannelSubscriptionUpdateEvent,
  ChannelSubscriptionUpdateEventUpdateType,
} from '@noice-com/schemas/subscription/subscription.pb';
import { useCallback } from 'react';

import { GenericLinkButtonNotificationContent } from '../../content';
import { Context } from '../NotificationProvider';

import { Routes, SettingsRoutes } from '@common/route';
import { useChannelSubscriptionUpdateNotificationChannelLazyQuery } from '@gen';

gql`
  query ChannelSubscriptionUpdateNotificationChannel($channelId: ID!) {
    channel(id: $channelId) {
      id
      name
    }
  }
`;

interface HookResult {
  onChannelSubscriptionUpdate(
    ctx: Notification,
    ev: ChannelSubscriptionUpdateEvent,
  ): void;
}

type Props = Context['actions'];

export function useChannelSubscriptionUpdate({
  addNotification,
  removeNotification,
}: Props): HookResult {
  const [fetchSubscribedChannel] =
    useChannelSubscriptionUpdateNotificationChannelLazyQuery();

  const onChannelSubscriptionUpdate = useCallback(
    async (ctx: Notification, ev: ChannelSubscriptionUpdateEvent) => {
      if (
        !ctx.id ||
        ev.updateType !==
          ChannelSubscriptionUpdateEventUpdateType.UPDATE_TYPE_PAYMENT_FAILED
      ) {
        return;
      }

      const channelId = ev.subscription?.channelId;

      if (!channelId) {
        return;
      }

      const { data } = await fetchSubscribedChannel({
        variables: { channelId },
      });

      if (!data?.channel) {
        return;
      }

      addNotification({
        component: {
          type: GenericLinkButtonNotificationContent,
          props: {
            icon: CoreAssets.Icons.Alert,
            description: 'Your subscription payment failed',
            subtext: `To keep your subscription active for channel ${data.channel.name}, please update
            your payment method.`,
            buttonLink: {
              content: 'Update payment method',
              to: `${Routes.Settings}/${SettingsRoutes.Subscriptions}`,
              onClick(notificationId: string) {
                removeNotification(notificationId);
              },
            },
          },
        },
      });
    },
    [addNotification, fetchSubscribedChannel, removeNotification],
  );

  return { onChannelSubscriptionUpdate };
}
