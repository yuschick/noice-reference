import { gql } from '@apollo/client';
import { useStreamGame } from '@noice-com/card-game';
import { useClient } from '@noice-com/common-react-core';
import { useAnalytics, useAuthenticatedUser } from '@noice-com/common-ui';
import { useCallback, useEffect, useState } from 'react';

import { AvatarEmoteDef } from '../types/emotes';

import { AvatarAnimation, useUseStreamAvatarEmotesQuery } from '@stream-gen';

gql`
  query UseStreamAvatarEmotes($userId: ID) {
    inventory(userId: $userId, filters: [{ itemType: TYPE_EMOTE }]) {
      items {
        itemId
        item {
          id
          type
          details {
            __typename
            ... on AvatarAnimation {
              name
              iconUrl
              id
            }
          }
        }
      }
    }
  }
`;

interface HookResult {
  emotes: AvatarEmoteDef[];
  loading: boolean;
  onEmoteButtonClick(item: AvatarEmoteDef): void;
}

export function useStreamAvatarEmotes(): HookResult {
  const { gameInstance } = useStreamGame();
  const client = useClient();
  const { userId } = useAuthenticatedUser();
  const [emotes, setEmotes] = useState<AvatarEmoteDef[]>([]);
  const { trackEvent } = useAnalytics();

  const { refetch: refetchAvatarEmotes, loading } = useUseStreamAvatarEmotesQuery({
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
    },
  });

  useEffect(() => {
    return client.NotificationService.notifications({
      onInventoryUpdate: () => refetchAvatarEmotes(),
    });
  }, [client, refetchAvatarEmotes]);

  const onEmoteButtonClickFunc = useCallback(
    (item: AvatarEmoteDef) => {
      gameInstance?.triggerEmote(item.id);
      trackEvent({
        clientSpotlightsEmoteClicked: {
          emoteId: item.id,
          icon: item.icon,
          name: item.name,
        },
      });
    },
    [gameInstance, trackEvent],
  );

  return {
    emotes,
    loading,
    onEmoteButtonClick: onEmoteButtonClickFunc,
  };
}
