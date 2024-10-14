import { ChatItemModel } from '@noice-com/chat-react-core';
import { forwardRef, useCallback, useImperativeHandle, useRef, useState } from 'react';
import {
  FlatList,
  LayoutChangeEvent,
  ListRenderItem,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  View,
} from 'react-native';

import { StreamChatAutoModMessage } from './StreamChatAutoModMessage';
import { ChannelEventMessage } from './StreamChatChannelEventMessage';
import { StreamChatMessage } from './StreamChatMessage';
import { StreamChatScrollButton } from './StreamChatScrollButton';
import { StreamChatWelcomePrompt } from './StreamChatWelcomePrompt';

import { Gutter } from '@components/Gutter';

interface Props {
  messages: ChatItemModel[];
  ownUserTag: string;
  channelId: string;
  channelName?: string;
  loading?: boolean;
  onTouchEnd?: () => void;
}

export interface StreamChatMessageListRef {
  scrollToBottom: (animated?: boolean) => void;
}

const extractChatMessageKey = (item: ChatItemModel) => {
  if (item.chatItemType === 'ChatMessage') {
    return item.messageId;
  }

  return item.id;
};

const SCROLL_TO_BOTTOM_INDICATOR_OFFSET = 80;

export const StreamChatMessageList = forwardRef(
  ({ messages, ownUserTag, channelId, channelName, loading, onTouchEnd }: Props, ref) => {
    const listRef = useRef<FlatList>(null);
    const [showScrollToBottom, setShowScrollToBottom] = useState(false);
    const scrollOnNextUpdate = useRef(false);
    const prevContentSizeHeight = useRef<number>();
    const listLayoutHeight = useRef<number>();
    const scrollPositionY = useRef<number>();
    const initialRenderCompleted = useRef(false);

    const renderMessage: ListRenderItem<ChatItemModel> = useCallback(
      ({ item, index }) => {
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

        if (item.chatItemType === 'ChatMessage') {
          return (
            <>
              <StreamChatMessage
                channelId={channelId}
                chatMessage={item}
                ownUserTag={ownUserTag}
              />
              <Gutter height={1} />
            </>
          );
        }

        if (item.chatItemType === 'ChannelEvent') {
          return (
            <ChannelEventMessage
              channelId={channelId}
              content={item}
            />
          );
        }

        if (item.chatItemType === 'ModerationMessage') {
          return (
            <>
              <StreamChatAutoModMessage message={item} />
              <Gutter height={8} />
            </>
          );
        }

        return null;
      },
      [channelId, messages, ownUserTag],
    );

    const scrollToBottom = (animated = true) => {
      listRef.current?.scrollToOffset({
        offset: prevContentSizeHeight.current ?? 0,
        animated,
      });
    };

    const onContentSizeChange = useCallback(
      (_: number, height: number) => {
        // scroll to display latest message when at bottom of list
        if (!showScrollToBottom) {
          listRef.current?.scrollToOffset({ offset: height, animated: false });
        }

        if (scrollOnNextUpdate.current) {
          setTimeout(() => {
            listRef.current?.scrollToOffset({ offset: height, animated: false });
          }, 0);
          scrollOnNextUpdate.current = false;
        }

        prevContentSizeHeight.current = height;
      },
      [showScrollToBottom],
    );

    const onChatScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const scrollY = event.nativeEvent.contentOffset.y;
      scrollPositionY.current = scrollY;

      // scrollY + containerHeight allows us to determine what the distance
      // is that we have scrolled to the end. When scrolled to the very end
      // then the following is true:  scrollY + containerHeight === contentHeight.
      const contentHeight = prevContentSizeHeight.current ?? 0;
      const containerHeight = listLayoutHeight.current ?? 0;
      const distanceFromEnd = contentHeight - (scrollY + containerHeight);

      if (
        distanceFromEnd > SCROLL_TO_BOTTOM_INDICATOR_OFFSET &&
        initialRenderCompleted.current &&
        !showScrollToBottom &&
        !loading
      ) {
        setShowScrollToBottom(true);
      } else if (
        distanceFromEnd <= SCROLL_TO_BOTTOM_INDICATOR_OFFSET &&
        showScrollToBottom
      ) {
        setShowScrollToBottom(false);
      }
    };

    const handleOnLayout = (event: LayoutChangeEvent) => {
      listLayoutHeight.current = event.nativeEvent.layout.height;
      scrollToBottom(false);
    };

    useImperativeHandle(ref, () => ({
      scrollToBottom: () => {
        scrollToBottom(false);
        setShowScrollToBottom(false);
      },
    }));

    const listHeader = channelName ? (
      <>
        <Gutter height={16} />
        <StreamChatWelcomePrompt channelName={channelName} />
        {!!messages.length && <Gutter height={8} />}
      </>
    ) : (
      <></>
    );

    return (
      <View style={s.wrapper}>
        <FlatList
          ListHeaderComponent={listHeader}
          contentContainerStyle={s.container}
          data={messages}
          keyExtractor={extractChatMessageKey}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
          maintainVisibleContentPosition={{
            autoscrollToTopThreshold: 0,
            minIndexForVisible: 0,
          }}
          ref={listRef}
          renderItem={renderMessage}
          style={s.list}
          onContentSizeChange={onContentSizeChange}
          onLayout={handleOnLayout}
          onScroll={onChatScroll}
          onTouchEnd={onTouchEnd}
        />
        {showScrollToBottom && <StreamChatScrollButton onPress={scrollToBottom} />}
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
    paddingBottom: 8,
  },
  list: {
    paddingHorizontal: 8,
    flex: 1,
  },
});
