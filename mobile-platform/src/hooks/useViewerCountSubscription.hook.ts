import { gql } from '@apollo/client';
import {
  useRestartingSubscription,
  variablesOrSkip,
} from '@noice-com/apollo-client-utils';
import { DeepPartial } from 'react-hook-form';

import {
  ChannelChannel,
  ViewerCountDocument,
  ViewerCountSubscription,
  ViewerCountSubscriptionVariables,
} from '@gen/graphql';

gql`
  subscription ViewerCount($channelId: ID) {
    channelViewerCountSubscribe(channelId: $channelId) {
      viewerCount
    }
  }
`;

export const useViewerCountSubscription = (channelId?: string) => {
  useRestartingSubscription<ViewerCountSubscription, ViewerCountSubscriptionVariables>(
    ViewerCountDocument,
    {
      ...variablesOrSkip({ channelId }),
      onData({ data, client }) {
        if (!channelId) {
          return;
        }

        client.cache.updateFragment<DeepPartial<ChannelChannel>>(
          {
            id: client.cache.identify({ id: channelId, __typename: 'ChannelChannel' }),
            fragment: gql`
              fragment ChannelViewCountUpdate on ChannelChannel {
                id
                viewerCount
              }
            `,
          },
          (existing) => ({
            ...existing,
            viewerCount: data.data?.channelViewerCountSubscribe?.viewerCount,
          }),
        );
      },
    },
  );
};
