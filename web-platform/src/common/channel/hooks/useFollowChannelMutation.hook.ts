import { MutationTuple, gql } from '@apollo/client';
import { useConversionEvents } from '@noice-com/common-ui';
import { DeepPartial } from '@noice-com/utils';

import { useWebPushNotifications } from '@common/web-push-notifications';
import {
  ChannelChannel,
  ChannelFollowChannelMutation,
  ChannelFollowChannelMutationVariables,
  useChannelFollowChannelMutation,
} from '@gen';

gql`
  mutation ChannelFollowChannel($channelId: ID!, $userId: ID!) {
    followChannel(channelId: $channelId, userId: $userId) {
      emptyTypeWorkaround
    }
  }
`;

export function useFollowChannelMutation(): MutationTuple<
  ChannelFollowChannelMutation,
  ChannelFollowChannelMutationVariables
> {
  const { sendBasicConversionEvent } = useConversionEvents();
  const { askPermissionForWebPushNotifications } =
    useWebPushNotifications('channel-live');

  return useChannelFollowChannelMutation({
    onCompleted() {
      askPermissionForWebPushNotifications(true);
      sendBasicConversionEvent('ChannelFollowed');
    },
    update(cache, _result, { variables }) {
      if (!variables) {
        return;
      }

      cache.updateFragment<DeepPartial<ChannelChannel>>(
        {
          id: cache.identify({ id: variables.channelId, __typename: 'ChannelChannel' }),
          fragment: gql`
            fragment FollowChannelChannel on ChannelChannel {
              id
              followerCount
              following
            }
          `,
        },
        (existing) => ({
          ...existing,
          id: variables.channelId,
          followerCount: (existing?.followerCount ?? 0) + 1,
          following: true,
        }),
      );

      // Clear followed channels when following a new channel
      cache.evict({ id: 'ROOT_QUERY', fieldName: 'followedChannels' });
      cache.gc();
    },
  });
}
