import { InventoryEmojiFragment } from '@chat-gen';

export const generateEmojiImg = (emoji: InventoryEmojiFragment): string => {
  return `<img alt=":${emoji.label}:" src="${emoji.image}" data-emoji-label=":${emoji.label}:" height="32px" >`;
};
