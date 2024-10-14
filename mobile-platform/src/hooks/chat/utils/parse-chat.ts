import { ChatTextMessage } from '@gen/graphql';

export type ChatMessageType = 'text' | 'emoji' | 'mention' | 'link';

export interface ChatMessageChunk {
  type: ChatMessageType;
  content: string;
  startIndex: number;
  endIndex: number;
}

const getChatMessageElement = (
  type: ChatMessageType,
  content: string,
  startIndex: number,
  endIndex: number,
): ChatMessageChunk => ({
  type,
  content,
  startIndex,
  endIndex,
});

const sortMessageChunks = (chunks: ChatMessageChunk[]) => {
  return chunks.sort((a, b) => a.startIndex - b.startIndex);
};

const parseMentions = (message: ChatTextMessage, ownUserTag: string) => {
  if (message?.__typename !== 'ChatTextMessage') {
    return [];
  }

  const chunks: ChatMessageChunk[] = [];
  const searchStr = `@${ownUserTag}`;
  const messageText = message.text;

  const regex = new RegExp(`${searchStr}\\b`, 'i');
  const index = messageText.search(regex);

  if (index > -1) {
    const endIndex = index + searchStr.length;
    const mentionText = messageText.slice(index, endIndex);
    chunks.push(getChatMessageElement('mention', mentionText, index, endIndex));
  }

  return chunks;
};

const parseEmojis = (message: ChatTextMessage) => {
  const chunks: ChatMessageChunk[] = [];
  const attachments = message.attachments ?? [];

  for (const attachment of attachments) {
    const { startIndex, endIndex, source } = attachment;
    chunks.push(getChatMessageElement('emoji', source, startIndex, endIndex));
  }

  return chunks;
};

const parseLinks = (message: ChatTextMessage) => {
  const chunks: ChatMessageChunk[] = [];
  const links = message.links ?? [];

  for (const link of links) {
    const { startIndex, endIndex, url } = link;
    // remove https:// and trailing / from the url
    const newUrl = url.replace(/(^\w+:|^)\/\//, '').replace(/\/$/, '');
    chunks.push(getChatMessageElement('link', newUrl, startIndex, endIndex));
  }

  return chunks;
};

const parseText = (message: ChatTextMessage, existingChunks: ChatMessageChunk[]) => {
  const messageText = message.text;
  const sorted = sortMessageChunks(existingChunks);
  const textChunks: ChatMessageChunk[] = [];

  if (!sorted.length) {
    return [getChatMessageElement('text', messageText, 0, messageText.length)];
  }

  if (!messageText.length) {
    return [];
  }

  let startIndex = 0;
  for (const chunk of sorted) {
    // Incase the index is overlapping with an existing chunk we move it forward
    if (startIndex >= chunk.startIndex) {
      startIndex = chunk.endIndex + 1;
      continue;
    }

    const endIndex = chunk.startIndex;
    const textChunk = messageText.slice(startIndex, endIndex);

    textChunks.push(getChatMessageElement('text', textChunk, startIndex, endIndex));

    startIndex = chunk.endIndex + 1;
  }

  // If there is something left after the last emoji append it
  const lastChunkEndIndex = sorted[sorted.length - 1]?.endIndex + 1;
  const remainingText = messageText.substring(lastChunkEndIndex, messageText.length);
  if (remainingText.length) {
    textChunks.push(
      getChatMessageElement('text', remainingText, lastChunkEndIndex, messageText.length),
    );
  }

  return textChunks;
};

export const parseChatMessage = (
  message?: ChatTextMessage | null,
  ownUserTag?: string,
) => {
  if (!message || message?.__typename !== 'ChatTextMessage') {
    return [];
  }

  const emojiChunks = parseEmojis(message);
  const linkChunks = parseLinks(message);
  const mentionChunks = ownUserTag ? parseMentions(message, ownUserTag) : [];
  const textChunks = parseText(message, [
    ...emojiChunks,
    ...mentionChunks,
    ...linkChunks,
  ]);

  const sortedChunks = sortMessageChunks([
    ...emojiChunks,
    ...mentionChunks,
    ...textChunks,
    ...linkChunks,
  ]);

  return sortedChunks;
};
