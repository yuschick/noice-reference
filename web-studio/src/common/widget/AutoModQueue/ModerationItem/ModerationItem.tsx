import { gql } from '@apollo/client';
import { CSSProperties, ReactNode, useMemo } from 'react';

import { ItemStatus } from '../ItemStatus/ItemStatus';
import { ModerationActionButtons } from '../ModerationActionButtons/ModerationActionButtons';

import styles from './ModerationItem.module.css';

import { ModerationUser } from '@common/profile';
import { AutomodQueueChatModerationItemFragment, ChatModerationItemStatus } from '@gen';

const getCreatedAtTime = (isoTime: string) => {
  const date = new Date(isoTime);
  const hours = date.getHours();
  const minutes = date.getMinutes();

  return `${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}`;
};

const highlightHighRiskContent = (text: string, indexes: number[]) => {
  if (!indexes.length) {
    return text;
  }

  const nodes: ReactNode[] = [];
  let startingPoint = 0;

  indexes.forEach((index, i) => {
    const highlightEndPoint = index + 1;
    const textBefore = text.substring(startingPoint, index);
    const textHighlighted = text.substring(index, highlightEndPoint);

    nodes.push(<span key={`text:${i}:${startingPoint}`}>{textBefore}</span>);
    nodes.push(
      <span
        className={styles.highlight}
        key={`highlight:${i}:${index}`}
      >
        {textHighlighted}
      </span>,
    );
    startingPoint = highlightEndPoint;
  });

  nodes.push(
    <span key={`text:${indexes.length}:${startingPoint}`}>
      {text.substring(startingPoint)}
    </span>,
  );

  return nodes;
};

export const getChatMessageText = (
  chatMessage: AutomodQueueChatModerationItemFragment['chatMessage'],
): string => {
  if (chatMessage.content?.content?.__typename === 'ChatTombstone') {
    return 'Message was deleted by a moderator.';
  }

  return chatMessage.content?.content?.__typename === 'ChatTextMessage'
    ? chatMessage.content.content.text ?? ''
    : 'Unsupported message type';
};

interface Props extends AutomodQueueChatModerationItemFragment {
  onClear: (id: string) => void;
  chatId: string;
}

export function ModerationItem({
  id,
  chatId,
  chatMessage,
  status,
  expiresAt,
  expired,
  onClear,
  reviewer,
}: Props) {
  const message = getChatMessageText(chatMessage);

  const messageWithHighlights = useMemo(
    () => highlightHighRiskContent(message, chatMessage.textClassification.hashes),
    [chatMessage.textClassification.hashes, message],
  );

  return (
    <div
      className={styles.moderationItem}
      style={
        {
          '--highlight-color':
            status === ChatModerationItemStatus.StatusAllowed
              ? 'var(--noi-color-green-main)'
              : 'var(--noi-color-status-error-main)',
        } as CSSProperties
      }
    >
      <div className={styles.header}>
        <ModerationUser profile={chatMessage.sender} />
        <ItemStatus
          expired={expired}
          expiresAt={expiresAt}
          reviewer={reviewer}
          status={status}
        />
      </div>
      <div className={styles.body}>
        <div className={styles.content}>
          <div className={styles.messageCreatedAt}>
            {getCreatedAtTime(chatMessage.createdAt)}
          </div>
          <div className={styles.messageText}>{messageWithHighlights}</div>
        </div>
        <div className={styles.actions}>
          <ModerationActionButtons
            chatId={chatId}
            handleClear={onClear}
            moderationItemId={id}
            status={status}
          />
        </div>
      </div>
    </div>
  );
}

ModerationItem.fragments = {
  entry: gql`
    fragment AutomodQueueChatModerationItem on ChatModerationItem {
      chatMessage {
        content {
          content {
            ... on ChatTextMessage {
              text
            }
            ... on ChatTombstone {
              emptyTypeWorkaround
            }
          }
        }
        createdAt
        textClassification {
          hashes
        }
        sender {
          ...ModerationUser
        }
      }
      reviewer {
        ...ModerationUser
      }
      expiresAt
      expired
      status
      id
    }
    ${ModerationUser.fragments.entry}
  `,
};
