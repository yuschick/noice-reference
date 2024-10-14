import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import { LoadingSpinner } from '@noice-com/common-ui';

import { PlatformEmojiAddDrawer } from './PlatformEmojiAddDrawer/PlatformEmojiAddDrawer';
import { PlatformEmojiEditDrawer } from './PlatformEmojiEditDrawer/PlatformEmojiEditDrawer';

import { useDrawer } from '@common/drawer';
import { usePlatformEmojiDrawerEmojiQuery } from '@gen';

gql`
  query PlatformEmojiDrawerEmoji($emojiId: ID!) {
    emoji(id: $emojiId) {
      id
      ...PlatformEmojiEditDrawerEmoji
    }
  }
`;

export function PlatformEmojiDrawer() {
  const { activeId } = useDrawer();

  const { data, loading } = usePlatformEmojiDrawerEmojiQuery({
    ...variablesOrSkip({ emojiId: activeId }),
  });

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!activeId) {
    return <PlatformEmojiAddDrawer />;
  }

  if (!data?.emoji) {
    return <span>Emoji not found</span>;
  }

  return <PlatformEmojiEditDrawer emoji={data.emoji} />;
}
