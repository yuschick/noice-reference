import { gql } from '@apollo/client';
import { ChatItemModel, ModerationMessageStatus } from '@noice-com/chat-react-core';
import { LoadingSpinner } from '@noice-com/common-ui';
import { ModerationStatus } from '@noice-com/schemas/chat/chat.pb';
import { Nullable } from '@noice-com/utils';
import classNames from 'classnames';

import { ChatMessageMemo } from '../../ChatMessage';
import { ModerationMessage } from '../../ModerationMessage';
import { ModeratorFeedbackMessage } from '../../ModeratorFeedbackMessage';
import { ReceivedBoosterRequestMessage } from '../../ReceivedBoosterRequestMessage';
import { SentBoosterRequestMessage } from '../../SentBoosterRequestMessage';

import styles from './ChatMessagesContent.module.css';

import { ChannelEventMessage } from '@chat-common/channel-event';
import { useChatSettings } from '@chat-common/settings';
import { useChatContext } from '@chat-context';
import { ChatMessagesProfileFragment } from '@chat-gen';

gql`
  fragment ChatMessagesProfile on ProfileProfile {
    userId
    userTag
  }
`;

interface Props {
  me: Nullable<ChatMessagesProfileFragment>;
  loading: boolean;
  onReplyButtonClick?: (replyPlayerName: string) => void;
  messages: ChatItemModel[];
}

export const ChatMessagesContent = ({
  me,
  loading,
  onReplyButtonClick,
  messages,
}: Props) => {
  const { showModerationTools, timestampType, fontSize, avatarType } = useChatSettings();
  const { onModerationAction, channelId } = useChatContext();

  return loading || !me ? (
    <div className={styles.loadingWrapper}>
      <LoadingSpinner />
    </div>
  ) : (
    <div className={classNames(styles.wrapper, styles[fontSize])}>
      {messages.map((message) => {
        const { chatItemType } = message;

        if (chatItemType === 'ChatMessage') {
          return (
            <div key={message.messageId}>
              {me.userId === message.senderId &&
                message.moderationStatus ===
                  ModerationStatus.MODERATION_STATUS_APPROVED && (
                  <ModerationMessage
                    message={{ status: ModerationMessageStatus.AutomodAccepted }}
                  />
                )}

              <ChatMessageMemo
                avatarType={avatarType}
                channelId={channelId}
                chatMessage={message}
                fontSize={fontSize}
                isOwnMessage={me.userId === message.senderId}
                ownPlayerName={me.userTag}
                showModerationTools={showModerationTools}
                timestampType={timestampType}
                onModerationAction={onModerationAction}
                onReplyButtonClick={onReplyButtonClick}
              />
            </div>
          );
        }

        if (chatItemType === 'ReceivedChatBoosterRequest') {
          return (
            <ReceivedBoosterRequestMessage
              avatarType={avatarType}
              key={message.id}
              message={message}
            />
          );
        }

        if (chatItemType === 'SentChatBoosterRequest') {
          return (
            <SentBoosterRequestMessage
              key={message.id}
              message={message}
            />
          );
        }

        if (chatItemType === 'ChannelEvent') {
          if (message.type === 'gift-subscription') {
            return null;
          }

          return (
            <ChannelEventMessage
              key={message.id}
              message={message}
            />
          );
        }

        if (chatItemType === 'ModerationMessage') {
          return (
            <ModerationMessage
              key={message.id}
              message={message}
            />
          );
        }

        if (chatItemType === 'ModeratorFeedbackMessage') {
          return (
            <ModeratorFeedbackMessage
              key={message.id}
              message={message}
            />
          );
        }

        return null;
      })}
    </div>
  );
};
