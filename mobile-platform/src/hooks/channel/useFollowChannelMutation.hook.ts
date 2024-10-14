import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';

import { useChannelFollowChannelMutation } from '@gen/graphql';

gql`
  mutation ChannelFollowChannel($channelId: ID!, $userId: ID!) {
    followChannel(channelId: $channelId, userId: $userId) {
      emptyTypeWorkaround
    }
  }
`;

export function useFollowChannelMutation(channelId?: string, userId?: string | null) {
  return useChannelFollowChannelMutation({
    ...variablesOrSkip({ channelId, userId }),
    optimisticResponse: {
      __typename: 'Mutation',
      followChannel: {
        __typename: 'GoogleProtobufEmpty',
        emptyTypeWorkaround: true,
      },
    },
    update(cache) {
      cache.modify({
        id: cache.identify({ __typename: 'ChannelChannel', id: channelId }),
        fields: {
          followerCount(existingCount) {
            return existingCount + 1;
          },
          following() {
            return true;
          },
        },
      });
    },
  });
}
