import { Chat } from '@noice-com/chat-react-web';
import { Nullable } from '@noice-com/utils';

import { useChatChannelUnreadStatus } from './hooks';
import { ChatChannel } from './types';

import {
  UpSellingDialogSource,
  useImplicitAccountUpSellingAction,
} from '@common/implicit-account';
import { useStreamGame } from '@common/stream';

interface Props {
  channelId: Nullable<string>;
  chatTabIsActive: boolean;
  activeChatChannel: ChatChannel;
}

export function ChatTab({ chatTabIsActive, channelId, activeChatChannel }: Props) {
  const { gameInstance } = useStreamGame();
  useChatChannelUnreadStatus({ activeChannel: activeChatChannel, chatTabIsActive });
  const { onAction } = useImplicitAccountUpSellingAction(
    UpSellingDialogSource.ChatMessage,
  );

  return (
    <Chat
      activeChannel={activeChatChannel}
      channelId={channelId}
      sendTriggerEmote={(emoteId) => gameInstance?.triggerEmote(emoteId)}
      onSendChatMessage={onAction}
    />
  );
}
