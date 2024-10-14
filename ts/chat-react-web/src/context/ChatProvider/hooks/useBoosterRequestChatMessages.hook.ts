import {
  ReceivedChatBoosterRequest,
  SentChatBoosterRequest,
  useChatMessages,
} from '@noice-com/chat-react-core';
import { useEffect } from 'react';
import { v4 as uuid } from 'uuid';

import { useChatAPIInternal } from '../../ChatAPIProvider';

interface Props {
  userId: string;
  addMessage: ReturnType<typeof useChatMessages>['addMessage'];
  removeMessages: ReturnType<typeof useChatMessages>['removeMessages'];
}

export function useBoosterRequestChatMessages({
  userId,
  addMessage,
  removeMessages,
}: Props) {
  const { events } = useChatAPIInternal();

  useEffect(() => {
    const onAddBoosterRequest = (targetUserId: string, requestUserId: string) => {
      if (targetUserId === userId) {
        addMessage({
          chatItemType: 'ReceivedChatBoosterRequest',
          id: uuid(),
          userId: requestUserId,
        });
        return;
      }

      if (requestUserId === userId) {
        addMessage({
          chatItemType: 'SentChatBoosterRequest',
          id: uuid(),
          userId: targetUserId,
        });
        return;
      }
    };

    const onRemoveBoosterRequest = (targetUserId: string, requestUserId: string) => {
      if (targetUserId === userId) {
        removeMessages<ReceivedChatBoosterRequest>(
          'ReceivedChatBoosterRequest',
          (message) => {
            return message.userId === requestUserId;
          },
        );
        return;
      }

      if (requestUserId === userId) {
        removeMessages<SentChatBoosterRequest>('SentChatBoosterRequest', (message) => {
          return message.userId === targetUserId;
        });
        return;
      }
    };

    const onClearPlayerBoosterRequests = (playerId: string) => {
      if (playerId === userId) {
        removeMessages('SentChatBoosterRequest');
      }

      removeMessages<ReceivedChatBoosterRequest>(
        'ReceivedChatBoosterRequest',
        (message) => {
          return message.userId === playerId;
        },
      );
    };

    const onClearAllBoosterRequests = () => {
      removeMessages('SentChatBoosterRequest');
      removeMessages('ReceivedChatBoosterRequest');
    };

    events.addListener('onAddBoosterRequest', onAddBoosterRequest);
    events.addListener('onRemoveBoosterRequest', onRemoveBoosterRequest);
    events.addListener('onClearPlayerBoosterRequests', onClearPlayerBoosterRequests);
    events.addListener('onClearAllBoosterRequests', onClearAllBoosterRequests);

    return () => {
      events.removeListener('onAddBoosterRequest', onAddBoosterRequest);
      events.removeListener('onRemoveBoosterRequest', onRemoveBoosterRequest);
      events.removeListener('onClearPlayerBoosterRequests', onClearPlayerBoosterRequests);
      events.removeListener('onClearAllBoosterRequests', onClearAllBoosterRequests);
    };
  }, [events, addMessage, removeMessages, userId]);
}
