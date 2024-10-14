import { ChatItemModel } from '@noice-com/chat-react-core';
import { useChat } from '@noice-com/chat-react-web';
import { Nullable } from '@noice-com/utils';
import { useMemo } from 'react';

interface HookResult {
  lastStreamMessageTime: Nullable<Date>;
  lastGroupMessageTime: Nullable<Date>;
  loading: boolean;
}

const getLastDate = (messages: ChatItemModel[]) => {
  let date: Nullable<Date> = null;

  [...messages].reverse().some((message) => {
    if (message.chatItemType === 'ChatMessage') {
      date = new Date(message.createdAt);
      return true;
    }
  });

  return date;
};

export function useLastChannelMessageTimes(): HookResult {
  const {
    messages: { messages: streamMessages, loading: streamLoading },
  } = useChat('stream');
  const {
    messages: { messages: groupMessages, loading: groupLoading },
  } = useChat('group');

  const loading = streamLoading || groupLoading;

  const lastStreamMessageTime = useMemo(() => {
    if (loading) {
      return null;
    }

    return getLastDate(streamMessages);
  }, [loading, streamMessages]);

  const lastGroupMessageTime = useMemo(() => {
    if (loading) {
      return null;
    }

    return getLastDate(groupMessages);
  }, [groupMessages, loading]);

  return { lastStreamMessageTime, lastGroupMessageTime, loading };
}
