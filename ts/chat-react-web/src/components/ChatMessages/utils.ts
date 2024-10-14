import { ChatItemModel } from '@noice-com/chat-react-core';

export const getMessageId = (message: ChatItemModel) => {
  if (message.chatItemType === 'ChatMessage') {
    return message.messageId;
  }

  return message.id;
};

export const getIsMessageSentByLocalPlayer = (message: ChatItemModel, userId: string) => {
  if (message.chatItemType === 'ChatMessage') {
    return message.senderId === userId;
  }

  if (message.chatItemType === 'ModerationMessage') {
    return message.userId === userId;
  }

  return false;
};

export const CHAT_DATA_ATTRIBUTE = 'data-chat';
export const CHAT_DATA_FIRST_UNREAD_ATTRIBUTE_VALUE = 'first-unread-message';
