import { gql } from '@apollo/client';
import {
  useAuthenticatedUser,
  useBooleanFeatureFlag,
  useKeyContentLoadTracker,
} from '@noice-com/common-ui';

import styles from './ChatMessages.module.css';
import { ChatMessagesContent } from './ChatMessagesContent/ChatMessagesContent';
import { ChatWrapper } from './ChatWrapper';

import { useChat } from '@chat-context';
import { useChatMeProfileQuery } from '@chat-gen';
import { ChatChannel } from '@chat-types';

gql`
  query ChatMeProfile($userId: ID!) {
    profile(userId: $userId) {
      userId
      ...ChatMessagesProfile
    }
  }
`;

interface Props {
  activeChannel: ChatChannel;
  onReplyButtonClick?: (replyPlayerName: string) => void;
}

export function ChatMessages({ activeChannel, onReplyButtonClick }: Props) {
  const [useChatAutoWrapperDebugMode] = useBooleanFeatureFlag(
    'chatAutoWrapperDebugMode',
    false,
  );

  const { userId } = useAuthenticatedUser();

  const {
    messages: { messages, loading: loadingMessages, loadOlderMessages, updateCap },
  } = useChat(activeChannel);

  useKeyContentLoadTracker('chat_messages', loadingMessages);

  const { data, loading: profileLoading } = useChatMeProfileQuery({
    variables: {
      userId,
    },
  });

  const me = data?.profile ?? null;

  const loading = !!profileLoading || !!loadingMessages;

  return (
    <ChatWrapper
      __UNSAFE_debugMode={useChatAutoWrapperDebugMode}
      className={styles.chatScrollContainer}
      key={activeChannel}
      loadOlderMessages={loadOlderMessages}
      messages={messages}
      updateMessageCap={updateCap}
    >
      <ChatMessagesContent
        loading={loading}
        me={me}
        messages={messages}
        onReplyButtonClick={onReplyButtonClick}
      />
    </ChatWrapper>
  );
}
