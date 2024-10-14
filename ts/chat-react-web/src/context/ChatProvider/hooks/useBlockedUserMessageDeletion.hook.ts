import { ChatMessageModel, useChatMessages } from '@noice-com/chat-react-core';
import { useSocialPackageEvents } from '@noice-com/social';
import { useEffect } from 'react';

interface Props {
  removeStreamMessages: ReturnType<typeof useChatMessages>['removeMessages'];
  removeGroupMessages: ReturnType<typeof useChatMessages>['removeMessages'];
}

export function useBlockedUserMessageDeletion({
  removeStreamMessages,
  removeGroupMessages,
}: Props) {
  const events = useSocialPackageEvents();

  useEffect(() => {
    const deleteBlockedUsersMessages = (blockedUserId: string) => {
      removeStreamMessages<ChatMessageModel>(
        'ChatMessage',
        (message) => message.senderId === blockedUserId,
      );
      removeGroupMessages<ChatMessageModel>(
        'ChatMessage',
        (message) => message.senderId === blockedUserId,
      );
    };

    events.addListener('onProfileBlocked', deleteBlockedUsersMessages);

    return () => {
      events.removeListener('onProfileBlocked', deleteBlockedUsersMessages);
    };
  }, [events, removeGroupMessages, removeStreamMessages]);
}
