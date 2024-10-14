import type { useChatMessages } from '@noice-com/chat-react-core';
import { useCallback } from 'react';

interface HookResult {
  onModerationAction(message: string, username: string): void;
}

interface Props {
  addMessage: ReturnType<typeof useChatMessages>['addMessage'];
}

export function useModeratorMessages({ addMessage }: Props): HookResult {
  const onModerationAction = useCallback(
    (message: string, username: string) => {
      addMessage({
        chatItemType: 'ModeratorFeedbackMessage',
        // @ts-expect-error this doesn't seem to be typed, not sure if it even works?
        id: crypto.randomUUID(),
        messageContent: message,
        username,
      });
    },
    [addMessage],
  );

  return {
    onModerationAction,
  };
}
