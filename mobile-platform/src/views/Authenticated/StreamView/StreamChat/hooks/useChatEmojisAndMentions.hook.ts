import { TextMessageAttachment, TextMessageLink } from '@noice-com/schemas/chat/chat.pb';
import { ReactNode, useCallback, useMemo, useRef } from 'react';

interface Props {
  message: string;
  attachments?: Required<TextMessageAttachment>[];
  links?: Required<TextMessageLink>[];
  ownPlayerName: string;
  messageId: string;
  renderText: (content: string, key: string) => React.JSX.Element;
  renderMention: (content: string, key: string) => React.JSX.Element;
  renderEmoji: (content: string, source: string, key: string) => React.JSX.Element;
  renderLink: (content: string, key: string) => React.JSX.Element;
}

interface HookResult {
  messageNodes: ReactNode[];
  mentionsMe: boolean;
}

export function useChatEmojisAndMentions({
  message,
  attachments,
  links,
  ownPlayerName,
  messageId,
  renderText,
  renderEmoji,
  renderLink,
  renderMention,
}: Props): HookResult {
  const mentionsMe = useRef(false);
  const searchString = `@${ownPlayerName}`;

  const mentionRegExp = useMemo(
    () => new RegExp(`${searchString}\\b`, 'i'),
    [searchString],
  );

  const splitTextToNodesByMention = useCallback(
    (text: string, textPartType: string): ReactNode[] => {
      const nodes: ReactNode[] = [];
      const mentionIndex = text.search(mentionRegExp);

      // If no mentions, return the text as one node
      if (mentionIndex < 0) {
        nodes.push(renderText(text, `text:${textPartType}:${messageId}`));

        return nodes;
      }

      mentionsMe.current = true;

      // Add text before mention
      nodes.push(
        renderText(
          text.substring(0, mentionIndex),
          `text:pre-mention:${textPartType}:${messageId}`,
        ),
      );

      // Add mention
      nodes.push(renderMention(searchString, `mention:${messageId}`));

      // Add text after mention
      nodes.push(
        renderText(
          text.substring(mentionIndex + searchString.length),
          `text:post-mention:${textPartType}:${messageId}`,
        ),
      );

      return nodes;
    },
    [mentionRegExp, messageId, renderMention, renderText, searchString],
  );

  const messageNodes = useMemo(() => {
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
            renderLink(
              attachment.url,
              `link:${attachment.startIndex}:${attachment.endIndex}`,
            ),
          );
        }

        if ('label' in attachment) {
          // Inject the emoji
          messageNodesInternal.push(
            renderEmoji(
              attachment.label,
              attachment.source,
              `emoji:${attachment.startIndex}:${attachment.endIndex}`,
            ),
          );
        }

        // Set the starting point to the end index and go again
        startingPoint = attachment.endIndex + 1;
      });

    // Get the remainder of the string added in there
    messageNodesInternal.push(
      ...splitTextToNodesByMention(message.substring(startingPoint), 'remainder'),
    );

    return messageNodesInternal;
  }, [attachments, links, message, renderEmoji, renderLink, splitTextToNodesByMention]);

  return { messageNodes, mentionsMe: mentionsMe.current };
}
