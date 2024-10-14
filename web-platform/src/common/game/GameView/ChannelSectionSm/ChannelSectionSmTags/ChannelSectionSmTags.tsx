import { gql } from '@apollo/client';
import { Pill } from '@noice-com/common-ui';

import { ChannelTags } from '@common/channel';
import { ChannelSectionSmTagsChannelFragment } from '@gen';

interface Props {
  channel: ChannelSectionSmTagsChannelFragment;
}

export function ChannelSectionSmTags({ channel }: Props) {
  return (
    <>
      <Pill
        color="gray-750"
        label={channel.game.name}
      />
      <ChannelTags
        channel={channel}
        pillColor="gray-750"
      />
    </>
  );
}

ChannelSectionSmTags.fragments = {
  entry: gql`
    fragment ChannelSectionSmTagsChannel on ChannelChannel {
      id
      game {
        id
        name
      }
      ...ChannelTagsChannel
    }
  `,
};
