import { MutationTuple, gql } from '@apollo/client';
import { DeepPartial } from '@noice-com/utils';

import {
  ChannelChannel,
  ChannelGetUserFollowedChannelsResponse,
  ChannelUnfollowChannelMutation,
  ChannelUnfollowChannelMutationVariables,
  useChannelUnfollowChannelMutation,
} from '@gen';

gql`
  mutation ChannelUnfollowChannel($channelId: ID!, $userId: ID!) {
    unfollowChannel(channelId: $channelId, userId: $userId) {
      emptyTypeWorkaround
    }
  }
`;

export function useUnfollowChannelMutation(): MutationTuple<
  ChannelUnfollowChannelMutation,
  ChannelUnfollowChannelMutationVariables
> {
  return useChannelUnfollowChannelMutation({
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
          followerCount: (existing?.followerCount ?? 0) - 1,
          following: false,
        }),
      );

      cache.modify({
        fields: {
          followedChannels(
            existingChannels: Partial<ChannelGetUserFollowedChannelsResponse>,
            { readField },
          ) {
            return {
              ...existingChannels,
              channels: existingChannels.channels?.filter(
                (channel) => readField('id', channel) !== variables.channelId,
              ),
            };
          },
        },
      });

      // Clear followed channels when stop following a channel
      cache.evict({ id: 'ROOT_QUERY', fieldName: 'followedChannels' });
      cache.gc();
    },
  });
}
