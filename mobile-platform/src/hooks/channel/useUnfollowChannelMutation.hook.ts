import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';

import { useChannelUnfollowChannelMutation } from '@gen/graphql';

gql`
  mutation ChannelUnfollowChannel($channelId: ID!, $userId: ID!) {
    unfollowChannel(channelId: $channelId, userId: $userId) {
      emptyTypeWorkaround
    }
  }
`;

export function useUnfollowChannelMutation(channelId?: string, userId?: string | null) {
  return useChannelUnfollowChannelMutation({
    ...variablesOrSkip({ channelId, userId }),
    optimisticResponse: {
      __typename: 'Mutation',
      unfollowChannel: {
        __typename: 'GoogleProtobufEmpty',
        emptyTypeWorkaround: true,
      },
    },

    update(cache) {
      cache.modify({
        id: cache.identify({ __typename: 'ChannelChannel', id: channelId }),
        fields: {
          followerCount(existingCount) {
            return existingCount - 1;
          },
          following() {
            return false;
          },
        },
      });
    },
  });
}
