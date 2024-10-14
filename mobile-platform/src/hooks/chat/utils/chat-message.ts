import { DeepPartial } from '@noice-com/utils';

import { ApiEntityState, ChatChatMessage } from '@gen/graphql';

export const isDeletedChatMessage = <T extends DeepPartial<ChatChatMessage>>(
  chatMessage: T,
) =>
  chatMessage.content?.content?.__typename === 'ChatTombstone' ||
  chatMessage.state === ApiEntityState.EntityStateBlocked;

export const DELETED_CHAT_MESSAGE_DEFAULT_TEXT = 'Message was deleted by moderator.';
export const UNSUPPORTED_CHAT_MESSAGE_TEXT = 'Unsupported message type.';
