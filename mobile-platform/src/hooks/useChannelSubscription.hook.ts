import { gql, useApolloClient } from '@apollo/client';
import {
  useRestartingSubscription,
  variablesOrSkip,
} from '@noice-com/apollo-client-utils';
import { DeepPartial } from '@noice-com/utils';
import { useState } from 'react';

import {
  ChannelChannel,
  ChannelSubscribeDocument,
  ChannelSubscribeSubscription,
  ChannelSubscribeSubscriptionVariables,
  ChannelLiveStatus,
} from '@gen/graphql';

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
  const [liveStatus, setLiveStatus] = useState<ChannelLiveStatus>();

  useRestartingSubscription<
    ChannelSubscribeSubscription,
    ChannelSubscribeSubscriptionVariables
  >(ChannelSubscribeDocument, {
    ...variablesOrSkip({ channelId }),
    onData: async ({ data: { data: subscriptionData } }) => {
      if (!channelId) {
        return;
      }

      const updatedLiveStatus =
        subscriptionData?.channelStreamDetailSubscribe?.liveStatus;
      setLiveStatus(updatedLiveStatus);

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
          liveStatus: updatedLiveStatus,
          currentStreamId: streamId,
          game: { id: gameId, __typename: 'GameGame' },
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

  return {
    liveStatus,
  };
}
