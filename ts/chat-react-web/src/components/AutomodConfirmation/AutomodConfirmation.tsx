import { CoreAssets } from '@noice-com/assets-core';
import { ChatMessageTextContentModel } from '@noice-com/chat-react-core';
import { Button, Icon } from '@noice-com/common-ui';

import styles from './AutomodConfirmation.module.css';

import { useChatEmojisAndMentions } from '@chat-hooks';

interface Props {
  moderatedMessageContent: ChatMessageTextContentModel;
  onSendMessage(content: string, consentToModeration: boolean): void;
  onCancel(): void;
}

export function AutomodConfirmation({
  moderatedMessageContent,
  onSendMessage,
  onCancel,
}: Props) {
  const { messageNodes } = useChatEmojisAndMentions({
    attachments: moderatedMessageContent.attachments,
    fontSize: 'small',
    message: moderatedMessageContent.text,
    messageId: 'automod-confirmation-message',
    ownPlayerName: 'none',
  });

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <Icon
          className={styles.icon}
          icon={CoreAssets.Icons.Exclamation}
        />
        <div>
          <span className={styles.confirmationText}>
            Are you sure you want to send this message? If you click Send, it will be sent
            to this channel`s moderators for review.
          </span>

          <div className={styles.message}>{messageNodes}</div>
        </div>
      </div>

      <div className={styles.buttons}>
        <Button
          size="sm"
          onClick={() => {
            onSendMessage(moderatedMessageContent.text, true);
          }}
        >
          Send message
        </Button>

        <Button
          level="secondary"
          size="sm"
          onClick={onCancel}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
