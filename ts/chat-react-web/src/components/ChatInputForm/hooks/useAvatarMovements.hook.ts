import { gql } from '@apollo/client';
import { useClient } from '@noice-com/common-react-core';
import { useAuthenticatedUser } from '@noice-com/common-ui';
import { useEffect } from 'react';

import {
  AvatarAnimation,
  EmoteAvatarAnimationFragment,
  useAvatarMovementsQuery,
} from '@chat-gen';

gql`
  query AvatarMovements($userId: ID) {
    inventory(userId: $userId, filters: { itemType: TYPE_EMOTE }) {
      items {
        itemId
        item {
          id
          details {
            ... on AvatarAnimation {
              ...EmoteAvatarAnimation
            }
          }
        }
      }
    }
  }
  fragment EmoteAvatarAnimation on AvatarAnimation {
    name
    chatCommand
    iconUrl
    id
  }
`;

interface HookResult {
  movements: EmoteAvatarAnimationFragment[];
  loading: boolean;
}

export function useAvatarMovements(): HookResult {
  const client = useClient();
  const { userId } = useAuthenticatedUser();

  const {
    refetch: refetchAvatarEmotes,
    loading,
    data,
  } = useAvatarMovementsQuery({
    variables: {
      userId,
    },
  });

  useEffect(() => {
    return client.NotificationService.notifications({
      onInventoryUpdate: () => refetchAvatarEmotes(),
    });
  }, [client, refetchAvatarEmotes]);

  const movements = data?.inventory?.items
    ? data.inventory.items
        .map(({ item }) => item.details)
        .filter((item): item is AvatarAnimation => item?.__typename === 'AvatarAnimation')
    : [];

  return {
    movements,
    loading,
  };
}
