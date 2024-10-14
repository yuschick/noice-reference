import {
  ModerationMessageModel,
  ModerationMessageStatus,
} from '@noice-com/chat-react-core';

import styles from './ModerationMessage.module.css';

import { ChatEventMessageWrapper } from '@chat-common/event-message';

export interface Props {
  message: Pick<ModerationMessageModel, 'status'> & Partial<ModerationMessageModel>;
}

const statusTest: Record<ModerationMessageStatus, string> = {
  [ModerationMessageStatus.AutomodAccepted]: 'Mods have allowed your message.',
  [ModerationMessageStatus.AutomodPending]:
    'Your message is being checked by mods and has not been sent to chat.',
  [ModerationMessageStatus.Blocked]:
    'Noice has blocked your message because it may violate the Noice Community Guidelines.',
  [ModerationMessageStatus.AutomodDenied]: 'Mods have denied your message.',
  [ModerationMessageStatus.TemporaryMuted]: 'You are temporary muted.',
  [ModerationMessageStatus.Spam]:
    'Noice has blocked your message because it may be repetitive.',
};

const sender: Record<ModerationMessageStatus, 'Automod' | undefined> = {
  [ModerationMessageStatus.AutomodAccepted]: 'Automod',
  [ModerationMessageStatus.AutomodPending]: 'Automod',
  [ModerationMessageStatus.Blocked]: undefined,
  [ModerationMessageStatus.AutomodDenied]: 'Automod',
  [ModerationMessageStatus.TemporaryMuted]: undefined,
  [ModerationMessageStatus.Spam]: undefined,
};

export function ModerationMessage({ message }: Props) {
  const { status, id: messageId } = message;

  return (
    <div className={styles.message}>
      <ChatEventMessageWrapper id={messageId}>
        <div className={styles.wrapper}>
          {sender[status] && (
            <>
              <span className={styles.sender}>{sender[status]}</span>:{' '}
            </>
          )}
          {statusTest[status]}
        </div>
      </ChatEventMessageWrapper>
    </div>
  );
}
