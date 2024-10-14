import { CoreAssets } from '@noice-com/assets-core';
import { Chat, ChatChannel } from '@noice-com/chat-react-web';
import { IconButton } from '@noice-com/common-ui';
import classNames from 'classnames';
import { useState } from 'react';

import styles from './ChatSm.module.css';

import {
  UpSellingDialogSource,
  useImplicitAccountUpSellingAction,
} from '@common/implicit-account';
import { useStreamGame } from '@common/stream';

interface Props {
  className?: string;
  channelId: string;
  onClose: () => void;
}

export function ChatSm({ className, channelId, onClose }: Props) {
  const [activeChannel, setActiveChannel] = useState<ChatChannel>('stream');
  const { isSolo, matchGroupId } = useStreamGame();
  const { onAction } = useImplicitAccountUpSellingAction(
    UpSellingDialogSource.ChatMessage,
  );

  return (
    <div className={classNames(styles.chatSmRoot, className)}>
      <div className={styles.chatSmHeader}>
        {!isSolo && matchGroupId ? (
          <>
            <span
              className={classNames(styles.chatSmHeaderTab, {
                [styles.active]: activeChannel === 'stream',
              })}
            >
              <IconButton
                icon={CoreAssets.Icons.Chat}
                label="Stream chat"
                size="sm"
                variant="ghost"
                onClick={() => setActiveChannel('stream')}
              />
            </span>

            <span
              className={classNames(styles.chatSmHeaderTab, {
                [styles.active]: activeChannel === 'group',
              })}
            >
              <IconButton
                icon={CoreAssets.Icons.TeamChat}
                label="Group chat"
                size="sm"
                variant="ghost"
                onClick={() => setActiveChannel('group')}
              />
            </span>
          </>
        ) : (
          <div className={styles.chatSmTitle}>Chat</div>
        )}

        <span className={styles.chatSmHeaderClose}>
          <IconButton
            icon={CoreAssets.Icons.Close}
            label="Close chat"
            level="secondary"
            size="sm"
            onClick={onClose}
          />
        </span>
      </div>

      <Chat
        activeChannel={activeChannel}
        channelId={channelId}
        onSendChatMessage={onAction}
      />
    </div>
  );
}
