import { gql } from '@apollo/client';
import {
  useRestartingSubscription,
  variablesOrSkip,
} from '@noice-com/apollo-client-utils';
import { DeepPartial } from 'react-hook-form';

import {
  ChannelChannel,
  ChannelLiveStatusDocument,
  ChannelLiveStatusSubscription,
  ChannelLiveStatusSubscriptionVariables,
} from '@gen/graphql';

gql`
  subscription ChannelLiveStatus($channelId: ID) {
    channelLiveStatusSubscribe(channelId: $channelId) {
      liveStatus
    }
  }
`;

/**
 * Hooks to the ChannelLiveStatus subscription
 * and update the cache with the latest live status
 * @param channelId
 */
export const useChannelLiveStatus = (channelId?: string) => {
  useRestartingSubscription<
    ChannelLiveStatusSubscription,
    ChannelLiveStatusSubscriptionVariables
  >(ChannelLiveStatusDocument, {
    ...variablesOrSkip({ channelId }),
    onData({ data, client }) {
      if (!channelId) {
        return;
      }

      client.cache.updateFragment<DeepPartial<ChannelChannel>>(
        {
          id: client.cache.identify({ id: channelId, __typename: 'ChannelChannel' }),
          fragment: gql`
            fragment ChannelLiveStatusUpdate on ChannelChannel {
              id
              liveStatus
            }
          `,
        },
        (existing) => ({
          ...existing,
          liveStatus: data.data?.channelLiveStatusSubscribe?.liveStatus,
        }),
      );
    },
  });
};
