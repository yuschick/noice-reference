import {
  useRestartingSubscription,
  variablesOrSkip,
} from '@noice-com/apollo-client-utils';
import { Nullable } from '@noice-com/utils';

import {
  ModerationMessageModel,
  ModerationMessageStatus,
  MuteState,
} from './types/moderation';

import {
  ChatHistoryDocument,
  ChatSubscriptionDocument,
  ChatSubscriptionSubscription,
  ChatSubscriptionSubscriptionVariables,
  useChatHistoryQuery,
} from '@gen/graphql';
import { useAppState } from '@hooks/useAppState.hook';

interface Props {
  chatId?: Nullable<string>;
  channelId?: Nullable<string>;
  userId?: Nullable<string>;
  onMuteState: (state: MuteState) => void;
  onModerationMessage: (message: ModerationMessageModel) => void;
}

const CHAT_MESSAGE_CAP = 150;

export const useChatHistory = ({
  chatId,
  userId,
  channelId,
  onMuteState,
  onModerationMessage,
}: Props) => {
  const { data, loading, refetch } = useChatHistoryQuery({
    ...variablesOrSkip({ chatId, channelId, cursor: { last: 100 } }),
    fetchPolicy: 'cache-and-network',
  });

  const { manuallyResetSubscription } = useRestartingSubscription<
    ChatSubscriptionSubscription,
    ChatSubscriptionSubscriptionVariables
  >(ChatSubscriptionDocument, {
    ...variablesOrSkip({ chatId }),
    onData({ client: { cache }, data: newData }) {
      const now = new Date();
      const event = newData.data?.chatMessageSubscribe?.event;

      if (!event?.__typename || event.__typename === 'ChatChatDetails') {
        return;
      }

      if (event.__typename === 'ChatMessageDenied') {
        if (event.userId === userId) {
          const id = now.getTime().toString();
          onModerationMessage({
            id,
            type: 'moderation',
            content: {
              id: userId,
              status: ModerationMessageStatus.AutomodDenied,
            },
            time: now,
          });
        }

        return;
      }

      if (event.__typename === 'ChatUserMuted') {
        if (userId === event.userId) {
          onMuteState({
            startTime: now.getTime(),
            muted: true,
            duration: event.duration ? parseInt(event.duration, 10) : null,
          });
        }

        return;
      }

      if (event.__typename === 'ChatHideMessage') {
        cache.updateQuery(
          {
            query: ChatHistoryDocument,
            variables: {
              chatId,
              channelId,
            },
          },
          (prev) => {
            if (!prev.chatMessages?.messages?.length) {
              return prev;
            }

            const copy = {
              ...prev,
              chatMessages: {
                messages: [...(prev.chatMessages?.messages ?? [])],
              },
            };

            for (let i = copy.chatMessages.messages.length - 1; i >= 0; i--) {
              if (copy.chatMessages.messages[i].messageId === event.messageId) {
                copy.chatMessages.messages[i] = {
                  ...copy.chatMessages.messages[i],
                  content: {
                    content: { __typename: 'ChatTombstone', emptyTypeWorkaround: true },
                  },
                };
                break;
              }
            }

            return copy;
          },
        );

        return;
      }

      // Remove all user messages when they are banned
      if (event.__typename === 'ChatUserBanned') {
        cache.updateQuery(
          {
            query: ChatHistoryDocument,
            variables: {
              chatId,
              channelId,
            },
          },
          (prev) => {
            if (!prev.chatMessages?.messages?.length) {
              return prev;
            }

            const copy = {
              ...prev,
              chatMessages: {
                messages: [...(prev.chatMessages?.messages ?? [])],
              },
            };

            for (let i = copy.chatMessages.messages.length - 1; i >= 0; i--) {
              if (copy.chatMessages.messages[i].senderId === event.userId) {
                copy.chatMessages.messages[i] = {
                  ...copy.chatMessages.messages[i],
                  content: {
                    content: { __typename: 'ChatTombstone', emptyTypeWorkaround: true },
                  },
                };
              }
            }

            return copy;
          },
        );

        return;
      }

      if (event.__typename === 'ChatChatMessage') {
        cache.updateQuery(
          {
            query: ChatHistoryDocument,
            variables: {
              chatId,
              channelId,
            },
          },
          (prev) => {
            return Object.assign({}, prev, {
              chatMessages: {
                messages: [
                  ...(prev.chatMessages?.messages.slice(-1 * CHAT_MESSAGE_CAP) ?? []),
                  {
                    ...event,
                    // Add sender id and empty badges so Apollo is happy with sender and *do not* start refetching
                    // Note: sender data is fetched in render component with cached query
                    sender: {
                      id: event.senderId,
                      badges: [],
                    },
                  },
                ],
              },
            });
          },
        );

        return;
      }
    },
    onComplete() {
      // Refetch history when server closes subscription in case we missed some
      // messages when the subscription was down.
      refetch();
    },
  });

  useAppState({
    onEnterForeground: manuallyResetSubscription,
  });

  return {
    messages: data?.chatMessages?.messages ?? [],
    loading,
  };
};
