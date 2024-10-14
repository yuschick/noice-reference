import { CoreAssets } from '@noice-com/assets-core';
import {
  ChatMessageModel,
  getChatMessageText,
  isDeletedChatMessage,
  transformChatMessageBadgeToUserBadge,
} from '@noice-com/chat-react-core';
import { CommonUtils, FontSize, Icon, IconButton, Tooltip } from '@noice-com/common-ui';
import { MiniProfilePortal, UserBadge } from '@noice-com/social';
import { sortBadges } from '@noice-com/social-react-core';
import { Nullable, DateAndTimeUtils } from '@noice-com/utils';
import classNames from 'classnames';
import { memo, useState, useRef, useEffect } from 'react';
import { HiReply } from 'react-icons/hi';

import styles from './ChatMessage.module.css';
import { ChatMessageAvatar } from './ChatMessageAvatar/ChatMessageAvatar';
import { ChatMessageModerationTools } from './ChatMessageModerationTools/ChatMessageModerationTools';

import { ChatMessageAvatarType, ChatMessageTimestampType } from '@chat-common/settings';
import { useChatEmojisAndMentions } from '@chat-hooks';

export interface MessageProps {
  className?: string;
  channelId: Nullable<string>;
  chatMessage: ChatMessageModel;
  isOwnMessage?: boolean;
  ownPlayerName: string;
  showModerationTools?: boolean;
  timestampType: ChatMessageTimestampType;
  avatarType: ChatMessageAvatarType;
  fontSize: FontSize;
  onReplyButtonClick?: (replyPlayerName: string) => void;
  onModerationAction?: (message: string, username: string) => void;
}

export function ChatMessage({
  className,
  channelId,
  chatMessage,
  ownPlayerName,
  isOwnMessage,
  onReplyButtonClick,
  showModerationTools,
  timestampType,
  avatarType,
  fontSize,
  onModerationAction,
}: MessageProps) {
  const [showChatProfile, setShowChatProfile] = useState(false);
  const [isDeletedMessageHidden, setIsDeletedMessageHidden] = useState(true);

  useEffect(() => {
    // When tools are not shown, hide deleted messages
    if (!showModerationTools) {
      setIsDeletedMessageHidden(true);
    }
  }, [showModerationTools]);

  const { createdAt, senderId, chatId, messageId, senderInfo, hasFailedToSend } =
    chatMessage;
  const message = getChatMessageText(chatMessage);
  const attachments = chatMessage.content.textContent?.attachments;
  const links = chatMessage.content.textContent?.links;

  const [relativeTime, setRelativeTime] = useState<Nullable<string>>(null);

  const wrapper = useRef(null);

  const senderPlayerName = senderInfo.username;

  const { messageNodes, mentionsMe } = useChatEmojisAndMentions({
    attachments,
    emojiClassName: styles.emoji,
    fontSize,
    links,
    mentionClassName: styles.mention,
    message,
    messageId,
    ownPlayerName,
  });

  const onAvatarClickCallback = () => {
    if (isOwnMessage) {
      return;
    }

    setShowChatProfile((prev) => !prev);
  };

  const isChatMessageDeleted = isDeletedChatMessage(chatMessage);

  return (
    <div
      className={classNames(styles.container, className, {
        [styles.mentionsMe]: mentionsMe,
      })}
      id={chatMessage.messageId}
      ref={wrapper}
      onMouseEnter={() =>
        setRelativeTime(DateAndTimeUtils.getRelativeTime(new Date(createdAt).getTime()))
      }
    >
      {hasFailedToSend && (
        <Tooltip
          content={'Failed to send message'}
          placement="top"
        >
          <Icon
            aria-label="Failed to send message"
            color="status-error-main"
            icon={CoreAssets.Icons.Alert}
            size={24}
          />
        </Tooltip>
      )}

      {showModerationTools && (
        <div className={styles.toolsWrapper}>
          <ChatMessageModerationTools
            chatId={chatId}
            isDeletedMessage={isChatMessageDeleted}
            isDeletedMessageHidden={isDeletedMessageHidden}
            messageId={messageId}
            toggleDeletedMessageVisibility={() =>
              setIsDeletedMessageHidden((prev) => !prev)
            }
          />
        </div>
      )}

      {(avatarType === 'visible' || timestampType === 'static') && (
        <div className={styles.avatarWrapper}>
          {timestampType === 'static' && (
            <time
              className={styles.staticTimestamp}
              dateTime={DateAndTimeUtils.getHTMLAttributeTime(chatMessage.createdAt)}
            >
              {DateAndTimeUtils.getTime(chatMessage.createdAt)}
            </time>
          )}

          {avatarType === 'visible' && (
            <ChatMessageAvatar
              avatar2D={senderInfo.avatar2D}
              fontSize={fontSize}
              isOwnMessage={!!isOwnMessage}
              miniProfileOpen={showChatProfile}
              username={senderInfo.username}
              onAvatarClick={onAvatarClickCallback}
            />
          )}
        </div>
      )}

      <div className={styles.textContainer}>
        <div className={styles.playerName}>
          {isOwnMessage ? (
            <>
              {!!senderInfo?.badges.length && (
                <div className={styles.badges}>
                  {sortBadges(
                    senderInfo.badges.map(transformChatMessageBadgeToUserBadge),
                  ).map((badge, index) => (
                    <UserBadge
                      badge={badge}
                      className={styles.badge}
                      key={index}
                    />
                  ))}
                </div>
              )}
              <span
                className={styles.messageUsername}
                style={{
                  color: CommonUtils.getUserIdColor({
                    preferredColor: senderInfo.preferredColor,
                    userId: senderId,
                  }),
                }}
              >
                {senderPlayerName}
              </span>
            </>
          ) : (
            <button
              aria-expanded={showChatProfile ? 'true' : 'false'}
              aria-haspopup="dialog"
              className={classNames(styles.messageUsername, styles.isOtherPlayer)}
              style={{
                color: CommonUtils.getUserIdColor({
                  preferredColor: senderInfo.preferredColor,
                  userId: senderId,
                }),
              }}
              type="button"
              onClick={onAvatarClickCallback}
            >
              {!!senderInfo?.badges.length && (
                <div className={styles.badges}>
                  {sortBadges(
                    senderInfo.badges.map(transformChatMessageBadgeToUserBadge),
                  ).map((badge, index) => (
                    <UserBadge
                      badge={badge}
                      className={styles.badge}
                      key={index}
                    />
                  ))}
                </div>
              )}
              {senderPlayerName}
            </button>
          )}
        </div>

        <span aria-hidden>: </span>

        <span className={styles.messageContent}>
          {isChatMessageDeleted ? (
            <span className={styles.deletedMessage}>
              {isDeletedMessageHidden ? message : chatMessage.content?.textContent?.text}
            </span>
          ) : (
            messageNodes
          )}
        </span>

        {timestampType === 'relative' && (
          <span className={styles.relativeTimestamp}>{relativeTime} ago</span>
        )}
      </div>

      {!isOwnMessage && onReplyButtonClick && (
        <div className={styles.replyButton}>
          <IconButton
            icon={HiReply}
            label="Reply"
            size="xs"
            variant="cta"
            onClick={() => onReplyButtonClick(senderPlayerName)}
          />
        </div>
      )}

      <MiniProfilePortal
        anchor={wrapper}
        channelId={channelId ?? undefined}
        placement="top"
        reportContext={
          !isChatMessageDeleted && channelId
            ? {
                messageId: chatMessage.messageId,
                channelId,
                chatId,
              }
            : undefined
        }
        showMiniProfile={showChatProfile}
        userId={senderId}
        onClose={() => setShowChatProfile(false)}
        onModerationAction={onModerationAction}
      />
    </div>
  );
}

function chatPropsAreEqual(prevMessage: MessageProps, nextMessage: MessageProps) {
  // If message content changed (e.g. moderation)
  const prevMessageText = getChatMessageText(prevMessage.chatMessage);
  const nextMessageText = getChatMessageText(nextMessage.chatMessage);

  if (prevMessageText !== nextMessageText) {
    return false;
  }

  // If message sender info has changed
  if (prevMessage.chatMessage.senderInfo !== nextMessage.chatMessage.senderInfo) {
    return false;
  }

  // If moderation tools have been toggled
  if (prevMessage.showModerationTools !== nextMessage.showModerationTools) {
    return false;
  }

  // If avatar type has changed
  if (prevMessage.avatarType !== nextMessage.avatarType) {
    return false;
  }

  // If font size has changed
  if (prevMessage.fontSize !== nextMessage.fontSize) {
    return false;
  }

  // If send fail has changed
  if (
    prevMessage.chatMessage.hasFailedToSend !== nextMessage.chatMessage.hasFailedToSend
  ) {
    return false;
  }

  return true;
}

export const ChatMessageMemo = memo<MessageProps>(ChatMessage, chatPropsAreEqual);
