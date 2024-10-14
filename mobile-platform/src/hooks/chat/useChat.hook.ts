import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import { useLegacyChatChannelEvents } from '@noice-com/chat-react-core';
import { Nullable } from '@noice-com/utils';
import { useCallback, useState } from 'react';

import { AutomodState, ModerationMessageModel, MuteState } from './types/moderation';
import { useChatHistory } from './useChatHistory.hook';
import { useSendMessage } from './useSendMessage.hook';
import { useUserInventoryEmojis } from './useUserInventoryEmojis.hook';
import { parseEmojisFromMessage } from './utils/text-parsing';

import { useChatModerationStatusQuery } from '@gen/graphql';
import { useAuth } from '@hooks/useAuth.hook';

export const useChat = (chatId?: Nullable<string>, channelId?: string) => {
  const { userId } = useAuth();

  const [muteState, setMuteState] = useState<Nullable<MuteState>>(null);
  const [automodState, setAutomodState] = useState<Nullable<AutomodState>>(null);
  const [moderationMessages, setModerationMessages] = useState<ModerationMessageModel[]>(
    [],
  );

  const { emojis } = useUserInventoryEmojis();
  const { channelEventMessages } = useLegacyChatChannelEvents({ channelId });

  const { loading: loadingChatModerationStatus } = useChatModerationStatusQuery({
    ...variablesOrSkip({ chatId, userId }),
    onCompleted(chatModData) {
      if (chatModData.chatUserStatus) {
        setMuteState({
          startTime: chatModData.chatUserStatus.muteDuration ? Date.now() : null,
          muted: chatModData.chatUserStatus.muted,
          duration: chatModData.chatUserStatus.muteDuration
            ? parseInt(chatModData.chatUserStatus.muteDuration, 10)
            : null,
        });
      }
    },
  });

  const { messages, loading: loadingChatHistory } = useChatHistory({
    chatId,
    userId,
    channelId,
    onMuteState: setMuteState,
    onModerationMessage: (message) => {
      setModerationMessages((prev) => [...(prev || []), message]);
    },
  });

  const { mutateSendChatMessage } = useSendMessage({
    userId: userId,
    onAutomodState: setAutomodState,
    onModerationMessage: (message) => {
      setModerationMessages((prev) => [...(prev ?? []), message]);
    },
  });

  const sendMessage = useCallback(
    (content: string, consentToModeration?: boolean) => {
      if (!chatId) {
        return;
      }

      if (!content.trim().length) {
        return;
      }

      // Regex modified from: https://stackoverflow.com/a/28847388/544847
      const safeContent = content.replace(/&(?:#x[a-f0-9]+|#[0-9]+);?/gi, '').trim();

      const attachments = parseEmojisFromMessage(safeContent, emojis);

      mutateSendChatMessage({
        variables: {
          chatId,
          content: {
            text: safeContent,
            attachments,
          },
          consentToModeration: !!consentToModeration,
        },
      });
    },
    [chatId, emojis, mutateSendChatMessage],
  );

  const cancelModeratedMessage = () => {
    setAutomodState(null);
  };

  return {
    muteState,
    automodState,
    chatId,
    messages,
    moderationMessages,
    loading: loadingChatHistory || loadingChatModerationStatus,
    sendMessage,
    cancelModeratedMessage,
    channelEventMessages,
  };
};
