import { ChatItemModel } from '@noice-com/chat-react-core';
import { useAuthenticatedUser } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import { RefObject, useEffect, useRef, useState } from 'react';

import { getMessageId } from '../../utils';

interface HookResult {
  unreadMessageIds: string[];
  firstUnreadMessageElRef: RefObject<HTMLElement>;
  onLastMessageSeen(messageId: string): void;
}

interface Props {
  messages: ChatItemModel[];
}

export function useUnreadChatMessages({ messages }: Props): HookResult {
  const [unreadMessageIds, setUnreadMessageIds] = useState<string[]>([]);
  const [lastSeenMessageId, setLastSeenMessageId] = useState<Nullable<string>>(null);

  const firstUnreadMessageElRef = useRef<Nullable<HTMLElement>>(null);

  const { userId } = useAuthenticatedUser();

  useEffect(() => {
    const lastSeenIndex = messages.findIndex(
      (message) => getMessageId(message) === lastSeenMessageId,
    );

    // If the last seen message is not in the list of messages,
    // our chat messages list have been reset (e.g. user changed channel)
    // so we reset the unread messages state too
    if (lastSeenIndex === -1) {
      setUnreadMessageIds([]);
      setLastSeenMessageId(null);
      firstUnreadMessageElRef.current = null;
      return;
    }

    if (lastSeenIndex === messages.length - 1) {
      setUnreadMessageIds([]);
      return;
    }

    setUnreadMessageIds(messages.slice(lastSeenIndex + 1).map(getMessageId));
  }, [lastSeenMessageId, messages, userId]);

  useEffect(() => {
    const firstUnreadMessageId = unreadMessageIds?.[0];

    if (!firstUnreadMessageId) {
      firstUnreadMessageElRef.current = null;
      return;
    }

    firstUnreadMessageElRef.current = document.getElementById(firstUnreadMessageId);
  }, [unreadMessageIds]);

  return {
    unreadMessageIds,
    firstUnreadMessageElRef,
    onLastMessageSeen: setLastSeenMessageId,
  };
}
