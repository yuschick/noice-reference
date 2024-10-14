import { gql } from '@apollo/client';
import { CoreAssets } from '@noice-com/assets-core';
import { IconButton } from '@noice-com/common-ui';

import { useHideChatMessageMutation } from '@chat-gen';

gql`
  mutation HideChatMessage($chatId: ID!, $messageId: ID!) {
    hideChatMessage(chatId: $chatId, messageId: $messageId) {
      emptyTypeWorkaround
    }
  }
`;

interface Props {
  messageId: string;
  chatId: string;
  isDeletedMessage: boolean;
  isDeletedMessageHidden: boolean;
  toggleDeletedMessageVisibility(): void;
}

export function ChatMessageModerationTools({
  messageId,
  chatId,
  isDeletedMessage,
  isDeletedMessageHidden,
  toggleDeletedMessageVisibility,
}: Props) {
  const [hideMessage, { loading }] = useHideChatMessageMutation({
    variables: { chatId, messageId },
  });

  if (isDeletedMessage) {
    return (
      <IconButton
        icon={isDeletedMessageHidden ? CoreAssets.Icons.Eye : CoreAssets.Icons.Hidden}
        label={isDeletedMessageHidden ? 'Show deleted message' : 'Hide deleted message'}
        size="xs"
        variant="ghost"
        onClick={toggleDeletedMessageVisibility}
      />
    );
  }
  return (
    <IconButton
      icon={CoreAssets.Icons.Trash}
      isLoading={loading}
      label="Delete message"
      size="xs"
      variant="ghost"
      onClick={() => hideMessage()}
    />
  );
}
