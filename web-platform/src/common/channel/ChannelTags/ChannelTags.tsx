import { gql } from '@apollo/client';
import { Pill } from '@noice-com/common-ui';

import { ChannelTagsChannelFragment } from '@gen';

gql`
  fragment ChannelTagsChannel on ChannelChannel {
    matureRatedContent
  }
`;

interface Props {
  pillColor: 'blue-950' | 'blue-750' | 'gray-750';
  channel: ChannelTagsChannelFragment;
}

export function ChannelTags({ channel, pillColor }: Props) {
  const { matureRatedContent } = channel;

  return (
    <>
      {matureRatedContent && (
        <Pill
          color={pillColor}
          label="Mature"
        />
      )}
    </>
  );
}
