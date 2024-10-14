import { EntityState } from '@noice-com/schemas/api/entity.pb';

import { ChatMessageModel } from './types';

export const isDeletedChatMessage = (chatMessage: ChatMessageModel) =>
  !!chatMessage.content.tombstone ||
  chatMessage.state === EntityState.ENTITY_STATE_BLOCKED;

export const getChatMessageText = (chatMessage: ChatMessageModel): string => {
  if (isDeletedChatMessage(chatMessage)) {
    return 'Message was deleted by a moderator.';
  }

  return chatMessage.content.textContent?.text ?? 'Unsupported message type';
};
