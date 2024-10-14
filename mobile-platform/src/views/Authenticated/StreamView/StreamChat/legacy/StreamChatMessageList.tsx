import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  View,
} from 'react-native';
import { useSharedValue } from 'react-native-reanimated';

import { StreamChatAutoModMessage } from './StreamChatAutoModMessage';
import { ChannelEventMessage } from './StreamChatChannelEventMessage';
import { StreamChatMessage } from './StreamChatMessage';
import { StreamChatScrollButton } from './StreamChatScrollButton';
import { StreamChatWelcomePrompt } from './StreamChatWelcomePrompt';

import { Gutter } from '@components/Gutter';
import { ChatMessageWithSenderFragment } from '@gen/graphql';
import { ChannelEventModel } from '@hooks/chat/types/event';
import { ModerationMessageModel } from '@hooks/chat/types/moderation';

interface Props {
  messages: ChatMessageWithSenderFragment[];
  moderationMessages: ModerationMessageModel[];
  channelEventMessages: ChannelEventModel[];
  ownUserTag: string;
  channelId: string;
  channelName?: string;
  loading?: boolean;
  bottomYOffset?: number;
  onTouchEnd?: () => void;
}

export interface StreamChatMessageListRef {
  scrollToBottom: (animated?: boolean) => void;
}

type ChatListMessage = {
  type: 'message';
  content: ChatMessageWithSenderFragment;
  time: number;
  id: string;
};

type ChatListModMessage = {
  type: 'mod-message';
  content: ModerationMessageModel;
  time: number;
  id: string;
};

type ChannelEventMessage = {
  type: 'channel-event';
  content: ChannelEventModel;
  time: number;
  id: string;
};

type ChatListItem = ChatListMessage | ChatListModMessage | ChannelEventMessage;

const SCROLL_TO_BOTTOM_INDICATOR_OFFSET = 80;

export const StreamChatMessageList = forwardRef(
  (
    {
      messages,
      moderationMessages,
      channelEventMessages,
      ownUserTag,
      channelId,
      channelName,
      loading,
      bottomYOffset = 0,
      onTouchEnd,
    }: Props,
    ref,
  ) => {
    const listRef = useRef<FlatList>(null);
    const [showScrollToBottom, setShowScrollToBottom] = useState(false);
    const scrollOnNextUpdate = useRef(false);
    const prevContentSizeHeight = useRef<number>();
    const scrollPositionY = useRef<number>();
    const bottomYOffsetAnimatedValue = useSharedValue(bottomYOffset);
    const initialRenderCompleted = useRef(false);
    bottomYOffsetAnimatedValue.value = bottomYOffset;

    const combinedData = useMemo(() => {
      const mappedMessages: ChatListItem[] =
        messages?.map((message) => ({
          type: 'message',
          content: message,
          time: new Date(message.createdAt).getTime(),
          id: message.messageId,
        })) ?? [];

      const mappedModMessages: ChatListItem[] =
        moderationMessages?.map((modMessage) => ({
          type: 'mod-message',
          content: modMessage,
          time: modMessage.time.getTime(),
          id: modMessage.id,
        })) ?? [];

      const mappedEvents: ChatListItem[] =
        channelEventMessages?.map((event) => ({
          type: 'channel-event',
          content: event,
          time: event.time.getTime(),
          id: event.id,
        })) ?? [];

      // Skip full sort
      if (!mappedModMessages.length && !mappedEvents.length) {
        return mappedMessages.reverse();
      }

      return [...mappedMessages, ...mappedModMessages, ...mappedEvents].sort(
        (a, b) => b.time - a.time,
      );
    }, [channelEventMessages, messages, moderationMessages]);

    const renderMessage = useCallback(
      ({ item, index }: { item: ChatListItem; index: number }) => {
        // Hack: scroll gets triggered on render and sometimes shows scroll to bottom button
        if (
          messages.length &&
          index >= messages.length - 1 &&
          !initialRenderCompleted.current
        ) {
          setTimeout(() => {
            initialRenderCompleted.current = true;
          }, 100);
        }

        if (item.type === 'message') {
          return (
            <>
              <StreamChatMessage
                channelId={channelId}
                message={item.content}
                ownUserTag={ownUserTag}
              />
              <Gutter height={1} />
            </>
          );
        }

        if (item.type === 'channel-event') {
          return (
            <ChannelEventMessage
              channelId={channelId}
              content={item.content.content}
            />
          );
        }

        if (item.type === 'mod-message') {
          return (
            <>
              <StreamChatAutoModMessage {...item.content} />
              <Gutter height={8} />
            </>
          );
        }

        return null;
      },
      [channelId, messages, ownUserTag],
    );

    useImperativeHandle(ref, () => ({
      scrollToBottom: () => {
        scrollOnNextUpdate.current = true;
        setShowScrollToBottom(false);
      },
    }));

    const onContentSizeChange = useCallback(
      (_: number, height: number) => {
        // scroll to display latest message when at bottom of list
        if (!showScrollToBottom) {
          listRef.current?.scrollToOffset({ offset: 0, animated: false });
        }

        if (scrollOnNextUpdate.current) {
          setTimeout(() => {
            listRef.current?.scrollToOffset({ offset: 0, animated: false });
          }, 0);
          scrollOnNextUpdate.current = false;
        }

        prevContentSizeHeight.current = height;
      },
      [showScrollToBottom],
    );

    const keyExtractor = useCallback((item: ChatListItem) => item.id, []);

    const listHeader = channelName ? (
      <>
        <Gutter height={16} />
        <StreamChatWelcomePrompt channelName={channelName} />
        {!!messages.length && <Gutter height={8} />}
      </>
    ) : (
      <></>
    );

    const onChatScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const scrollY = event.nativeEvent.contentOffset.y;
      scrollPositionY.current = scrollY;

      if (
        scrollY > SCROLL_TO_BOTTOM_INDICATOR_OFFSET &&
        initialRenderCompleted.current &&
        !showScrollToBottom &&
        !loading
      ) {
        setShowScrollToBottom(true);
      } else if (scrollY <= SCROLL_TO_BOTTOM_INDICATOR_OFFSET && showScrollToBottom) {
        setShowScrollToBottom(false);
      }
    };

    return (
      <View style={s.wrapper}>
        <FlatList
          ListFooterComponent={listHeader}
          contentContainerStyle={s.container}
          data={combinedData}
          keyExtractor={keyExtractor}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
          maintainVisibleContentPosition={{
            autoscrollToTopThreshold: 0,
            minIndexForVisible: 0,
          }}
          ref={listRef}
          renderItem={renderMessage}
          style={s.list}
          inverted
          onContentSizeChange={onContentSizeChange}
          onScroll={onChatScroll}
          onTouchEnd={onTouchEnd}
        />
        {showScrollToBottom && (
          <StreamChatScrollButton
            onPress={() => listRef.current?.scrollToOffset({ offset: 0 })}
          />
        )}
      </View>
    );
  },
);

const s = StyleSheet.create({
  wrapper: {
    overflow: 'hidden',
    flex: 1,
    height: '100%',
  },
  container: {
    // This is inverse due to inverted flatlist
    paddingTop: 8,
  },
  list: {
    paddingHorizontal: 8,
    flex: 1,
  },
});
