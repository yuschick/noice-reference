import { useMemo } from 'react';

import { parseChatMessage } from './utils/parse-chat';

import { ChatMessageWithSenderFragment } from '@gen/graphql';

interface Props {
  message: ChatMessageWithSenderFragment;
  ownUserTag?: string;
}

export const useParsedChatMessage = ({ message, ownUserTag }: Props) => {
  const messageNodes = useMemo(() => {
    if (
      message.content?.content?.__typename !== 'ChatTextMessage' ||
      !message.content?.content?.text.length
    ) {
      return [];
    }

    const chunks = parseChatMessage(message.content.content, ownUserTag);

    return chunks;
  }, [ownUserTag, message]);

  return messageNodes;
};
