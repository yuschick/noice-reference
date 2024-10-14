import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import {
  ChatMessageTextContentModel,
  MuteState,
  useChatChannelEvents,
  useChatMessages,
  useInventoryEmojis,
} from '@noice-com/chat-react-core';
import { makeLoggers, Nullable } from '@noice-com/utils';
import { createContext, PropsWithChildren, useContext, useState } from 'react';

import { useModeratorMessages } from './hooks/useModeratorMessages.hook';
import { useUpdateOwnChatSenderInfo } from './hooks/useUpdateOwnChatSenderInfo.hook';

import { ChannelChannelRole, useChatProviderDataQuery } from '@gen/graphql';
import { useAuth } from '@hooks/useAuth.hook';
import { useMountEffect } from '@hooks/useMountEffect.hook';

const { logInfo } = makeLoggers('ChatProvider');

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

/** @note we don't currently support group chat  */
interface Context {
  channelId: Nullable<string>;
  streamChat: ReturnType<typeof useChatMessages>;
  streamChatModeratedMessageContent: Nullable<ChatMessageTextContentModel>;
  muteState: Nullable<MuteState>;
  loadingUser: boolean;
  userChannelRoles: ChannelChannelRole[];
  cancelStreamModeratedMessage(fromGroupChat?: boolean): void;
  onModerationAction(message: string, username: string): void;
}

const ChatContext = createContext<Nullable<Context>>(null);

interface Props {
  channelId: Nullable<string>;
  streamChatId: Nullable<string>;
}

export function ChatProvider({
  children,
  channelId,
  streamChatId,
}: PropsWithChildren<Props>) {
  const { userId } = useAuth();
  const [streamChatModeratedMessageContent, setStreamChatModeratedMessageContent] =
    useState<Nullable<ChatMessageTextContentModel>>(null);
  const [muteState, setMuteState] = useState<Nullable<MuteState>>(null);

  const { loading: loadingUser, data } = useChatProviderDataQuery({
    ...variablesOrSkip({ userId, chatId: streamChatId, channelId }),
    onCompleted(result) {
      if (result.chatUserStatus) {
        setMuteState({
          startTime: result.chatUserStatus.muteDuration ? Date.now() : null,
          muted: result.chatUserStatus.muted,
          duration: result.chatUserStatus.muteDuration
            ? parseInt(result.chatUserStatus.muteDuration, 10)
            : null,
        });
      }
    },
  });

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

  useChatChannelEvents({
    channelId,
    ignoreTypes: ['avatar-item-purchase'],
    addMessage: streamChat.addMessage,
    removeMessages: streamChat.removeMessages,
  });

  useUpdateOwnChatSenderInfo({
    channelId,
    userId,
    updateStreamChatSenderInfo: streamChat.updateSenderInfo,
  });

  const { onModerationAction } = useModeratorMessages({
    addMessage: streamChat.addMessage,
  });

  useMountEffect(() => {
    logInfo('Rendering chat with new chat provider');
  });

  return (
    <ChatContext.Provider
      value={{
        streamChat,
        streamChatModeratedMessageContent,
        muteState,
        loadingUser,
        channelId,
        userChannelRoles: data?.userChannelRoles?.roles ?? [],
        cancelStreamModeratedMessage: () => setStreamChatModeratedMessageContent(null),
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
