import { gql } from '@apollo/client';
import { useClient } from '@noice-com/common-react-core';
import { useEffect, useState } from 'react';

import {
  EmojiByLabel,
  EmojiCategory,
  EmojiDefinition,
  EmojiList,
  EmojisByChannel,
} from './types/emoji';

import {
  useUserInventoryEmojisChannelsLazyQuery,
  useUserInventoryEmojisQuery,
} from '@gen/graphql';
import { useAuth } from '@hooks/useAuth.hook';

gql`
  fragment UserInventoryEmoji on EmojiEmoji {
    id
    label
    image
    channelId
  }

  fragment UserInventoryEmojisChannel on ChannelChannel {
    id
    logo
    name
  }

  query UserInventoryEmojis($userId: ID) {
    inventory(userId: $userId, filters: { itemType: TYPE_EMOJI }) {
      items {
        itemId
        item {
          id
          details {
            ...UserInventoryEmoji
          }
        }
      }
    }
  }

  query UserInventoryEmojisChannels($channelIds: [String!]) {
    getChannels(channelIds: $channelIds) {
      channels {
        ...UserInventoryEmojisChannel
      }
    }
  }
`;

type EmojisByChannelId = {
  [channelId: string]: EmojiByLabel[];
};

interface HookResult {
  emojis: EmojiDefinition[];
  emojiList: EmojiList;
  emojisByChannel: EmojisByChannel;
  noiceEmojis: EmojiCategory;
}

export function useUserInventoryEmojis(): HookResult {
  const { userId } = useAuth();
  const client = useClient();
  const [getChannels] = useUserInventoryEmojisChannelsLazyQuery();
  const [hookResult, setHookResult] = useState<HookResult>({
    emojis: [],
    emojiList: {},
    emojisByChannel: [],
    noiceEmojis: { title: 'Noice', emojis: [] },
  });

  const { refetch: refetchEmojis } = useUserInventoryEmojisQuery({
    variables: { userId },
    onCompleted: async (data) => {
      const channelIds: string[] = [];
      const emojiList: EmojiList = {};
      const emojis: EmojiDefinition[] = [];
      const noiceEmojis: EmojiCategory = { title: 'Noice', emojis: [] };
      const emojisByChannelId: EmojisByChannelId = {};

      data.inventory?.items.forEach((item) => {
        const emoji = item.item.details;

        if (emoji?.__typename !== 'EmojiEmoji') {
          return;
        }

        const label = `:${emoji.label}:`;

        const emojiDef: EmojiDefinition = {
          itemId: emoji.id,
          label,
          source: emoji.image,
        };

        emojis.push(emojiDef);

        emojiList[label] = emojiDef;

        if (emoji.channelId && !channelIds.includes(emoji.channelId)) {
          channelIds.push(emoji.channelId);
        }

        // Noice emojis' channelId is an empty string
        if (!emoji.channelId) {
          noiceEmojis.emojis.push({ label, emoji: emojiDef });
          return;
        }

        // We have channelId for the emote, add it to the
        // mapping based on channelId to be used later
        emojisByChannelId[emoji.channelId]
          ? emojisByChannelId[emoji.channelId].push({ label, emoji: emojiDef })
          : (emojisByChannelId[emoji.channelId] = [{ label, emoji: emojiDef }]);
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

      setHookResult({ emojis, emojiList, emojisByChannel, noiceEmojis });
    },
  });

  useEffect(() => {
    return client.NotificationService.notifications({
      onInventoryUpdate: () => refetchEmojis(),
    });
  }, [client, refetchEmojis]);

  return hookResult;
}
