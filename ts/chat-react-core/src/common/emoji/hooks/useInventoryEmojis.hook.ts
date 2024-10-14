import { gql } from '@apollo/client';
import { useClient } from '@noice-com/common-react-core';
import { useEffect } from 'react';

import { InventoryEmojiFragment, useInventoryEmojisQuery } from '../../../../gen';

gql`
  query InventoryEmojis($userId: ID) {
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
`;

interface Props {
  userId: string;
}

export function useInventoryEmojis({ userId }: Props): InventoryEmojiFragment[] {
  const client = useClient();

  const { data, refetch } = useInventoryEmojisQuery({
    variables: {
      userId,
    },
  });

  useEffect(() => {
    return client.NotificationService.notifications({
      onInventoryUpdate: () => refetch(),
    });
  }, [client.NotificationService, refetch]);

  return (
    data?.inventory?.items
      .map((item) => item.item.details)
      .filter(
        (item): item is InventoryEmojiFragment => item?.__typename === 'EmojiEmoji',
      ) ?? []
  );
}
