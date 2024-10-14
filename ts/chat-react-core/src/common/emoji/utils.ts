import { TextMessageAttachment } from '@noice-com/schemas/chat/chat.pb';

import { InventoryEmojiFragment } from 'gen';

export const parseEmojisFromMessage = (
  message: string,
  emojis: InventoryEmojiFragment[],
  fromIndex = 0,
  result: Required<TextMessageAttachment>[] = [],
): Required<TextMessageAttachment>[] => {
  // If we've reached the end of the message, return the result
  if (fromIndex >= message.length) {
    return result;
  }

  // Find the emoji in the message
  const fullEmojiResult = message.slice(fromIndex).match(/:([\w-]+):/);

  // If there are no more emojis, return the result
  if (!fullEmojiResult?.[1]) {
    return result;
  }

  const fullEmoji = fullEmojiResult[0];

  const start = message.indexOf(fullEmoji, fromIndex);

  const emoji = emojis.find(
    (def) => def.label.toLowerCase() === fullEmojiResult[1].toLowerCase(),
  );

  // If there is no emoji, continue the search after the found emoji pattern
  if (!emoji) {
    return parseEmojisFromMessage(message, emojis, start + fullEmoji.length, result);
  }

  const endIndex = start + fullEmoji.length - 1;

  const messageEmoji = {
    label: `:${emoji.label}:`,
    source: emoji.image,
    startIndex: start,
    endIndex,
    itemId: emoji.id,
  };

  return parseEmojisFromMessage(message, emojis, endIndex + 1, [...result, messageEmoji]);
};
