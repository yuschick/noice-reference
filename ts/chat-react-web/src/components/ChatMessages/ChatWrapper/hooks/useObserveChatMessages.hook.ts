import { ChatItemModel } from '@noice-com/chat-react-core';
import { Nullable } from '@noice-com/utils';
import { RefObject, useEffect, useRef, useState } from 'react';

import { getMessageId } from '../../utils';

interface HookResult {
  timeoutDomRef: RefObject<HTMLSpanElement>;
}

interface Props {
  messages: ChatItemModel[];
  chatWindowRef: RefObject<HTMLElement>;
  onLastMessageSeen(messageId: string): void;
  onLastMessageNotIntersecting(): void;
  onFirstMessageSeen(messageId: string): void;
}

export function useObserveChatMessages({
  messages,
  chatWindowRef,
  onLastMessageSeen,
  onLastMessageNotIntersecting,
  onFirstMessageSeen,
}: Props): HookResult {
  const [latestMessageId, setLatestMessageId] = useState<Nullable<string>>(null);
  const [firstMessageId, setFirstMessageId] = useState<Nullable<string>>(null);

  const timeoutDomRef = useRef<Nullable<HTMLSpanElement>>(null);

  /*
   * Set the latest message state and element ref
   */
  useEffect(() => {
    const latestMessage = messages.at(-1);

    setLatestMessageId(latestMessage ? getMessageId(latestMessage) : null);

    const firstMessage = messages.at(0);
    setFirstMessageId(firstMessage ? getMessageId(firstMessage) : null);
  }, [messages]);

  /**
   * Observe the latest message element
   */
  useEffect(() => {
    let observed = false;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (observed) {
              return;
            }

            observed = true;
            onLastMessageSeen(entry.target.id);

            return;
          }
          onLastMessageNotIntersecting();

          observed = false;
        });
      },
      {
        root: chatWindowRef.current,
        rootMargin: '40px',
        threshold: 0.5,
      },
    );

    if (latestMessageId) {
      const latestMessageEl = document.getElementById(latestMessageId);

      if (latestMessageEl) {
        observer.observe(latestMessageEl);
      }
    }

    return () => {
      observer.disconnect();
    };
  }, [chatWindowRef, latestMessageId, onLastMessageNotIntersecting, onLastMessageSeen]);

  /**
   * Observe the first message element
   */
  useEffect(() => {
    let observed = false;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (observed) {
              return;
            }

            observed = true;
            onFirstMessageSeen(entry.target.id);

            return;
          }

          observed = false;
        });
      },
      {
        root: chatWindowRef.current,
        rootMargin: '40px',
        threshold: 0.5,
      },
    );

    if (firstMessageId) {
      const firstMessageEl = document.getElementById(firstMessageId);

      if (firstMessageEl) {
        observer.observe(firstMessageEl);
      }
    }

    return () => {
      observer.disconnect();
    };
  }, [chatWindowRef, firstMessageId, onFirstMessageSeen]);

  return {
    timeoutDomRef,
  };
}
