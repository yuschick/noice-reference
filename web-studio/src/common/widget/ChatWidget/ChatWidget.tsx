import { CoreAssets } from '@noice-com/assets-core';
import { ChatProvider, Chat } from '@noice-com/chat-react-web';
import { useEffect, useState } from 'react';

import { ChatUserListWidget } from '../ChatUserListWidget/ChatUserListWidget';
import { useWidgetLayout, useWidgetMenu } from '../context';
import {
  LiveChannelWidgetProps,
  WidgetOfflineCheck,
  WidgetId,
  ChatWidgetOptions,
} from '../types';

import styles from './ChatWidget.module.css';
import { MenuControlButton } from './MenuControlButton/MenuControlButton';

import { useChannelContext } from '@common/channel';
import { useStreamContext } from '@common/stream';

function ChatWidget(props: LiveChannelWidgetProps) {
  const { channelChatId, reloadChannelChat, channelId } = useChannelContext();
  const { widgetId } = props;
  const [widgetOptions, setWidgetOptions] = useState<ChatWidgetOptions>();
  const { onOptionsChanged } = useWidgetLayout();
  const { setControls } = useWidgetMenu();
  const { streamId } = useStreamContext();

  useEffect(() => {
    // Reload chat when ever streamId changes.
    reloadChannelChat();
  }, [reloadChannelChat, streamId]);

  useEffect(() => {
    if (widgetOptions) {
      onOptionsChanged(widgetId, widgetOptions);
    }
  }, [onOptionsChanged, widgetOptions, widgetId]);

  useEffect(() => {
    setControls([
      <MenuControlButton
        active={widgetOptions?.showUserList}
        icon={CoreAssets.Icons.Group}
        key="player-list-mode"
        label={widgetOptions?.showUserList ? 'Hide user list' : 'Show user list'}
        showLabel
        onClick={() =>
          setWidgetOptions((prev) => ({ ...prev, showUserList: !prev?.showUserList }))
        }
      />,
    ]);
  }, [setControls, widgetOptions]);

  if (widgetOptions?.showUserList) {
    return <ChatUserListWidget {...props} />;
  }

  return (
    <ChatProvider
      channelId={channelId}
      streamChatId={channelChatId ?? null}
    >
      <div className={styles.studioChat}>
        <Chat
          activeChannel="stream"
          channelId={channelId}
          timestampType="static"
        />
      </div>
    </ChatProvider>
  );
}

export default {
  offline: ({ streamId }: WidgetOfflineCheck) => {
    return !streamId
      ? {
          title: 'Chat offline',
          description: 'Start streaming to interact with you audience!',
        }
      : null;
  },
  id: WidgetId.Chat,
  Component: ChatWidget,
} as const;
