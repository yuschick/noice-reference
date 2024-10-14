import { useChatMessages } from '@noice-com/chat-react-core';
import { useCallback } from 'react';
import { v4 as uuid } from 'uuid';

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
        id: uuid(),
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
