import { useAuthenticatedUser } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import { useEffect, useState } from 'react';

import { AutomodConfirmation } from '../AutomodConfirmation';
import { ChatInputForm } from '../ChatInputForm';
import { ChatMessages } from '../ChatMessages';
import { ChatMuteNotification } from '../ChatMuteNotification/ChatMuteNotification';

import styles from './Chat.module.css';

import { ChatPropSettings, ChatSettingsProvider } from '@chat-common/settings';
import { useChat, useChatContext } from '@chat-context';
import { ChatChannel } from '@chat-types';

interface Props extends ChatPropSettings {
  channelId: Nullable<string>;
  activeChannel: ChatChannel;
  onSendChatMessage?: (f: () => void) => void;
  sendTriggerEmote?(emoteId: string): void;
}

const getTimestamp = (duration: number) => {
  const time = new Date();
  time.setSeconds(time.getSeconds() + duration);
  return time;
};

const getPlaceholder = (channel: ChatChannel) => {
  if (channel === 'group') {
    return 'Send message to team';
  }

  if (channel === 'stream') {
    return 'Send message to stream';
  }
};

export function Chat({
  channelId,
  activeChannel,
  sendTriggerEmote,
  timestampType,
  onSendChatMessage = (f) => f(),
}: Props) {
  const { isImplicitAccount } = useAuthenticatedUser();
  const {
    messages: { chatId, sendMessage },
    moderatedMessageContent,
    cancelModeratedMessage,
  } = useChat(activeChannel);
  const { muteState, loadingUser } = useChatContext();

  const [replyToUsername, setReplyToUsername] = useState<Nullable<string>>(null);
  const [muteStartTime, setMuteStartTime] = useState<Nullable<Date>>(null);

  useEffect(() => {
    // We only mute user for stream chat
    if (activeChannel !== 'stream') {
      setMuteStartTime(null);
      return;
    }

    // Do nothing if not muted or no duration
    if (!muteState?.muted || !muteState.duration) {
      setMuteStartTime(null);
      return;
    }

    const secondsFromStart = Math.abs((Date.now() - (muteState?.startTime ?? 0)) / 1000);
    const timeStamp = getTimestamp(muteState.duration - secondsFromStart);

    // If timestamp is in past, do nothing
    if (timeStamp.getTime() <= Date.now()) {
      setMuteStartTime(null);
      return;
    }

    setMuteStartTime(timeStamp);
  }, [activeChannel, muteState]);

  return (
    <ChatSettingsProvider
      channelId={channelId}
      chatId={chatId}
      timestampType={timestampType}
    >
      <ChatMessages
        activeChannel={activeChannel}
        onReplyButtonClick={
          isImplicitAccount
            ? undefined
            : (replyUsername: string) => setReplyToUsername(replyUsername)
        }
      />

      <ChatMuteNotification
        muteStartTime={muteStartTime}
        onMuteCompleted={() => setMuteStartTime(null)}
      />

      <div className={styles.chatInputContainer}>
        <ChatInputForm
          disabled={
            loadingUser || !!muteStartTime || !!moderatedMessageContent || !chatId
          }
          placeholder={getPlaceholder(activeChannel)}
          replyTo={replyToUsername ?? undefined}
          sendMessage={(msg) => onSendChatMessage(() => sendMessage(msg))}
          sendTriggerEmote={sendTriggerEmote}
          onReplyCancel={() => setReplyToUsername(null)}
        />

        {moderatedMessageContent && (
          <AutomodConfirmation
            moderatedMessageContent={moderatedMessageContent}
            onCancel={cancelModeratedMessage}
            onSendMessage={sendMessage}
          />
        )}
      </div>
    </ChatSettingsProvider>
  );
}
