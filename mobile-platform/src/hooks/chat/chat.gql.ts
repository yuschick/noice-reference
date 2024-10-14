import { gql } from '@apollo/client';

gql`
  query ChatModerationStatus($chatId: ID!, $userId: ID!) {
    chatUserStatus(chatId: $chatId, userId: $userId) {
      muted
      muteDuration
    }
  }

  query ChatHistory($chatId: ID!, $channelId: ID, $cursor: APICursorInput) {
    chatMessages(chatId: $chatId, cursor: $cursor) {
      messages {
        ... on ChatChatMessage {
          ...ChatMessageWithSender
          sender {
            badges(channel_id: $channelId) {
              ...UserBadge
            }
          }
        }
      }
    }
  }

  query ChatMessageSenderProfile($userId: ID!, $channelId: ID) {
    profile(userId: $userId) {
      userId
      ...ChatMessageSenderProfile
      badges(channel_id: $channelId) {
        ...UserBadge
      }
    }
  }

  subscription ChatSubscription($chatId: ID!) {
    chatMessageSubscribe(chatId: $chatId) {
      event {
        ... on ChatChatMessage {
          ...ChatMessage
        }
        ... on ChatHideMessage {
          messageId
        }
        ... on ChatUserMuted {
          userId
          duration
        }
        ... on ChatUserBanned {
          userId
        }
        ... on ChatMessageDenied {
          userId
        }
      }
    }
  }

  fragment ChatMessageWithSender on ChatChatMessage {
    ...ChatMessage
    sender {
      ...ChatMessageSenderProfile
    }
  }

  fragment ChatMessage on ChatChatMessage {
    senderId
    chatId
    state
    messageId
    createdAt
    moderationStatus
    content {
      content {
        ... on ChatTextMessage {
          text
          attachments {
            ...UseChatEmojisAndMentionsAttachment
          }
          links {
            ...ChatMessageLink
          }
        }
        ... on ChatTombstone {
          emptyTypeWorkaround
        }
      }
    }
  }

  fragment UseChatEmojisAndMentionsAttachment on ChatTextMessageAttachment {
    label
    source
    itemId
    startIndex
    endIndex
  }

  fragment ChatMessageLink on ChatTextMessageLink {
    startIndex
    endIndex
    url
    __typename
  }

  fragment UserBadge on BadgeBadge {
    type
    level
  }

  fragment ChatMessageSenderProfile on ProfileProfile {
    userId
    userTag
    preferredColor
    avatars {
      avatar2D
    }
  }
`;
