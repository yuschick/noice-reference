import { gql } from '@apollo/client';
import {
  ChatSenderInfoModel,
  transformGraphqlColorToProtoColor,
  transformUserBadgeToChatMessageBadge,
  useChatMessages,
} from '@noice-com/chat-react-core';
import { Nullable } from '@noice-com/utils';

import { useOwnChatSenderInfoProfileQuery } from '@gen/graphql';

gql`
  query OwnChatSenderInfoProfile($userId: ID!, $channelId: ID) {
    profile(userId: $userId) {
      userId
      userTag
      avatars {
        avatar2D
      }
      preferredColor
      badges(channel_id: $channelId) {
        ...UserBadge
      }
    }
  }
`;

interface Props {
  userId: string;
  channelId: Nullable<string>;
  updateStreamChatSenderInfo: ReturnType<typeof useChatMessages>['updateSenderInfo'];
}

export function useUpdateOwnChatSenderInfo({
  channelId,
  userId,
  updateStreamChatSenderInfo,
}: Props) {
  useOwnChatSenderInfoProfileQuery({
    fetchPolicy: 'cache-only',
    returnPartialData: true,
    variables: {
      userId,
      channelId,
    },
    onCompleted(data) {
      const profile = data.profile;
      if (!profile) {
        return;
      }

      const senderInfo: Partial<ChatSenderInfoModel> = {};

      if (profile.userTag) {
        senderInfo.username = profile.userTag;
      }

      if (profile.preferredColor) {
        senderInfo.preferredColor = transformGraphqlColorToProtoColor(
          profile.preferredColor,
        );
      }

      if (profile.avatars?.avatar2D) {
        senderInfo.avatar2D = profile.avatars.avatar2D;
      }

      if (channelId && profile.badges) {
        senderInfo.badges = profile.badges.map(transformUserBadgeToChatMessageBadge);
      }

      updateStreamChatSenderInfo(userId, senderInfo);
    },
  });
}
