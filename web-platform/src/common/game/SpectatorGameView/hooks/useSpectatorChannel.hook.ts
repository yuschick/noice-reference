import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import { Nullable } from '@noice-com/utils';

import { RestreamingHud } from '../RestreamingHud';

import { useSpectatorChannelQuery, SpectatorChannelFragment } from '@gen';

gql`
  query SpectatorChannel($streamId: String!) {
    getStreamChannels(streamIds: [$streamId]) {
      channels {
        ...SpectatorChannel
      }
    }
  }
  fragment SpectatorChannel on ChannelChannel {
    id
    currentChatId
    ...RestreamingHudChannel
  }
  ${RestreamingHud.fragments.channel}
`;

interface HookResult {
  channel: Nullable<SpectatorChannelFragment>;
}

export function useSpectatorChannel(streamId: Nullable<string>): HookResult {
  const { data } = useSpectatorChannelQuery({
    ...variablesOrSkip({ streamId }),
  });

  const [channel] = data?.getStreamChannels?.channels ?? [null];

  return {
    channel,
  };
}
