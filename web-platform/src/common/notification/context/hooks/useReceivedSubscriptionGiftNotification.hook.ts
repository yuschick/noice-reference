import { gql } from '@apollo/client';
import { CoreAssets } from '@noice-com/assets-core';
import {
  GiftSubscription,
  Notification,
} from '@noice-com/schemas/notification/notification.pb';
import { useCallback } from 'react';

import { AddNotificationFunc } from '../NotificationProvider';

import { GenericNotificationContent } from '@common/notification/content';
import { useNotificationReceivedSubscriptionGiftLazyQuery } from '@gen';

gql`
  query NotificationReceivedSubscriptionGift(
    $userId: ID
    $channelId: ID!
    $skipProfile: Boolean = false
  ) {
    profile(userId: $userId) @skip(if: $skipProfile) {
      userId
      userTag
    }

    channel(id: $channelId) {
      id
      name
    }
  }
`;

interface HookResult {
  onGiftSubscription: (ctx: Notification, ev: GiftSubscription) => void;
}

interface Props {
  addNotification: AddNotificationFunc;
}

export function useReceivedSubscriptionGiftNotification({
  addNotification,
}: Props): HookResult {
  const [fetchContent] = useNotificationReceivedSubscriptionGiftLazyQuery();

  const onGiftSubscription = useCallback(
    async (ctx: Notification, ev: GiftSubscription) => {
      if (!ctx.id || !ev.channelId) {
        return;
      }

      const { data } = await fetchContent({
        variables: {
          userId: ev.giverId,
          channelId: ev.channelId,
          skipProfile: !ev.giverId,
        },
      });

      if (!data?.channel) {
        return;
      }

      addNotification({
        component: {
          type: GenericNotificationContent,
          props: {
            icon: CoreAssets.Icons.Exclamation,
            description: 'You got a gift subscription!',
            subtext: `${
              data.profile?.userTag ?? 'Mysterious user'
            } gifted you a subscription to ${data.channel.name}'s channel.`,
          },
        },
      });
    },
    [addNotification, fetchContent],
  );

  return { onGiftSubscription };
}
