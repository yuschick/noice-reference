import { gql, useApolloClient } from '@apollo/client';
import {
  ChannelChannel,
  SubscriptionChannelSubscriptionState,
} from '@noice-com/apollo-client-utils/gen';
import { useClient } from '@noice-com/common-react-core';
import { DeepPartial } from '@noice-com/utils';
import { useEffect } from 'react';

export function useListenGiftNotificationUpdateCache() {
  const client = useClient();
  const { cache } = useApolloClient();

  useEffect(() => {
    return client.NotificationService.notifications({
      onGiftSubscription(_ctx, ev) {
        cache.updateFragment<DeepPartial<ChannelChannel>>(
          {
            id: cache.identify({
              id: ev.channelId,
              __typename: 'ChannelChannel',
            }),
            fragment: gql`
              fragment UpdateSubscriptionOnGiftChannel on ChannelChannel {
                subscription {
                  state
                }
              }
            `,
          },
          (existingChannel) => ({
            ...existingChannel,
            subscription: {
              ...existingChannel?.subscription,
              state: SubscriptionChannelSubscriptionState.StateActive,
            },
          }),
        );
      },
    });
  });
}
