import { CoreAssets } from '@noice-com/assets-core';
import { ChatItemModel, useChatMessages } from '@noice-com/chat-react-core';
import { useMountEffect } from '@noice-com/common-react-core';
import {
  Button,
  MountTransition,
  SetTimeoutId,
  WithChildren,
  useAnalytics,
  useAuthenticatedUser,
  useScrollDirectionListener,
} from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import classNames from 'classnames';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

import { ChatState } from '../types';
import {
  CHAT_DATA_ATTRIBUTE,
  CHAT_DATA_FIRST_UNREAD_ATTRIBUTE_VALUE,
  getIsMessageSentByLocalPlayer,
  getMessageId,
} from '../utils';

import styles from './ChatWrapper.module.css';
import { useUnreadChatMessages, useObserveChatMessages } from './hooks';

interface Props {
  className?: string;
  messages: ChatItemModel[];
  loadOlderMessages: ReturnType<typeof useChatMessages>['loadOlderMessages'];
  updateMessageCap: ReturnType<typeof useChatMessages>['updateCap'];
  /* eslint-disable-next-line @typescript-eslint/naming-convention */
  __UNSAFE_debugMode?: boolean;
}

function getUnreadMessagesText(unreadCount: number): string {
  if (unreadCount === 1) {
    return '1 New message';
  }

  if (unreadCount > 1 && unreadCount <= 10) {
    return `${unreadCount} New messages`;
  }

  if (unreadCount > 10) {
    return '10+ New messages';
  }

  return 'No new messages';
}

const getMessageCap = (chatWindow: HTMLElement) => {
  // 32px is the height of a single chat message, 1.5 is a little buffer so we
  // do not only show the messages that fits in the chat window
  return Math.floor((chatWindow.clientHeight / 32) * 1.5);
};

/*
    The ChatWrapper handles scrolling to and notifying players of new messages.

    The chat window has two states:
      1. Auto - The chat window is automatically jumped to the latest message
      2. Paused - The chat window is paused and does not automatically scroll to the latest message

    When the chat state is 'auto'
    - any new message sent, by local or external players, will automatically jump the chat window to the latest message

    When the chat state is 'paused'
    - any new message sent by an external player will not scroll the chat window to the latest message and will increment the unreadMessagesCount
    - any new message sent by the local player will scroll the chat window to the latest message and reset the unreadMessagesCount

    When the unreadMessagesCount is greater than 0
    - the chat window will display a button that will jump the chat window to the latest message and reset the unreadMessagesCount
*/
export function ChatWrapper({
  children,
  className,
  messages,
  updateMessageCap,
  loadOlderMessages,
  /* eslint-disable-next-line @typescript-eslint/naming-convention */
  __UNSAFE_debugMode,
}: WithChildren<Props>) {
  const { userId } = useAuthenticatedUser();

  const [chatState, setChatState] = useState<ChatState>('auto');
  const [chatVisibility, setChatVisibility] = useState<'visible' | 'hidden'>('visible');
  const [latestMessage, setLatestMessage] = useState<Nullable<ChatItemModel>>(null);
  const [oldMessagesFetchedBeforeMessageId, setOldMessagesFetchedBeforeMessageId] =
    useState<Nullable<string>>(null);

  const chatWindowRef = useRef<HTMLDivElement | null>(null);
  const timeoutDomRef = useRef<Nullable<HTMLSpanElement>>(null);
  const timeoutRef = useRef<Nullable<SetTimeoutId>>(null);
  const ignoreScrollDirection = useRef(false);

  const isLatestMessageSentByLocalPlayer = latestMessage
    ? getIsMessageSentByLocalPlayer(latestMessage, userId)
    : false;

  const {
    unreadMessageIds,
    onLastMessageSeen: onLastMessageSeenCallback,
    firstUnreadMessageElRef,
  } = useUnreadChatMessages({
    messages,
  });

  const onLastMessageSeen = useCallback(
    (messageIg: string) => {
      ignoreScrollDirection.current = true;

      onLastMessageSeenCallback(messageIg);

      setChatState('auto');

      /**
       * Set timeout to show the New Message indicator line
       */
      timeoutRef.current = setTimeout(() => {
        chatWindowRef.current
          ?.querySelectorAll(`[${CHAT_DATA_ATTRIBUTE}]`)
          .forEach((el) => {
            el.removeAttribute(CHAT_DATA_ATTRIBUTE);
          });

        if (timeoutDomRef.current) {
          timeoutDomRef.current.innerText = 'Inactive';
        }
      }, 4000);

      if (timeoutDomRef.current) {
        timeoutDomRef.current.innerText = 'Active';
      }
    },
    [onLastMessageSeenCallback],
  );

  const onLastMessageNotIntersecting = useCallback(() => {
    ignoreScrollDirection.current = false;
  }, []);

  const onFirstMessageSeen = useCallback(
    async (messageId: string) => {
      if (!chatWindowRef.current) {
        return;
      }

      // If the chat content is taller than the chat window, increase the cap
      if (chatWindowRef.current.scrollHeight > chatWindowRef.current.clientHeight) {
        updateMessageCap({ increaseCap: 10 });
      } else {
        // Otherwise update the cap to match the current height of chat window
        updateMessageCap({ newCap: getMessageCap(chatWindowRef.current) });
      }

      await loadOlderMessages();

      setOldMessagesFetchedBeforeMessageId(messageId);
    },
    [loadOlderMessages, updateMessageCap],
  );

  useObserveChatMessages({
    messages,
    chatWindowRef,
    onLastMessageSeen,
    onLastMessageNotIntersecting,
    onFirstMessageSeen,
  });

  const { scrollDirection } = useScrollDirectionListener({
    scrollElementRef: chatWindowRef,
  });

  useEffect(() => {
    if (!ignoreScrollDirection.current && scrollDirection === 'up') {
      setChatState('paused');
    }
  }, [scrollDirection]);

  useEffect(() => {
    if (chatWindowRef.current && chatState === 'auto') {
      updateMessageCap({ newCap: getMessageCap(chatWindowRef.current) });
    }
  }, [chatState, updateMessageCap]);

  /*
   * Set the latest message
   */
  useEffect(() => {
    const latestMessage = messages.at(-1);

    setLatestMessage(latestMessage ?? null);
  }, [messages]);

  /**
   * Scroll or set chat data attributes based on the chat state and the latest message
   */
  useEffect(() => {
    // If there is no latest message, do nothing
    if (!latestMessage) {
      return;
    }

    // Get is the latest message sent by the local player
    const isLatestMessageSendByLocalPlayer = getIsMessageSentByLocalPlayer(
      latestMessage,
      userId,
    );

    setChatState((prevChatState) => {
      /**
       * If the chat state is auto, we scroll the latest message element into view
       * If the latest message is our own, scroll it into view and reset the chat to auto
       */
      if (prevChatState === 'auto' || isLatestMessageSendByLocalPlayer) {
        chatWindowRef.current?.lastElementChild?.scrollIntoView({
          behavior: 'instant',
          block: 'end',
        });

        /**
         * If the message is sent by the local player, remove the new message attribute from the first unread message
         */
        if (isLatestMessageSendByLocalPlayer && firstUnreadMessageElRef.current) {
          firstUnreadMessageElRef.current.removeAttribute(CHAT_DATA_ATTRIBUTE);
        }

        if (prevChatState === 'paused') {
          return 'auto';
        }
      }

      /**
       * If the chat is paused and a new external player message comes in, add data attribute to the first unread message
       */
      if (prevChatState === 'paused' && !isLatestMessageSendByLocalPlayer) {
        firstUnreadMessageElRef.current?.setAttribute(
          CHAT_DATA_ATTRIBUTE,
          CHAT_DATA_FIRST_UNREAD_ATTRIBUTE_VALUE,
        );
      }

      return prevChatState;
    });
  }, [chatWindowRef, firstUnreadMessageElRef, latestMessage, userId]);

  useLayoutEffect(() => {
    if (!chatWindowRef.current) {
      return;
    }

    updateMessageCap({ newCap: getMessageCap(chatWindowRef.current) });
  }, [updateMessageCap]);

  useLayoutEffect(() => {
    if (!oldMessagesFetchedBeforeMessageId) {
      return;
    }

    // Scroll to bottom when old messages are fetched
    document.getElementById(oldMessagesFetchedBeforeMessageId)?.scrollIntoView({
      behavior: 'instant',
      block: 'start',
    });

    setOldMessagesFetchedBeforeMessageId(null);
  }, [oldMessagesFetchedBeforeMessageId]);

  const { trackEvent } = useAnalytics();

  const resetChatWrapper = useCallback(() => {
    chatWindowRef.current?.scrollTo({ top: chatWindowRef.current.scrollHeight });

    setChatState('auto');
    setChatVisibility('visible');
  }, [setChatState]);

  const handleNewMessagesButtonClick = () => {
    if (latestMessage) {
      // Use the latest message to scroll to the latest message
      document.getElementById(getMessageId(latestMessage))?.scrollIntoView({
        behavior: 'instant',
        block: 'end',
      });
    }

    setChatState('auto');

    // Track the click event
    trackEvent({
      clientButtonClick: { action: 'chatNewMessages' },
    });
  };

  useEffect(() => {
    if (!chatWindowRef.current) {
      return;
    }

    /**
     * There are times when the chat window itself can be hidden, such as:
     * - When the game sidebar is minimized
     * - When entering PiP mode
     *
     * In these instances, when the chat window is hidden, but then shown again,
     * we want to scroll to the bottom and reset the chat as if its brand new.
     */
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (chatVisibility !== 'visible') {
            resetChatWrapper();
          }

          return;
        }
        setChatVisibility('hidden');
      });
    });

    observer.observe(chatWindowRef.current);

    return () => {
      observer.disconnect();
    };
  }, [chatVisibility, resetChatWrapper]);

  useMountEffect(() => {
    resetChatWrapper();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  });

  return (
    <>
      <div
        aria-label="Chat window"
        className={classNames(styles.chatContainer, className)}
        ref={chatWindowRef}
        role="region"
      >
        {children}

        <MountTransition
          duration="--noi-duration-quick"
          isShown={
            chatState === 'paused' &&
            !!unreadMessageIds.length &&
            !isLatestMessageSentByLocalPlayer
          }
          transitionClassName={styles.intoView}
        >
          <div className={styles.newMessagesBtnWrapper}>
            <Button
              iconStart={CoreAssets.Icons.ChevronDown}
              size="sm"
              onClick={handleNewMessagesButtonClick}
            >
              {getUnreadMessagesText(unreadMessageIds.length)}
            </Button>
          </div>
        </MountTransition>
      </div>

      {__UNSAFE_debugMode && (
        <div
          style={{
            display: 'grid',
            fontSize: 'var(--noi-font-size-sm)',
            padding: '1rem',
          }}
        >
          <span>
            <strong>State:</strong> {chatState}
          </span>
          <span>
            <strong>Unread:</strong> {unreadMessageIds.length}
          </span>
          <span>
            <strong>New Indicator Timeout:</strong>{' '}
            <span ref={timeoutDomRef}>Inactive</span>
          </span>
          <span>
            <strong>Latest ID:</strong> {unreadMessageIds.at(-1)}
          </span>
          <span>
            <strong>First Unread ID:</strong> {unreadMessageIds?.[0]}
          </span>
        </div>
      )}
    </>
  );
}
