"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useChat = void 0;
const client_1 = require("@apollo/client");
const apollo_client_utils_1 = require("@noice-com/apollo-client-utils");
const common_ui_1 = require("@noice-com/common-ui");
const chat_pb_1 = require("@noice-com/schemas/chat/chat.pb");
const react_1 = require("react");
const useChatChannelEvents_hook_1 = require("./useChatChannelEvents.hook");
const useUserInventoryEmojis_hook_1 = require("./useUserInventoryEmojis.hook");
const _chat_gen_1 = require("@chat-gen");
const _chat_types_1 = require("@chat-types");
const _chat_utils_1 = require("@chat-utils");
const CHAT_MESSAGE_CAP = 150;
(0, client_1.gql) `
  query ChatModerationStatus($chatId: ID!, $userId: ID!) {
    chatUserStatus(chatId: $chatId, userId: $userId) {
      muted
      muteDuration
    }
  }
`;
(0, client_1.gql) `
  fragment ChatMessageWithSender on ChatChatMessage {
    ...ChatMessage
    sender {
      ...ChatMessageSenderProfile
    }
  }

  fragment ChatMessage on ChatChatMessage {
    senderId
    chatId
    state
    messageId
    createdAt
    moderationStatus
    content {
      content {
        ... on ChatTextMessage {
          text
          attachments {
            ...UseChatEmojisAndMentionsAttachment
          }
        }
        ... on ChatTombstone {
          emptyTypeWorkaround
        }
      }
    }
  }

  fragment ChatMessageSenderProfile on ProfileProfile {
    userId
    userTag
    avatars {
      avatar2D
    }
    ...ProfileImageProfile
  }
`;
(0, client_1.gql) `
  query ChatHistory($chatId: ID!, $channelId: ID, $cursor: APICursorInput) {
    chatMessages(chatId: $chatId, cursor: $cursor) {
      messages {
        ... on ChatChatMessage {
          ...ChatMessageWithSender
          sender {
            badges(channel_id: $channelId) {
              ...UserBadge
            }
          }
        }
      }
    }
  }
`;
(0, client_1.gql) `
  subscription ChatSubscription($chatId: ID!) {
    chatMessageSubscribe(chatId: $chatId) {
      event {
        ... on ChatChatMessage {
          ...ChatMessage
        }
        ... on ChatHideMessage {
          messageId
        }
        ... on ChatUserMuted {
          userId
          duration
        }
        ... on ChatUserBanned {
          userId
        }
        ... on ChatMessageDenied {
          userId
        }
      }
    }
  }
`;
(0, client_1.gql) `
  mutation SendChatMessage(
    $chatId: ID!
    $content: ChatTextMessageInput!
    $consentToModeration: Boolean
  ) {
    sendChatMessage(
      chatId: $chatId
      content: { textContent: $content }
      consentToModeration: $consentToModeration
    ) {
      emptyTypeWorkaround
    }
  }
`;
function useChat(chatId, channelId) {
    var _a, _b;
    const [muteState, setMuteState] = (0, react_1.useState)(null);
    const [automodState, setAutomodState] = (0, react_1.useState)(null);
    const [moderationMessages, setAutomodStatusMessages] = (0, react_1.useState)([]);
    const variables = {
        chatId: chatId,
        channelId,
        cursor: { last: 100 },
    };
    const { channelEventMessages } = (0, useChatChannelEvents_hook_1.useChatChannelEvents)({ channelId });
    const { userId } = (0, common_ui_1.useAuthenticatedUser)();
    const { loading: loadingChatModerationStatus } = (0, _chat_gen_1.useChatModerationStatusQuery)({
        variables: {
            chatId: chatId,
            userId,
        },
        skip: !chatId,
        onCompleted(data) {
            if (data.chatUserStatus) {
                setMuteState({
                    startTime: data.chatUserStatus.muteDuration ? Date.now() : null,
                    muted: data.chatUserStatus.muted,
                    duration: data.chatUserStatus.muteDuration
                        ? parseInt(data.chatUserStatus.muteDuration, 10)
                        : null,
                });
            }
        },
    });
    const { data, loading, refetch } = (0, _chat_gen_1.useChatHistoryQuery)({
        variables,
        skip: !chatId,
        fetchPolicy: 'cache-and-network',
    });
    (0, apollo_client_utils_1.useRestartingSubscription)(_chat_gen_1.ChatSubscriptionDocument, {
        variables: {
            chatId: chatId,
        },
        skip: !chatId,
        onData({ client: { cache }, data }) {
            var _a, _b;
            const event = (_b = (_a = data.data) === null || _a === void 0 ? void 0 : _a.chatMessageSubscribe) === null || _b === void 0 ? void 0 : _b.event;
            if (!(event === null || event === void 0 ? void 0 : event.__typename)) {
                return;
            }
            if (event.__typename === 'ChatChatDetails') {
                return;
            }
            if (event.__typename === 'ChatMessageDenied') {
                if (event.userId === userId) {
                    const now = new Date();
                    const id = now.getTime().toString();
                    setAutomodStatusMessages((prev) => [
                        ...(prev || []),
                        {
                            id,
                            type: 'moderation',
                            content: {
                                id: userId,
                                status: _chat_types_1.ModerationMessageStatus.AutomodDenied,
                            },
                            time: now,
                        },
                    ]);
                }
                return;
            }
            if (event.__typename === 'ChatUserMuted') {
                if (event.userId === userId) {
                    setMuteState({
                        startTime: Date.now(),
                        muted: true,
                        duration: event.duration ? parseInt(event.duration, 10) : null,
                    });
                }
                return;
            }
            if (event.__typename === 'ChatHideMessage') {
                cache.updateQuery({
                    query: _chat_gen_1.ChatHistoryDocument,
                    variables,
                }, (data) => {
                    var _a, _b, _c, _d;
                    if (!((_b = (_a = data === null || data === void 0 ? void 0 : data.chatMessages) === null || _a === void 0 ? void 0 : _a.messages) === null || _b === void 0 ? void 0 : _b.length)) {
                        return data;
                    }
                    const copy = Object.assign({}, data, {
                        chatMessages: {
                            messages: [...((_d = (_c = data.chatMessages) === null || _c === void 0 ? void 0 : _c.messages) !== null && _d !== void 0 ? _d : [])],
                        },
                    });
                    for (let i = copy.chatMessages.messages.length - 1; i >= 0; i--) {
                        if (copy.chatMessages.messages[i].messageId === event.messageId) {
                            copy.chatMessages.messages[i] = Object.assign({}, copy.chatMessages.messages[i], {
                                content: {
                                    // eslint-disable-next-line @typescript-eslint/naming-convention
                                    content: { __typename: 'ChatTombstone', emptyTypeWorkaround: true },
                                },
                            });
                            break;
                        }
                    }
                    return copy;
                });
                return;
            }
            // Remove all user messages when they are banned
            if (event.__typename === 'ChatUserBanned') {
                cache.updateQuery({
                    query: _chat_gen_1.ChatHistoryDocument,
                    variables,
                }, (data) => {
                    var _a, _b, _c, _d;
                    if (!((_b = (_a = data === null || data === void 0 ? void 0 : data.chatMessages) === null || _a === void 0 ? void 0 : _a.messages) === null || _b === void 0 ? void 0 : _b.length)) {
                        return data;
                    }
                    const copy = Object.assign({}, data, {
                        chatMessages: {
                            messages: [...((_d = (_c = data.chatMessages) === null || _c === void 0 ? void 0 : _c.messages) !== null && _d !== void 0 ? _d : [])],
                        },
                    });
                    for (let i = copy.chatMessages.messages.length - 1; i >= 0; i--) {
                        if (copy.chatMessages.messages[i].senderId === event.userId) {
                            copy.chatMessages.messages[i] = Object.assign({}, copy.chatMessages.messages[i], {
                                content: {
                                    // eslint-disable-next-line @typescript-eslint/naming-convention
                                    content: { __typename: 'ChatTombstone', emptyTypeWorkaround: true },
                                },
                            });
                        }
                    }
                    return copy;
                });
                return;
            }
            if (event.__typename === 'ChatChatMessage') {
                cache.updateQuery({
                    query: _chat_gen_1.ChatHistoryDocument,
                    variables,
                }, (data) => {
                    var _a, _b;
                    return Object.assign({}, data, {
                        chatMessages: {
                            messages: [
                                ...((_b = (_a = data === null || data === void 0 ? void 0 : data.chatMessages) === null || _a === void 0 ? void 0 : _a.messages.slice(-1 * CHAT_MESSAGE_CAP)) !== null && _b !== void 0 ? _b : []),
                                Object.assign(Object.assign({}, event), { 
                                    // Add sender id and empty badges so Apollo is happy with sender and *do not* start refetching
                                    sender: {
                                        id: event.senderId,
                                        badges: [],
                                    } }),
                            ],
                        },
                    });
                });
                return;
            }
        },
        onComplete() {
            // Refetch history when server closes subscription in case we missed some
            // messages when the subscription was down.
            refetch();
        },
    });
    const { emojis } = (0, useUserInventoryEmojis_hook_1.useUserInventoryEmojis)();
    const [sendChatMessage] = (0, _chat_gen_1.useSendChatMessageMutation)({
        onError(error, clientOptions) {
            const variables = clientOptions === null || clientOptions === void 0 ? void 0 : clientOptions.variables;
            if (!variables) {
                return;
            }
            if (!variables.content) {
                return;
            }
            if (error.graphQLErrors.find((e) => common_ui_1.CommonUtils.hasPlatformErrorCause(e, chat_pb_1.ContentValidationErrorDetailsCause.CAUSE_REQUIRES_MODERATION))) {
                setAutomodState({ messageContent: variables.content });
                return;
            }
            if (error.graphQLErrors.find((e) => common_ui_1.CommonUtils.hasPlatformErrorCause(e, chat_pb_1.ContentValidationErrorDetailsCause.CAUSE_GUIDELINES_VIOLATION))) {
                const now = new Date();
                const id = now.getTime().toString();
                setAutomodStatusMessages((prev) => [
                    ...(prev || []),
                    {
                        id,
                        type: 'moderation',
                        content: {
                            id: userId,
                            status: _chat_types_1.ModerationMessageStatus.AutomodBlocked,
                        },
                        time: now,
                    },
                ]);
                return;
            }
        },
        onCompleted(_data, clientOptions) {
            const variables = clientOptions === null || clientOptions === void 0 ? void 0 : clientOptions.variables;
            if (!variables) {
                return;
            }
            if (variables.consentToModeration) {
                const now = new Date();
                const id = now.getTime().toString();
                setAutomodStatusMessages((prev) => [
                    ...(prev || []),
                    {
                        id,
                        type: 'moderation',
                        content: {
                            id: userId,
                            status: _chat_types_1.ModerationMessageStatus.AutomodPending,
                        },
                        time: now,
                    },
                ]);
            }
            setAutomodState(null);
        },
    });
    const sendMessage = (0, react_1.useCallback)((content, consentToModeration) => {
        if (!chatId) {
            return;
        }
        if (!content.trim().length) {
            return;
        }
        // Regex modified from: https://stackoverflow.com/a/28847388/544847
        const safeContent = content.replace(/&(?:#x[a-f0-9]+|#[0-9]+);?/gi, '').trim();
        const attachments = (0, _chat_utils_1.parseEmojisFromMessage)(safeContent, emojis);
        sendChatMessage({
            variables: {
                chatId,
                content: {
                    text: safeContent,
                    attachments,
                },
                consentToModeration: !!consentToModeration,
            },
        });
    }, [sendChatMessage, chatId, emojis]);
    const cancelModeratedMessage = () => {
        setAutomodState(null);
    };
    return {
        automodState,
        cancelModeratedMessage,
        channelEventMessages,
        chatId,
        loading: loading || loadingChatModerationStatus,
        messages: (_b = (_a = data === null || data === void 0 ? void 0 : data.chatMessages) === null || _a === void 0 ? void 0 : _a.messages) !== null && _b !== void 0 ? _b : [],
        moderationMessages,
        muteState,
        sendMessage,
    };
}
exports.useChat = useChat;
//# sourceMappingURL=useChat.hook.js.map