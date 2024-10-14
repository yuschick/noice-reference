import { gql } from '@apollo/client';
import { useRestartingSubscription } from '@noice-com/apollo-client-utils';
import { useMountEffect } from '@noice-com/common-react-core';
import { useCallback, useState } from 'react';

import {
  AutomodQueueChatModerationItemFragment,
  AutomodQueueDocument,
  AutomodQueueSubscription,
  AutomodQueueSubscriptionVariables,
  ChatAutoModQueueEventAdd,
  ChatAutoModQueueEventRemove,
  ChatAutoModQueueEventUpdate,
} from '@gen';

gql`
  subscription AutomodQueue($chatId: ID!) {
    chatAutoModQueueSubscribe(chatId: $chatId) {
      event {
        ... on ChatAutoModQueueEventRemove {
          id
        }
        ... on ChatAutoModQueueEventUpdate {
          item {
            ...AutomodQueueChatModerationItem
          }
        }
        ... on ChatAutoModQueueEventAdd {
          item {
            ...AutomodQueueChatModerationItem
          }
        }
      }
    }
  }
`;

const DEFAULT_CLEAR_TIMEOUT_MS = 5000;
type CleanupTimeoutMap = Record<string, ReturnType<typeof setTimeout>>;

export function useChatModerationItems(chatId: string) {
  const [chatModerationItems, setChatModerationItems] = useState<
    AutomodQueueChatModerationItemFragment[]
  >([]);
  const [cleanupTimeoutIds, setCleanupTimeoutIds] = useState<CleanupTimeoutMap>({});

  const { loading } = useRestartingSubscription<
    AutomodQueueSubscription,
    AutomodQueueSubscriptionVariables
  >(AutomodQueueDocument, {
    variables: { chatId },
    skip: !chatId,
    onData: ({ data: { data } }) => {
      const event = data?.chatAutoModQueueSubscribe?.event;

      if (!event?.__typename) {
        return;
      }

      if (event.__typename === 'ChatAutoModQueueEventAdd') {
        setChatModerationItems((previousStreamEvents) => [
          ...previousStreamEvents,
          (event as ChatAutoModQueueEventAdd).item,
        ]);
      }

      if (event.__typename === 'ChatAutoModQueueEventUpdate') {
        setChatModerationItems((previousStreamEvents) => {
          const updatedModerationItemIndex = previousStreamEvents.findIndex(
            ({ id }) => id === (event as ChatAutoModQueueEventUpdate).item.id,
          );

          const updatedModerationItem = {
            ...previousStreamEvents[updatedModerationItemIndex],
            status: event.item.status,
            expired: event.item.expired,
            reviewer: event.item.reviewer,
          };

          return [
            ...previousStreamEvents.slice(0, updatedModerationItemIndex),
            updatedModerationItem,
            ...previousStreamEvents.slice(updatedModerationItemIndex + 1),
          ];
        });
      }

      if (event.__typename === 'ChatAutoModQueueEventRemove') {
        // schedule automatic item deletion after DEFAULT_CLEAR_TIMEOUT_MS
        setCleanupTimeoutIds((previousTimeouts) => ({
          ...previousTimeouts,
          [(event as ChatAutoModQueueEventRemove).id]: setTimeout(
            deleteItem,
            DEFAULT_CLEAR_TIMEOUT_MS,
            (event as ChatAutoModQueueEventRemove).id,
          ),
        }));
      }
    },
  });

  useMountEffect(() => {
    return () => {
      Object.values(cleanupTimeoutIds).forEach((id) => clearTimeout(id));
    };
  });

  const deleteItem = useCallback((targetId: string) => {
    setChatModerationItems((previousStreamEvents) => {
      const removedModerationItemIndex = previousStreamEvents.findIndex(
        ({ id }) => id === targetId,
      );

      if (removedModerationItemIndex === -1) {
        return previousStreamEvents;
      }

      return [
        ...previousStreamEvents.slice(0, removedModerationItemIndex),
        ...previousStreamEvents.slice(removedModerationItemIndex + 1),
      ];
    });

    setCleanupTimeoutIds((previousTimeouts) => {
      if (previousTimeouts[targetId]) {
        clearTimeout(previousTimeouts[targetId]);
        delete previousTimeouts[targetId];
        return { ...previousTimeouts };
      }

      return previousTimeouts;
    });
  }, []);

  return {
    items: chatModerationItems,
    loading,
    deleteItem,
  };
}
