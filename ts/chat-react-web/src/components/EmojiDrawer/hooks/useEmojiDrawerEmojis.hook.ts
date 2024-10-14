import { gql } from '@apollo/client';
import { useClient } from '@noice-com/common-react-core';
import { useAuthenticatedUser } from '@noice-com/common-ui';
import { useEffect, useState } from 'react';

import { LastUsedEmojisLocalStorage } from '@chat-classes';
import {
  EmojiDrawerChannelFragment,
  InventoryEmojiFragment,
  useUserInventoryEmojisChannelsLazyQuery,
  useUserInventoryEmojisQuery,
} from '@chat-gen';

gql`
  query UserInventoryEmojis($userId: ID) {
    inventory(userId: $userId, filters: { itemType: TYPE_EMOJI }) {
      items {
        itemId
        item {
          id
          details {
            ...InventoryEmoji
          }
        }
      }
    }
  }

  fragment EmojiDrawerChannel on ChannelChannel {
    ...ChannelLogoChannel
  }

  query UserInventoryEmojisChannels($channelIds: [String!]) {
    getChannels(channelIds: $channelIds) {
      channels {
        id
        ...EmojiDrawerChannel
      }
    }
  }
`;

type EmojisByChannel = {
  channel: EmojiDrawerChannelFragment;
  emojis: InventoryEmojiFragment[];
}[];

interface HookResult {
  emojisByChannel: EmojisByChannel;
  noiceEmojis: InventoryEmojiFragment[];
  lastUsedEmojis: InventoryEmojiFragment[];
}

interface Props {
  isDrawerOpen: boolean;
}

export function useEmojiDrawerEmojis({ isDrawerOpen }: Props): HookResult {
  const { userId } = useAuthenticatedUser();
  const client = useClient();
  const [getChannels] = useUserInventoryEmojisChannelsLazyQuery();
  const [emojisByChannel, setEmojisByChannel] = useState<EmojisByChannel>([]);
  const [noiceEmojis, setNoiceEmojis] = useState<InventoryEmojiFragment[]>([]);
  const [lastUsedEmojis, setLastUsedEmojis] = useState<InventoryEmojiFragment[]>([]);

  const { data, refetch: refetchEmojis } = useUserInventoryEmojisQuery({
    variables: { userId },
    onCompleted: async (data) => {
      const channelIds: string[] = [];
      const noiceEmojis: InventoryEmojiFragment[] = [];
      const emojisByChannelId: Record<string, InventoryEmojiFragment[]> = {};

      data.inventory?.items.forEach((item) => {
        const emoji = item.item.details;

        if (emoji?.__typename !== 'EmojiEmoji') {
          return;
        }

        if (emoji.channelId && !channelIds.includes(emoji.channelId)) {
          channelIds.push(emoji.channelId);
        }

        // Noice emojis' channelId is an empty string
        if (!emoji.channelId) {
          noiceEmojis.push(emoji);
          return;
        }

        // We have channelId for the emote, add it to the
        // mapping based on channelId to be used later
        emojisByChannelId[emoji.channelId]
          ? emojisByChannelId[emoji.channelId].push(emoji)
          : (emojisByChannelId[emoji.channelId] = [emoji]);
      });

      const { data: channelsData } = await getChannels({ variables: { channelIds } });

      const emojisByChannel: EmojisByChannel = [];

      channelsData?.getChannels?.channels.forEach((channel) => {
        const channelEmojis = emojisByChannelId[channel.id];

        if (!channelEmojis) {
          return;
        }

        emojisByChannel.push({ channel, emojis: channelEmojis });
      });

      setEmojisByChannel(emojisByChannel);
      setNoiceEmojis(noiceEmojis);
    },
  });

  useEffect(() => {
    // Get last used emojis every time drawer is opened
    if (!isDrawerOpen) {
      return;
    }

    const lastUsedEmojis: InventoryEmojiFragment[] =
      LastUsedEmojisLocalStorage.GetEmojis()
        .map(
          (emoji) =>
            data?.inventory?.items.find((item) => {
              if (item.item.details?.__typename !== 'EmojiEmoji') {
                return false;
              }

              return item.item.details.label === emoji;
            })?.item.details,
        )
        .filter(
          (item): item is InventoryEmojiFragment => item?.__typename === 'EmojiEmoji',
        );

    setLastUsedEmojis(lastUsedEmojis);
  }, [data, isDrawerOpen]);

  useEffect(() => {
    return client.NotificationService.notifications({
      onInventoryUpdate: () => refetchEmojis(),
    });
  }, [client, refetchEmojis]);

  return {
    emojisByChannel,
    noiceEmojis,
    lastUsedEmojis,
  };
}
