import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import { Nullable } from '@noice-com/utils';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

import { StreamChatAutoModMessagePrompt } from './StreamChatAutoModMessagePrompt';
import { StreamChatInputBar, StreamChatInputBarRef } from './StreamChatInputBar';
import { StreamChatMessageList, StreamChatMessageListRef } from './StreamChatMessageList';
import { StreamChatMutedPrompt } from './StreamChatMutedPrompt';

import { useStreamChatViewQuery } from '@gen/graphql';
import { useChat } from '@hooks/chat/useChat.hook';
import { useAuth } from '@hooks/useAuth.hook';
import { MarketingTracking } from '@lib/MarketingTracking';

export interface StreamChatRef {
  hideExtraViews: () => void;
}

export interface Props {
  channelId: string;
  chatId: Nullable<string>;
  channelName: string;
}

gql`
  query StreamChatView($userId: ID!) {
    profile(userId: $userId) {
      userId
      userTag
    }
  }
`;

export const StreamChat = forwardRef(({ chatId, channelId, channelName }: Props, ref) => {
  const { userId } = useAuth();
  const chatListRef = useRef<StreamChatMessageListRef>();
  const { data, loading: loadingProfile } = useStreamChatViewQuery({
    ...variablesOrSkip({ userId }),
  });
  const {
    messages,
    sendMessage,
    loading: loadingChatMessages,
    automodState,
    moderationMessages,
    cancelModeratedMessage,
    muteState,
    channelEventMessages,
  } = useChat(chatId, channelId);
  const [chatMessage, setChatMessage] = useState<string>('');
  const [isMuted, setIsMuted] = useState(!!muteState?.muted);
  const [drawerHeight, setDrawerHeight] = useState(0);
  const chatInputRef = useRef<StreamChatInputBarRef>();

  const hideEmojiDrawer = () => {
    chatInputRef.current?.hideEmojiDrawer();
  };

  useEffect(() => {
    hideEmojiDrawer();

    if (!automodState) {
      return;
    }

    setChatMessage(automodState.messageContent.text);
  }, [automodState]);

  useEffect(() => {
    hideEmojiDrawer();
    setIsMuted(!!muteState?.muted);
  }, [muteState]);

  useImperativeHandle(ref, () => ({
    hideExtraViews: () => {
      hideEmojiDrawer();
    },
  }));

  const onSendMessage = (consentToModeration?: boolean) => {
    if (!chatMessage?.length) {
      return;
    }

    MarketingTracking.trackEvent('sent_chat_message');

    sendMessage(chatMessage, consentToModeration);

    // If consented to moderation we hide any current automod messages
    if (consentToModeration) {
      cancelModeratedMessage();
    }

    setChatMessage('');
    chatListRef.current?.scrollToBottom();
  };

  const onCancelModeratedMessage = () => {
    setChatMessage('');
    cancelModeratedMessage();
  };

  const onMuteEnded = () => {
    setIsMuted(false);
  };

  const sendAutomodMessage = () => {
    onSendMessage(true);
  };

  const isChatInputVisible = !automodState && !isMuted;
  const isMutedPromptVisible = !automodState && !!isMuted;

  return (
    <>
      {!loadingProfile && (
        <StreamChatMessageList
          bottomYOffset={isChatInputVisible ? drawerHeight : 0}
          channelEventMessages={channelEventMessages}
          channelId={channelId}
          channelName={channelName}
          loading={loadingChatMessages}
          messages={messages}
          moderationMessages={moderationMessages}
          ownUserTag={data?.profile?.userTag ?? ''}
          ref={chatListRef}
          onTouchEnd={hideEmojiDrawer}
        />
      )}
      {automodState && (
        <StreamChatAutoModMessagePrompt
          message={automodState.messageContent}
          onCancel={onCancelModeratedMessage}
          onSend={sendAutomodMessage}
        />
      )}
      {isMutedPromptVisible && (
        <StreamChatMutedPrompt
          muteState={muteState}
          onMuteEnded={onMuteEnded}
        />
      )}
      {isChatInputVisible && (
        <StreamChatInputBar
          automodState={automodState}
          message={chatMessage}
          ref={chatInputRef}
          onCancelModeratedMessage={cancelModeratedMessage}
          onDrawerLayoutChanged={setDrawerHeight}
          onMessageChange={setChatMessage}
          onSend={onSendMessage}
        />
      )}
    </>
  );
});
