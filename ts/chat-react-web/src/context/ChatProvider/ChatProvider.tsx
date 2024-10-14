import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import {
  useChatMessages,
  useInventoryEmojis,
  MuteState,
  useChatChannelEvents,
  ChatMessageTextContentModel,
} from '@noice-com/chat-react-core';
import { useAuthenticatedUser } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react';

import { useChatAPIInternal } from '../ChatAPIProvider';

import {
  useBoosterRequestChatMessages,
  useModeratorMessages,
  useBlockedUserMessageDeletion,
  useUpdateOwnChatSenderInfo,
} from './hooks';

import { ChannelChannelRole, useChatProviderDataQuery } from '@chat-gen';

gql`
  query ChatProviderData($userId: ID!, $chatId: ID!, $channelId: ID!) {
    chatUserStatus(chatId: $chatId, userId: $userId) {
      muted
      muteDuration
    }

    userChannelRoles(userId: $userId, channelId: $channelId) {
      roles
    }

    profile(userId: $userId) {
      userId
      ...ChatMessagesHookProfile
    }
  }
`;

interface Context {
  channelId: Nullable<string>;
  streamChat: ReturnType<typeof useChatMessages>;
  groupChat: ReturnType<typeof useChatMessages>;
  streamChatModeratedMessageContent: Nullable<ChatMessageTextContentModel>;
  groupChatModeratedMessageContent: Nullable<ChatMessageTextContentModel>;
  muteState: Nullable<MuteState>;
  loadingUser: boolean;
  userChannelRoles: ChannelChannelRole[];
  cancelStreamModeratedMessage(fromGroupChat?: boolean): void;
  cancelGroupModeratedMessage(fromGroupChat?: boolean): void;
  onModerationAction(message: string, username: string): void;
}

const ChatContext = createContext<Nullable<Context>>(null);

interface Props {
  channelId: Nullable<string>;
  streamChatId: Nullable<string>;
  groupChatId?: string;
}

export function ChatProvider({
  children,
  channelId,
  streamChatId,
  groupChatId,
}: PropsWithChildren<Props>) {
  const { userId } = useAuthenticatedUser();

  const [streamChatModeratedMessageContent, setStreamChatModeratedMessageContent] =
    useState<Nullable<ChatMessageTextContentModel>>(null);
  const [groupChatModeratedMessageContent, setGroupChatModeratedMessageContent] =
    useState<Nullable<ChatMessageTextContentModel>>(null);
  const [muteState, setMuteState] = useState<Nullable<MuteState>>(null);

  const { loading: loadingUser, data } = useChatProviderDataQuery({
    ...variablesOrSkip({ userId, chatId: streamChatId, channelId }),
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

  const { emitAPIEvent } = useChatAPIInternal();
  const emojis = useInventoryEmojis({ userId });

  const streamChat = useChatMessages({
    chatId: streamChatId,
    channelId,
    userId,
    profile: data?.profile ?? null,
    emojis,
    onChatMessageModeration: setStreamChatModeratedMessageContent,
    onMuteStateChange: setMuteState,
  });

  const groupChat = useChatMessages({
    chatId: groupChatId ?? null,
    channelId,
    userId,
    profile: data?.profile ?? null,
    emojis,
    onChatMessageModeration: setGroupChatModeratedMessageContent,
    onMuteStateChange: setMuteState,
  });

  useBoosterRequestChatMessages({
    userId,
    addMessage: streamChat.addMessage,
    removeMessages: streamChat.removeMessages,
  });
  useChatChannelEvents({
    channelId,
    addMessage: streamChat.addMessage,
    removeMessages: streamChat.removeMessages,
  });
  useBlockedUserMessageDeletion({
    removeStreamMessages: streamChat.removeMessages,
    removeGroupMessages: groupChat.removeMessages,
  });
  const { onModerationAction } = useModeratorMessages({
    addMessage: streamChat.addMessage,
  });

  useUpdateOwnChatSenderInfo({
    userId,
    channelId,
    updateStreamChatSenderInto: streamChat.updateSenderInfo,
    updateGroupChatSenderInfo: groupChat.updateSenderInfo,
  });

  useEffect(() => {
    emitAPIEvent('onTeamChatMessagesAmountChange', groupChat.messages.length);
  }, [groupChat.messages.length, emitAPIEvent]);

  return (
    <ChatContext.Provider
      value={{
        channelId,
        streamChat,
        groupChat,
        streamChatModeratedMessageContent,
        groupChatModeratedMessageContent,
        muteState,
        loadingUser,
        userChannelRoles: data?.userChannelRoles?.roles ?? [],
        cancelStreamModeratedMessage: () => setStreamChatModeratedMessageContent(null),
        cancelGroupModeratedMessage: () => setGroupChatModeratedMessageContent(null),
        onModerationAction,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext(): Context {
  const context = useContext(ChatContext);

  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }

  return context;
}

interface ChatContentContext {
  messages: ReturnType<typeof useChatMessages>;
  moderatedMessageContent: Nullable<ChatMessageTextContentModel>;
  cancelModeratedMessage(): void;
}

export function useChat(type: 'stream' | 'group'): ChatContentContext {
  const {
    streamChat,
    streamChatModeratedMessageContent,
    groupChat,
    groupChatModeratedMessageContent,
    cancelStreamModeratedMessage,
    cancelGroupModeratedMessage,
  } = useChatContext();

  if (type === 'stream') {
    return {
      messages: streamChat,
      moderatedMessageContent: streamChatModeratedMessageContent,
      cancelModeratedMessage: cancelStreamModeratedMessage,
    };
  }

  return {
    messages: groupChat,
    moderatedMessageContent: groupChatModeratedMessageContent,
    cancelModeratedMessage: cancelGroupModeratedMessage,
  };
}
