import { useClient, useMountEffect } from '@noice-com/common-react-core';
import {
  ChatMessage,
  HideMessage,
  MessageDenied,
  UserBanned,
  UserMuted,
  UserUnmuted,
} from '@noice-com/schemas/chat/chat.pb';
import { Nullable, makeLoggers } from '@noice-com/utils';
import { useEffect, useRef, useState } from 'react';

interface Props {
  chatId: Nullable<string>;
  onHideMessage(event: HideMessage): void;
  onMessage(event: ChatMessage): void;
  onMessageDenied(event: MessageDenied): void;
  onUserBanned(event: UserBanned): void;
  onUserMuted(event: UserUnmuted): void;
  onUserUnmuted(event: UserMuted): void;
  onReconnection(): void;
}

const { logError, logInfo } = makeLoggers('Chat Messages Connection');

export function useChatMessagesConnection({
  chatId,
  onHideMessage,
  onMessage,
  onMessageDenied,
  onUserBanned,
  onUserMuted,
  onUserUnmuted,
  onReconnection,
}: Props) {
  const client = useClient();
  const [connections, setConnections] = useState(0);

  const timeout = useRef<ReturnType<typeof setTimeout>>();
  const reconnectionAttemptsWithoutPing = useRef(0);

  useEffect(() => {
    if (!chatId) {
      return;
    }

    let unmounted = false;

    const cancelConnection = client.ChatService.chatMessages(chatId, {
      onMessage(_ctx, event) {
        onMessage(event);
      },
      onMessageDenied(_ctx, event) {
        onMessageDenied(event);
      },
      onUserMuted(_ctx, event) {
        onUserMuted(event);
      },
      onUserUnmuted(_ctx, event) {
        onUserUnmuted(event);
      },
      onHideMessage(_ctx, event) {
        onHideMessage(event);
      },
      onUserBanned(_ctx, event) {
        onUserBanned(event);
      },
      onChatDetails(_ctx, _event) {
        // not implemented
      },
      onPing(_ctx, _event) {
        reconnectionAttemptsWithoutPing.current = 0;

        logInfo('Ping received', chatId);
      },
      onEnd(_, err) {
        // Do nothing on unmount
        if (unmounted) {
          return;
        }

        // Use maximum 30 seconds timeout
        const timeoutTime = Math.min(
          1000 * 2 ** reconnectionAttemptsWithoutPing.current,
          30000,
        );

        logInfo(`Chat ${chatId} disconnected, reconnecting after ${timeoutTime}ms`);

        // Start timeout and try to reconnect if ping has not received in the time
        timeout.current = setTimeout(() => {
          if (reconnectionAttemptsWithoutPing.current > 4) {
            logError('Ping has not received after 5+ reconnection', err?.message);
          }

          // If we did not receive a ping event in time out, trigger the hook
          setConnections((prev) => prev + 1);

          onReconnection();
        }, timeoutTime);
      },
    });

    // Increase reconnection attempts without ping, as in next time the will be rendered
    // we will try to reconnect
    reconnectionAttemptsWithoutPing.current++;

    return () => {
      unmounted = true;
      cancelConnection();
      clearTimeout(timeout.current);
    };
  }, [
    chatId,
    client.ChatService,
    connections,
    onHideMessage,
    onMessage,
    onMessageDenied,
    onReconnection,
    onUserBanned,
    onUserMuted,
    onUserUnmuted,
  ]);

  useMountEffect(() => {
    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
  });
}
