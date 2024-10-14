import { ModeratorFeedbackMessageModel } from '@noice-com/chat-react-core/src/common/moderation';

import styles from './ModeratorFeedbackMessage.module.css';

import { ChatEventMessageWrapper } from '@chat-common/event-message';

interface Props {
  message: ModeratorFeedbackMessageModel;
}

const getMessage = ({
  username,
  messageContent,
}: Pick<ModeratorFeedbackMessageModel, 'username' | 'messageContent'>) => {
  const messageParts = messageContent.split('USERNAME');

  return (
    <>
      {messageParts[0]}
      <span className={styles.username}>{username}</span>
      {messageParts[1]}
    </>
  );
};

export function ModeratorFeedbackMessage({ message }: Props) {
  const { username, messageContent, id } = message;

  return (
    <div className={styles.message}>
      <ChatEventMessageWrapper id={id}>
        <div className={styles.wrapper}>
          <span className={styles.headerSection}>
            <span className={styles.moderation}>Moderation</span> only visible to you
          </span>
          <span>{getMessage({ username, messageContent })}</span>
        </div>
      </ChatEventMessageWrapper>
    </div>
  );
}
