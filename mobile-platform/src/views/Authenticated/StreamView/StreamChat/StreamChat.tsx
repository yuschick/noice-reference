import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import { Nullable } from '@noice-com/utils';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import Animated, { useAnimatedKeyboard, useAnimatedStyle } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useChatMuteTimer } from './hooks/useChatMuteTimer.hook';
import { StreamChatAutoModMessagePrompt } from './StreamChatAutoModMessagePrompt';
import { StreamChatInputBar, StreamChatInputBarRef } from './StreamChatInputBar';
import { StreamChatMessageList, StreamChatMessageListRef } from './StreamChatMessageList';
import { StreamChatMutedPrompt } from './StreamChatMutedPrompt';

import { useStreamChatViewQuery } from '@gen/graphql';
import { useAuth } from '@hooks/useAuth.hook';
import { MarketingTracking } from '@lib/MarketingTracking';
import { useChatContext } from '@providers/ChatProvider';

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

export const StreamChat = forwardRef(({ channelId, channelName }: Props, ref) => {
  const { userId } = useAuth();
  const chatListRef = useRef<StreamChatMessageListRef>();
  const { data, loading: loadingProfile } = useStreamChatViewQuery({
    ...variablesOrSkip({ userId }),
  });

  const { streamChat, cancelStreamModeratedMessage, streamChatModeratedMessageContent } =
    useChatContext();

  const { messages, loading, sendMessage } = streamChat;

  const [chatMessage, setChatMessage] = useState<string>('');
  const [muteStartTime, resetMuteTimer] = useChatMuteTimer();

  const chatInputRef = useRef<StreamChatInputBarRef>();

  const hideEmojiDrawer = () => {
    chatInputRef.current?.hideEmojiDrawer();
  };

  useEffect(() => {
    hideEmojiDrawer();

    if (!streamChatModeratedMessageContent) {
      return;
    }

    setChatMessage(streamChatModeratedMessageContent.text);
  }, [streamChatModeratedMessageContent]);

  useEffect(() => {
    if (muteStartTime === null) {
      return;
    }

    // Hide emoji drawer whenever mute starts
    hideEmojiDrawer();
  }, [muteStartTime]);

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
      cancelStreamModeratedMessage();
    }

    setChatMessage('');
    chatListRef.current?.scrollToBottom();
  };

  const onCancelModeratedMessage = () => {
    setChatMessage('');
    cancelStreamModeratedMessage();
  };

  const sendAutomodMessage = () => {
    onSendMessage(true);
  };

  const isChatInputVisible = !streamChatModeratedMessageContent && !muteStartTime;
  const isMutedPromptVisible = muteStartTime !== null;

  const keyboard = useAnimatedKeyboard();
  const insets = useSafeAreaInsets();

  const animatedStyle = useAnimatedStyle(() => ({
    paddingBottom: keyboard.height.value - insets.bottom,
    height: '100%',
  }));

  return (
    <Animated.View style={animatedStyle}>
      {!loadingProfile && (
        <StreamChatMessageList
          channelId={channelId}
          channelName={channelName}
          loading={loading}
          messages={messages}
          ownUserTag={data?.profile?.userTag ?? ''}
          ref={chatListRef}
          onTouchEnd={hideEmojiDrawer}
        />
      )}
      {streamChatModeratedMessageContent && (
        <StreamChatAutoModMessagePrompt
          message={streamChatModeratedMessageContent}
          onCancel={onCancelModeratedMessage}
          onSend={sendAutomodMessage}
        />
      )}
      {isMutedPromptVisible && (
        <StreamChatMutedPrompt
          muteStartTime={muteStartTime}
          onMuteEnded={resetMuteTimer}
        />
      )}
      {isChatInputVisible && (
        <StreamChatInputBar
          message={chatMessage}
          ref={chatInputRef}
          onCancelModeratedMessage={cancelStreamModeratedMessage}
          onMessageChange={setChatMessage}
          onSend={onSendMessage}
        />
      )}
    </Animated.View>
  );
});
