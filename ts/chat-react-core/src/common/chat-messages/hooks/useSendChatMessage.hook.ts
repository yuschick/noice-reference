import { gql } from '@apollo/client';
import { useClient } from '@noice-com/common-react-core';
import { EntityState } from '@noice-com/schemas/api/entity.pb';
import {
  ContentValidationErrorDetailsCause,
  ModerationStatus,
} from '@noice-com/schemas/chat/chat.pb';
import { Color } from '@noice-com/schemas/profile/profile.pb';
import { Nullable, hasPlatformErrorCause } from '@noice-com/utils';

import { InventoryEmojiFragment, SendChatMessageProfileFragment } from '../../../../gen';
import {
  ChatMessageModel,
  transformGraphqlColorToProtoColor,
  transformUserBadgeToChatMessageBadge,
} from '../../chat-message';
import { ChatMessageTextContentModel } from '../../chat-message/types';
import { parseEmojisFromMessage } from '../../emoji';
import { ModerationMessageModel, ModerationMessageStatus } from '../../moderation';

gql`
  fragment SendChatMessageProfile on ProfileProfile {
    userTag
    avatars {
      avatar2D
    }
    badges(channel_id: $channelId) {
      type
      level
    }
    preferredColor
  }
`;

interface HookResult {
  sendMessage(content: string, consentToModeration?: boolean): void;
}

interface Props {
  chatId: Nullable<string>;
  emojis: InventoryEmojiFragment[];
  profile: Nullable<SendChatMessageProfileFragment>;
  userId: string;
  addMessage(message: ChatMessageModel | ModerationMessageModel): void;
  removeMessages(
    type: 'ChatMessage',
    filter: (message: ChatMessageModel) => boolean,
  ): void;
  storeTempMessageRealMessageId(tempMessageId: string, messageId: string): void;
  onChatMessageModeration(message: Nullable<ChatMessageTextContentModel>): void;
  onTempMessageSendFail(messageId: string): void;
}

export function useSendChatMessage({
  addMessage,
  storeTempMessageRealMessageId,
  chatId,
  emojis,
  onChatMessageModeration,
  onTempMessageSendFail,
  profile,
  removeMessages,
  userId,
}: Props): HookResult {
  const client = useClient();

  const sendTempMessage = (
    messageId: string,
    chatId: string,
    textContent: ChatMessageTextContentModel,
  ) => {
    addMessage({
      chatItemType: 'ChatMessage',
      chatId,
      content: {
        textContent,
      },
      messageId,
      senderId: userId,
      moderationStatus: ModerationStatus.MODERATION_STATUS_UNSPECIFIED,
      state: EntityState.ENTITY_STATE_UNSPECIFIED,
      createdAt: new Date().toISOString(),
      senderInfo: {
        avatar2D: profile?.avatars?.avatar2D ?? '',
        badges: profile?.badges.map(transformUserBadgeToChatMessageBadge) ?? [],
        preferredColor: profile?.preferredColor
          ? transformGraphqlColorToProtoColor(profile.preferredColor)
          : Color.COLOR_UNSPECIFIED,
        userId,
        username: profile?.userTag ?? '',
      },
      isTemporaryMessage: true,
    });

    return messageId;
  };

  const sendMessage = async (content: string, consentToModeration?: boolean) => {
    if (!chatId) {
      return;
    }

    // Regex modified from: https://stackoverflow.com/a/28847388/544847
    const parsedContent = content.replace(/&(?:#x[a-f0-9]+|#[0-9]+);?/gi, '').trim();

    if (!parsedContent.length) {
      return;
    }

    const attachments = parseEmojisFromMessage(parsedContent, emojis);

    const textContent = {
      text: parsedContent,
      attachments,
      links: [],
    };

    const tempMessageId = new Date().getTime().toString();

    // Do not send temp message if this is a moderated message
    if (!consentToModeration) {
      sendTempMessage(tempMessageId, chatId, textContent);
    }

    try {
      const { messageId } = await client.ChatService.sendChatMessage(
        chatId,
        {
          textContent,
        },
        !!consentToModeration,
      );

      if (messageId) {
        storeTempMessageRealMessageId(tempMessageId, messageId);
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      if (
        hasPlatformErrorCause(
          e,
          ContentValidationErrorDetailsCause.CAUSE_REQUIRES_MODERATION,
        )
      ) {
        // Remove the temp message
        removeMessages('ChatMessage', (message) => message.messageId === tempMessageId);

        onChatMessageModeration(textContent);

        return;
      }

      if (
        hasPlatformErrorCause(
          e,
          ContentValidationErrorDetailsCause.CAUSE_GUIDELINES_VIOLATION,
        )
      ) {
        const now = new Date();
        const id = now.getTime().toString();

        // Remove the temp message
        removeMessages('ChatMessage', (message) => message.messageId === tempMessageId);

        addMessage({
          chatItemType: 'ModerationMessage',
          id,
          userId,
          status: ModerationMessageStatus.Blocked,
        });
        return;
      }

      onTempMessageSendFail(tempMessageId);

      return;
    }

    if (consentToModeration) {
      const now = new Date();
      const id = now.getTime().toString();

      addMessage({
        chatItemType: 'ModerationMessage',
        id,
        userId,
        status: ModerationMessageStatus.AutomodPending,
      });
    }

    onChatMessageModeration(null);
  };

  return {
    sendMessage,
  };
}
