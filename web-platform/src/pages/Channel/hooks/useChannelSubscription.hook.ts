import { gql, useApolloClient } from '@apollo/client';
import { useRestartingSubscription } from '@noice-com/apollo-client-utils';
import { useAuthentication } from '@noice-com/common-ui';
import { DeepPartial } from '@noice-com/utils';

import { useStreamGame } from '@common/stream';
import {
  ChannelChannel,
  ChannelSubscribeDocument,
  ChannelSubscribeSubscription,
  ChannelSubscribeSubscriptionVariables,
} from '@gen';

interface Props {
  channelId?: string;
}

gql`
  subscription ChannelSubscribe($channelId: ID) {
    channelStreamDetailSubscribe(channelId: $channelId) {
      channelId
      liveStatus
      noicePredictionsEnabled
      streamId
      gameId
      matureRatedContent
    }
  }
`;

export function useChannelSubscription({ channelId }: Props) {
  const { cache } = useApolloClient();
  const { userId } = useAuthentication();
  const { channelId: currentActiveChannelId } = useStreamGame();

  useRestartingSubscription<
    ChannelSubscribeSubscription,
    ChannelSubscribeSubscriptionVariables
  >(ChannelSubscribeDocument, {
    variables: { channelId },
    skip: !userId || !channelId || channelId === currentActiveChannelId,
    onData: async ({ data: { data: subscriptionData } }) => {
      if (!channelId) {
        return;
      }

      const liveStatus = subscriptionData?.channelStreamDetailSubscribe?.liveStatus;
      const streamId = subscriptionData?.channelStreamDetailSubscribe?.streamId;
      const isNoicePredictionsEnabled =
        subscriptionData?.channelStreamDetailSubscribe?.noicePredictionsEnabled;
      const gameId = subscriptionData?.channelStreamDetailSubscribe?.gameId;
      const matureRatedContent =
        subscriptionData?.channelStreamDetailSubscribe?.matureRatedContent;

      // Update the Apollo Cache result
      cache.updateFragment<DeepPartial<ChannelChannel>>(
        {
          id: cache.identify({ __typename: 'ChannelChannel', id: channelId }),
          fragment: gql`
            fragment ChannelLiveStatus on ChannelChannel {
              liveStatus
              currentStreamId
              game {
                id
              }
              matureRatedContent
            }
          `,
        },
        (data) => ({
          ...data,
          liveStatus,
          currentStreamId: streamId,
          game: gameId ? { id: gameId, __typename: 'GameGame' } : data?.game,
          matureRatedContent,
        }),
      );

      cache.modify({
        id: cache.identify({ __typename: 'ChannelStream', streamId }),
        fields: {
          noicePredictionsEnabled: () => isNoicePredictionsEnabled,
        },
      });
    },
  });
}
