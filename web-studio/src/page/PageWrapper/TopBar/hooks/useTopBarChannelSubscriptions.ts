import { gql } from '@apollo/client';
import { useRestartingSubscription } from '@noice-com/apollo-client-utils';
import { Nullable } from '@noice-com/utils';

import {
  TopBarChannelViewerCountDocument,
  TopBarChannelViewerCountSubscription,
  TopBarChannelViewerCountSubscriptionVariables,
} from '@gen';

gql`
  subscription TopBarChannelViewerCount($channelId: ID!) {
    channelViewerCountSubscribe(channelId: $channelId) {
      viewerCount
    }
  }
`;

interface HookResult {
  viewerCount: Nullable<number>;
}

export const useTopBarChannelSubscriptions = (channelId: string): HookResult => {
  const { data: viewerCountData } = useRestartingSubscription<
    TopBarChannelViewerCountSubscription,
    TopBarChannelViewerCountSubscriptionVariables
  >(TopBarChannelViewerCountDocument, {
    variables: { channelId },
  });

  const viewerCount = viewerCountData?.channelViewerCountSubscribe?.viewerCount ?? null;

  return { viewerCount };
};
