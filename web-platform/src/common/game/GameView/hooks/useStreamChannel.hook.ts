import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import { Nullable } from '@noice-com/utils';
import { useEffect } from 'react';

import { useSelectedUIState } from '@context';
import { StreamChannelFragment, useStreamChannelQuery } from '@gen';

const fragment = gql`
  fragment StreamChannel on ChannelChannel {
    id
    currentChatId
    name
    ...PipChannelInfo
    game {
      id
      name
      activeSeason {
        id
        seasonBreak
        seasonBreakReason
      }
      noicePredictionsEnabled
    }
  }
`;

gql`
  query StreamChannel($streamId: String!) {
    getStreamChannels(streamIds: [$streamId]) {
      channels {
        id
        ...StreamChannel
      }
    }
  }
  ${fragment}
`;

interface HookResult {
  channel: Nullable<StreamChannelFragment>;
  loading: boolean;
}

export function useStreamChannel(streamId: Nullable<string>): HookResult {
  const { data, loading } = useStreamChannelQuery({
    ...variablesOrSkip({ streamId }),
  });
  const [channel] = data?.getStreamChannels?.channels ?? [];

  const { setSelectedGame } = useSelectedUIState();

  // Set selected game to the local storage & add to recently visited,
  // if noice predictions are enabled
  useEffect(() => {
    if (!channel?.game.id || !channel?.game.noicePredictionsEnabled) {
      return;
    }

    setSelectedGame(channel.game.id);
  }, [setSelectedGame, channel?.game.id, channel?.game.noicePredictionsEnabled]);

  return {
    channel,
    loading,
  };
}
