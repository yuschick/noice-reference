import { TextMessageAttachment } from '@noice-com/schemas/chat/chat.pb';
import { DeepPartial } from '@noice-com/utils';

import { EmojiDefinition } from '../types/emoji';

import { isDeletedChatMessage } from './chat-message';

import { ChatChatMessage } from '@gen/graphql';

export const parseEmojisFromMessage = (
  message: string,
  emojiDefs: EmojiDefinition[],
  fromIndex = 0,
  result: Required<TextMessageAttachment>[] = [],
): Required<TextMessageAttachment>[] => {
  const start = message.indexOf(':', fromIndex);

  if (start === -1) {
    return result;
  }

  const forwardSearch = start + 1;

  // Message has end, so no need to continue
  if (forwardSearch === message.length) {
    return result;
  }

  // If the next character is a non-word character, skip
  if (message[forwardSearch].match(/\W/)) {
    return parseEmojisFromMessage(message, emojiDefs, start + 1, result);
  }

  // If there isn't a following :, return
  const next = message.indexOf(':', forwardSearch);

  if (next === -1) {
    return result;
  }

  const label = message.slice(start, next + 1);
  const emoji = emojiDefs.find((def) => def.label.toLowerCase() === label.toLowerCase());

  // If we find an emoji, push it to results and continue
  const newResults = [...result];

  if (emoji) {
    newResults.push({
      label: emoji.label,
      source: emoji.source,
      startIndex: start,
      endIndex: next,
      itemId: emoji.itemId,
    });
  }

  return parseEmojisFromMessage(message, emojiDefs, next + 1, newResults);
};

export const getChatMessageText = <T extends DeepPartial<ChatChatMessage>>(
  chatMessage: T,
): string => {
  if (isDeletedChatMessage(chatMessage)) {
    return 'Message was deleted by a moderator.';
  }

  return chatMessage.content?.content?.__typename === 'ChatTextMessage'
    ? chatMessage.content.content.text ?? ''
    : 'Unsupported message type';
};

export const generateEmojiImg = (emoji: EmojiDefinition): string => {
  return `<img alt="${emoji.label}" src="${emoji.source}" data-emoji-label="${emoji.label}" height="32px" >`;
};
