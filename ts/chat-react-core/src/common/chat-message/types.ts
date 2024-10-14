// eslint-disable-next-line no-restricted-imports
import { ChatMessage, SenderInfo, TextMessage } from '@noice-com/schemas/chat/chat.pb';
import { DeepRequired } from '@noice-com/utils';

export type ChatSenderInfoModel = DeepRequired<
  Pick<SenderInfo, 'avatar2D' | 'preferredColor' | 'userId' | 'username'>
> & {
  badges: Required<Pick<Required<SenderInfo>['badges'][0], 'type' | 'level'>>[];
};

export type ChatMessageTextContentModel = Omit<
  DeepRequired<ChatMessage>['content']['textContent'],
  'links'
> & { links?: DeepRequired<TextMessage>['links'] };

export type ChatMessageModel = DeepRequired<
  Pick<
    ChatMessage,
    'chatId' | 'messageId' | 'senderId' | 'createdAt' | 'moderationStatus' | 'state'
  >
> & {
  chatItemType: 'ChatMessage';
  senderInfo: ChatSenderInfoModel;
  content:
    | {
        tombstone: DeepRequired<ChatMessage>['content']['tombstone'];
        textContent?: never;
      }
    | {
        tombstone?: never;
        textContent: ChatMessageTextContentModel;
      };
} & (
    | { isTemporaryMessage: true; hasFailedToSend?: boolean }
    | { isTemporaryMessage?: never; hasFailedToSend?: never }
  );
