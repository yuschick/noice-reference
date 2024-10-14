import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import { LoadingSpinner } from '@noice-com/common-ui';

import { ChannelEmojiAddDrawer } from './ChannelEmojiAddDrawer/ChannelEmojiAddDrawer';
import { ChannelEmojiEditDrawer } from './ChannelEmojiEditDrawer/ChannelEmojiEditDrawer';

import { useDrawer } from '@common/drawer';
import { ChannelEmojiDrawerChannelFragment, useChannelEmojiDrawerEmojiQuery } from '@gen';

gql`
  fragment ChannelEmojiDrawerChannel on ChannelChannel {
    ...ChannelEmojiEditDrawerChannel
    ...ChannelEmojiAddDrawerChannel
  }

  query ChannelEmojiDrawerEmoji($emojiId: ID!) {
    emoji(id: $emojiId) {
      id
      ...ChannelEmojiEditDrawerEmoji
    }
  }
`;

interface Props {
  channel: ChannelEmojiDrawerChannelFragment;
}

export function ChannelEmojiDrawer({ channel }: Props) {
  const { activeId } = useDrawer();

  const { data, loading } = useChannelEmojiDrawerEmojiQuery({
    ...variablesOrSkip({ emojiId: activeId }),
  });

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!activeId) {
    return <ChannelEmojiAddDrawer channel={channel} />;
  }

  if (!data?.emoji) {
    return <span>Emoji not found</span>;
  }

  return (
    <ChannelEmojiEditDrawer
      channel={channel}
      emoji={data.emoji}
    />
  );
}
