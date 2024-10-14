import { gql, useApolloClient } from '@apollo/client';
import { getFieldsVariables } from '@noice-com/apollo-client-utils';
import { useClient } from '@noice-com/common-react-core';
import { PageInfo } from '@noice-com/schemas/api/cursor.pb';
import { EntityState } from '@noice-com/schemas/api/entity.pb';
import {
  ChatMessage,
  HideMessage,
  MessageDenied,
  UserBanned,
  UserMuted,
  UserUnmuted,
} from '@noice-com/schemas/chat/chat.pb';
import { Nullable } from '@noice-com/utils';
import { useCallback, useEffect, useRef, useState } from 'react';

import {
  InventoryEmojiFragment,
  ChatMessagesHookProfileFragment,
  ProfileProfileBadgesArgs,
} from '../../../../gen';
import {
  ChatMessageTextContentModel,
  ChatSenderInfoModel,
  transformChatMessageBadgeToUserBadge,
  transformProtoChatMessageToChatMessageModel,
  transformProtoColorToGraphqlColor,
} from '../../chat-message';
import { ModerationMessageStatus, MuteState } from '../../moderation';
import { ChatItemModel, UpdateCapArguments } from '../types';

import { useChatMessagesConnection } from './useChatMessagesConnection.hook';
import { useSendChatMessage } from './useSendChatMessage.hook';

gql`
  fragment ChatMessagesHookProfile on ProfileProfile {
    ...SendChatMessageProfile
  }
`;

interface HookResult {
  chatId: Nullable<string>;
  messages: ChatItemModel[];
  loading: boolean;
  addMessage(message: ChatItemModel): void;
  removeMessages<T extends ChatItemModel = ChatItemModel>(
    type: T['chatItemType'],
    filter?: (message: T) => boolean,
  ): void;
  sendMessage(content: string, consentToModeration?: boolean): void;
  updateSenderInfo(userId: string, senderInfo: Partial<ChatSenderInfoModel>): void;
  loadOlderMessages(): Promise<void>;
  updateCap(args: UpdateCapArguments): void;
}

interface Props {
  chatId: Nullable<string>;
  channelId: Nullable<string>;
  userId: string;
  profile: Nullable<ChatMessagesHookProfileFragment>;
  emojis: InventoryEmojiFragment[];
  onMuteStateChange(muteState: Nullable<MuteState>): void;
  onChatMessageModeration(message: Nullable<ChatMessageTextContentModel>): void;
}

const DEFAULT_MESSAGE_CAP = 25;

export function useChatMessages({
  chatId,
  channelId,
  userId,
  profile,
  emojis,
  onMuteStateChange,
  onChatMessageModeration,
}: Props): HookResult {
  const client = useClient();
  const { cache } = useApolloClient();
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatItemModel[]>([]);
  const [pageInfo, setPageInfo] = useState<Nullable<PageInfo>>(null);
  const [fetchingOlderMessages, setFetchingOlderMessages] = useState(false);

  const tempIdToMessageIdMap = useRef(new Map<string, string>());
  const messageCap = useRef(DEFAULT_MESSAGE_CAP);

  useEffect(() => {
    // Reset chat messages when chatId changes
    setMessages([]);
  }, [chatId]);

  const historyFetch = useRef(false);

  const getAndAddLatestMessages = useCallback(
    async (chatId: string, amount: number) => {
      const { messages, pageInfo } = await client.ChatService.listChatMessages({
        chatId,
        cursor: { last: amount },
      });

      setPageInfo(pageInfo ?? null);

      setMessages((prev) => {
        // If no previous messages, return the new messages
        if (!prev.length) {
          return messages?.map(transformProtoChatMessageToChatMessageModel) ?? [];
        }

        // If no new messages, return the previous messages
        if (!messages?.length) {
          return prev;
        }

        // Filter out messages that are already in the list
        const newMessages = messages
          .filter((message) => {
            return !prev.some((prevMessage) => {
              if (prevMessage.chatItemType !== 'ChatMessage') {
                return false;
              }

              return prevMessage.messageId === message.messageId;
            });
          })
          .map(transformProtoChatMessageToChatMessageModel);

        // Return the previous messages with the new messages appended
        return [...prev, ...newMessages];
      });
    },
    [client.ChatService],
  );

  useEffect(() => {
    if (!chatId) {
      return;
    }

    const fetchMessages = async () => {
      setLoading(true);

      await getAndAddLatestMessages(chatId, DEFAULT_MESSAGE_CAP);
      setLoading(false);
      historyFetch.current = true;
    };

    fetchMessages();
  }, [chatId, getAndAddLatestMessages]);

  const updateCap = useCallback(({ newCap, increaseCap }: UpdateCapArguments) => {
    if (newCap) {
      messageCap.current = newCap;
      return;
    }

    if (increaseCap) {
      messageCap.current += increaseCap;
    }
  }, []);

  const addMessage = useCallback((message: ChatItemModel) => {
    setMessages((prevMessages) => {
      // If new message is not a chat message or it is temp message, just add it to the list
      if (message.chatItemType !== 'ChatMessage' || message.isTemporaryMessage) {
        return [...prevMessages.slice(-1 * messageCap.current), message];
      }

      let replaceTempMessage = false;

      const slicedPrevMessages = prevMessages
        // Get the last messages by messages cap
        .slice(-1 * messageCap.current)
        .map((prevMessage) => {
          // If the previous message is not a chat message, return message as is
          if (prevMessage.chatItemType !== 'ChatMessage') {
            return prevMessage;
          }

          // If the previous message is not from the same sender, return message as is
          if (prevMessage.senderId !== message.senderId) {
            return prevMessage;
          }

          // If the previous message is temporary message, start check
          if (prevMessage.isTemporaryMessage) {
            // If there is same id in the map, just replace that message with the new one
            if (
              tempIdToMessageIdMap.current.get(prevMessage.messageId) ===
              message.messageId
            ) {
              replaceTempMessage = true;
              tempIdToMessageIdMap.current.delete(prevMessage.messageId);

              // Replace temp message with the new message
              return message;
            }

            // If the previous message is in map without the id and from same user,
            // replace the temp message with the new message (most likely the id is not set yet)
            if (
              tempIdToMessageIdMap.current.get(prevMessage.messageId) === '' &&
              prevMessage.senderId === message.senderId
            ) {
              replaceTempMessage = true;
              tempIdToMessageIdMap.current.delete(prevMessage.messageId);

              // Replace temp message with the new message
              return message;
            }
          }

          // If the previous message is from the same sender, update the sender info
          return Object.assign({}, prevMessage, {
            senderInfo: message.senderInfo,
          });
        });

      // If we just replaced a temp message, return the list
      if (replaceTempMessage) {
        return slicedPrevMessages;
      }

      return [...slicedPrevMessages, message];
    });
  }, []);

  const removeMessages = useCallback(
    <T extends ChatItemModel = ChatItemModel>(
      type: T['chatItemType'],
      filter?: (message: T) => boolean,
    ) => {
      setMessages((prevMessages) =>
        prevMessages.filter((message) => {
          if (message.chatItemType !== type) {
            return true;
          }

          if (filter) {
            return !filter(message as T);
          }

          return false;
        }),
      );
    },
    [],
  );

  const onTempMessageSendFail = (messageId: string) => {
    setMessages((prevMessages) =>
      prevMessages.map((message) => {
        if (message.chatItemType !== 'ChatMessage') {
          return message;
        }

        if (message.messageId !== messageId) {
          return message;
        }

        return Object.assign({}, message, {
          hasFailedToSend: true,
        });
      }),
    );
  };

  const addTempMessage = useCallback(
    (message: ChatItemModel) => {
      if (message.chatItemType === 'ChatMessage' && message.isTemporaryMessage) {
        tempIdToMessageIdMap.current.set(message.messageId, '');
      }

      addMessage(message);
    },
    [addMessage],
  );

  const storeTempMessageRealMessageId = (tempMessageId: string, messageId: string) => {
    tempIdToMessageIdMap.current.set(tempMessageId, messageId);
  };

  const { sendMessage } = useSendChatMessage({
    addMessage: addTempMessage,
    storeTempMessageRealMessageId,
    chatId,
    emojis,
    onChatMessageModeration,
    onTempMessageSendFail,
    profile,
    removeMessages,
    userId,
  });

  const updateSenderInfo = useCallback(
    (userId: string, senderInfo: ChatSenderInfoModel) => {
      setMessages((prevMessages) =>
        prevMessages.map((message) => {
          if (message.chatItemType !== 'ChatMessage') {
            return message;
          }

          if (message.senderId !== userId) {
            return message;
          }

          return Object.assign({}, message, {
            senderInfo: {
              ...message.senderInfo,
              ...senderInfo,
            },
          });
        }),
      );
    },
    [],
  );

  const loadOlderMessages = useCallback(async () => {
    if (fetchingOlderMessages || !chatId || !pageInfo?.hasPreviousPage) {
      return;
    }

    // Get the missing messages amount
    const amount = messageCap.current - messages.length;

    // If the amount is less than or equal to 0, do nothing
    if (amount <= 0) {
      return;
    }

    setFetchingOlderMessages(true);

    const { messages: newMessages, pageInfo: newPageInfo } =
      await client.ChatService.listChatMessages({
        chatId,
        cursor: { before: pageInfo?.startCursor, last: Math.min(amount, 100) },
      });

    setPageInfo(newPageInfo ?? null);

    setMessages((prevMessages) => [
      ...(newMessages
        // Filter out messages that are already in the list
        ?.filter((message) => {
          return !prevMessages.some((prevMessage) => {
            if (prevMessage.chatItemType !== 'ChatMessage') {
              return false;
            }

            return prevMessage.messageId === message.messageId;
          });
        })
        ?.map(transformProtoChatMessageToChatMessageModel) ?? []),
      ...prevMessages,
    ]);

    setFetchingOlderMessages(false);
  }, [
    chatId,
    client.ChatService,
    fetchingOlderMessages,
    messageCap,
    messages.length,
    pageInfo?.hasPreviousPage,
    pageInfo?.startCursor,
  ]);

  const onHideMessage = useCallback((event: HideMessage) => {
    setMessages((prevMessages) =>
      prevMessages.map((message) => {
        if (message.chatItemType !== 'ChatMessage') {
          return message;
        }

        if (message.messageId !== event.messageId) {
          return message;
        }

        return Object.assign({}, message, {
          state: EntityState.ENTITY_STATE_BLOCKED,
        });
      }),
    );
  }, []);

  const onMessage = useCallback(
    (event: ChatMessage) => {
      addMessage(transformProtoChatMessageToChatMessageModel(event));

      if (event.senderInfo) {
        const { userId, preferredColor, username, avatar2D, badges } = event.senderInfo;

        cache.modify({
          id: cache.identify({ __typename: 'ProfileProfile', userId }),
          fields: {
            userTag() {
              return username;
            },
            preferredColor() {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              return transformProtoColorToGraphqlColor(preferredColor!);
            },
            avatars(existing) {
              if (existing.avatar2D === avatar2D) {
                return existing;
              }

              return {
                avatar2D,
              };
            },
            badges(existing, { storeFieldName, fieldName }) {
              if (!badges?.length) {
                return existing;
              }

              const { channel_id: badgesChannelId } =
                getFieldsVariables<ProfileProfileBadgesArgs>(storeFieldName, fieldName);

              if (badgesChannelId !== channelId) {
                return existing;
              }

              return (
                badges
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  .map((badge) => ({ level: badge.level!, type: badge.type! }))
                  .map(transformChatMessageBadgeToUserBadge)
              );
            },
          },
        });
      }
    },
    [addMessage, cache, channelId],
  );

  const onMessageDenied = useCallback(
    (event: MessageDenied) => {
      if (event.userId !== userId) {
        return;
      }

      addMessage({
        chatItemType: 'ModerationMessage',
        id: new Date().getTime().toString(),
        userId: event.userId,
        status: ModerationMessageStatus.AutomodDenied,
      });
    },
    [addMessage, userId],
  );

  const onUserBanned = useCallback((event: UserBanned) => {
    setMessages((prevMessages) =>
      prevMessages.map((message) => {
        if (message.chatItemType !== 'ChatMessage') {
          return message;
        }

        if (message.senderId !== event.userId) {
          return message;
        }

        return Object.assign({}, message, {
          state: EntityState.ENTITY_STATE_BLOCKED,
        });
      }),
    );
  }, []);

  const onUserMuted = useCallback(
    (event: UserMuted) => {
      if (event.userId !== userId) {
        return;
      }

      onMuteStateChange({
        startTime: Date.now(),
        muted: true,
        duration: event.duration ? parseInt(event.duration, 10) : null,
      });
    },
    [onMuteStateChange, userId],
  );

  const onUserUnmuted = useCallback(
    (event: UserUnmuted) => {
      if (event.userId === userId) {
        onMuteStateChange(null);
      }
    },
    [onMuteStateChange, userId],
  );

  const onReconnection = useCallback(() => {
    if (!historyFetch.current || !chatId) {
      return;
    }

    getAndAddLatestMessages(chatId, 10);
  }, [chatId, getAndAddLatestMessages]);

  useChatMessagesConnection({
    chatId,
    onHideMessage,
    onMessage,
    onMessageDenied,
    onUserBanned,
    onUserMuted,
    onUserUnmuted,
    onReconnection,
  });

  return {
    chatId,
    messages,
    loading,
    addMessage,
    removeMessages,
    sendMessage,
    updateSenderInfo,
    loadOlderMessages,
    updateCap,
  };
}
