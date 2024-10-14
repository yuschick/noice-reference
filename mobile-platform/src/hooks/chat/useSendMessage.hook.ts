import { gql } from '@apollo/client';
import { ContentValidationErrorDetailsCause } from '@noice-com/schemas/chat/chat.pb';
import { Nullable } from '@noice-com/utils';

import {
  AutomodState,
  ModerationMessageModel,
  ModerationMessageStatus,
} from './types/moderation';

import { useSendChatMessageMutation } from '@gen/graphql';
import { hasPlatformErrorCause } from '@utils/error';

gql`
  mutation SendChatMessage(
    $chatId: ID!
    $content: ChatTextMessageInput!
    $consentToModeration: Boolean
  ) {
    sendChatMessage(
      chatId: $chatId
      content: { textContent: $content }
      consentToModeration: $consentToModeration
    ) {
      messageId
    }
  }
`;

interface Props {
  userId: Nullable<string>;
  onAutomodState: (message: Nullable<AutomodState>) => void;
  onModerationMessage: (message: ModerationMessageModel) => void;
}

export const useSendMessage = ({
  userId,
  onAutomodState,
  onModerationMessage,
}: Props) => {
  const [mutateSendChatMessage] = useSendChatMessageMutation({
    onError(error, clientOptions) {
      const variables = clientOptions?.variables;

      if (!variables) {
        return;
      }

      if (!variables.content) {
        return;
      }

      if (
        error.graphQLErrors.find((e) =>
          hasPlatformErrorCause(
            e,
            ContentValidationErrorDetailsCause.CAUSE_REQUIRES_MODERATION,
          ),
        )
      ) {
        onAutomodState({
          messageContent: variables.content,
        });
        return;
      }

      if (
        error.graphQLErrors.find((e) =>
          hasPlatformErrorCause(
            e,
            ContentValidationErrorDetailsCause.CAUSE_GUIDELINES_VIOLATION,
          ),
        )
      ) {
        const now = new Date();
        const id = now.getTime().toString();

        if (userId) {
          onModerationMessage({
            id,
            type: 'moderation',
            content: {
              id: userId,
              status: ModerationMessageStatus.AutomodBlocked,
            },
            time: now,
          });
        }

        return;
      }
    },
    onCompleted(_data, clientOptions) {
      const variables = clientOptions?.variables;

      if (!variables) {
        return;
      }

      if (variables.consentToModeration) {
        const now = new Date();
        const id = now.getTime().toString();

        if (userId) {
          onModerationMessage({
            id,
            type: 'moderation',
            content: {
              id: userId,
              status: ModerationMessageStatus.AutomodPending,
            },
            time: now,
          });
        }
      }

      onAutomodState(null);
    },
  });

  return {
    mutateSendChatMessage,
  };
};
