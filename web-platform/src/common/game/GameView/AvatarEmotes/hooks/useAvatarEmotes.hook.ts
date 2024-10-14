import { gql } from '@apollo/client';
import { useClient } from '@noice-com/common-react-core';
import { useAnalytics, useAuthenticatedUser } from '@noice-com/common-ui';
import { useCallback, useEffect, useState } from 'react';

import { AvatarEmoteDef, RecentlyUsedEmote } from '../types';

import { useRecentlyUsedAvatarEmotes } from './useRecentlyUsedAvatarEmotes.hook';

import { useStreamGame } from '@common/stream';
import { AvatarAnimation, EmojiEmoji, useUseAvatarEmotesQuery } from '@gen';

gql`
  query UseAvatarEmotes($userId: ID) {
    inventory(
      userId: $userId
      filters: [{ itemType: TYPE_EMOTE }, { itemType: TYPE_EMOJI }]
    ) {
      items {
        itemId
        item {
          id
          type
          details {
            __typename
            ... on AvatarAnimation {
              name
              chatCommand
              iconUrl
              id
            }
            ... on EmojiEmoji {
              id
              label
              image
            }
          }
        }
      }
    }
  }
`;

interface HookResult {
  recentlyUsed: RecentlyUsedEmote[];
  emojis: AvatarEmoteDef[];
  emotes: AvatarEmoteDef[];
  loading: boolean;
  onEmoteButtonClick(item: AvatarEmoteDef): void;
}

export function useAvatarEmotes(): HookResult {
  const { gameInstance } = useStreamGame();
  const client = useClient();
  const { userId } = useAuthenticatedUser();
  const [emojis, setEmojis] = useState<AvatarEmoteDef[]>([]);
  const [emotes, setEmotes] = useState<AvatarEmoteDef[]>([]);
  const { trackEvent } = useAnalytics();

  const { refetch: refetchAvatarEmotes, loading } = useUseAvatarEmotesQuery({
    variables: {
      userId,
    },

    async onCompleted(data) {
      const animations =
        data.inventory?.items
          .filter(({ item }) => item.details?.__typename === 'AvatarAnimation')
          .map<AvatarEmoteDef>(({ item }) => {
            const details = item.details as AvatarAnimation;

            return {
              id: details.id,
              name: details.name,
              icon: details.iconUrl,
              type: 'emote',
            };
          }) ?? [];

      setEmotes(animations);

      const emojis = await Promise.all(
        data.inventory?.items
          .filter(({ item }) => item.details?.__typename === 'EmojiEmoji')
          .map<Promise<AvatarEmoteDef>>(async ({ item }) => {
            const details = item.details as EmojiEmoji;

            return {
              id: details.id,
              name: details.name,
              icon: details.image,
              type: 'emoji',
            };
          }) ?? [],
      );

      setEmojis(emojis);
    },
  });

  useEffect(() => {
    return client.NotificationService.notifications({
      onInventoryUpdate: () => refetchAvatarEmotes(),
    });
  }, [client, refetchAvatarEmotes]);

  const onEmoteButtonClickFunc = useCallback(
    async (item: AvatarEmoteDef) => {
      try {
        if (item.type === 'emoji') {
          await gameInstance?.triggerEmoji(item.id);

          trackEvent({
            clientAvatarEmojiClicked: {
              emojiId: item.id,
              icon: item.icon,
              name: item.name,
            },
          });

          return;
        }

        await gameInstance?.triggerEmote(item.id);

        trackEvent({
          clientAvatarEmoteClicked: {
            emoteId: item.id,
            icon: item.icon,
            name: item.name,
          },
        });
      } catch (err) {
        // We don't care if this fails, it's just a nice to have
      }
    },
    [gameInstance, trackEvent],
  );

  const { recentlyUsed, onEmoteButtonClick } = useRecentlyUsedAvatarEmotes({
    emotes,
    emojis,
    onEmoteButtonClick: onEmoteButtonClickFunc,
  });

  return {
    recentlyUsed,
    emojis,
    emotes,
    loading,
    onEmoteButtonClick,
  };
}
