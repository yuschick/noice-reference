import { FontSize } from '@noice-com/common-ui';
import { TextMessageAttachment, TextMessageLink } from '@noice-com/schemas/chat/chat.pb';
import { ReactNode, useMemo, useRef } from 'react';

import { ChatEmoji } from '../components/ChatEmoji';
import { ChatLink } from '../components/ChatLink';

interface Props {
  attachments?: Required<TextMessageAttachment>[];
  emojiClassName?: string;
  fontSize: FontSize;
  links?: Required<TextMessageLink>[];
  mentionClassName?: string;
  message: string;
  messageId: string;
  ownPlayerName: string;
}

interface HookResult {
  messageNodes: ReactNode[];
  mentionsMe: boolean;
}

export function useChatEmojisAndMentions({
  attachments,
  emojiClassName,
  fontSize,
  links,
  mentionClassName,
  message,
  messageId,
  ownPlayerName,
}: Props): HookResult {
  const mentionsMe = useRef(false);
  const searchString = `@${ownPlayerName}`;

  const mentionRegExp = useMemo(
    () => new RegExp(`${searchString}\\b`, 'i'),
    [searchString],
  );

  const splitTextToNodesByMention = (text: string, textPartType: string): ReactNode[] => {
    const nodes: ReactNode[] = [];
    const mentionIndex = text.search(mentionRegExp);

    // If no mentions, return the text as one node
    if (mentionIndex < 0) {
      nodes.push(<span key={`text:${textPartType}:${messageId}`}>{text}</span>);

      return nodes;
    }

    mentionsMe.current = true;

    // Add text before mention
    nodes.push(
      <span key={`text:pre-mention:${textPartType}:${messageId}`}>
        {text.substring(0, mentionIndex)}
      </span>,
    );

    // Add mention
    nodes.push(
      <span
        className={mentionClassName}
        key={`mention:${messageId}`}
      >
        {searchString}
      </span>,
    );

    // Add text after mention
    nodes.push(
      <span key={`text:post-mention:${textPartType}:${messageId}`}>
        {text.substring(mentionIndex + searchString.length)}
      </span>,
    );

    return nodes;
  };

  const getMessageNodes = () => {
    const messageNodesInternal: ReactNode[] = [];
    let startingPoint = 0;

    [...(attachments ?? []), ...(links ?? [])]
      // Sort them to be in appearance order
      .sort((a, z) => a.startIndex - z.startIndex)
      // Inject each attachment, pushing the string between the previous first
      .forEach((attachment) => {
        // Push the text before the attachment
        const preAttachment = message.substring(startingPoint, attachment.startIndex);

        messageNodesInternal.push(
          ...splitTextToNodesByMention(
            preAttachment,
            `pre-attachment:${attachment.startIndex}`,
          ),
        );

        if ('url' in attachment) {
          // Inject the link
          messageNodesInternal.push(
            <ChatLink
              fontSize={fontSize}
              key={`link:${attachment.startIndex}:${attachment.endIndex}`}
              url={attachment.url}
            />,
          );
        }

        if ('label' in attachment) {
          // Inject the emoji
          messageNodesInternal.push(
            <ChatEmoji
              className={emojiClassName}
              emoji={attachment.label}
              key={`emoji:${attachment.startIndex}:${attachment.endIndex}`}
              source={attachment.source}
            />,
          );
        }

        // Set the starting point to the end index and go again
        startingPoint = attachment.endIndex + 1;
      });

    // Get the remainder of the string added in there
    // if (startingPoint < message.length)
    messageNodesInternal.push(
      ...splitTextToNodesByMention(message.substring(startingPoint), 'remainder'),
    );

    return messageNodesInternal;
  };

  return { messageNodes: getMessageNodes(), mentionsMe: mentionsMe.current };
}
