/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { BadgeType } from '@noice-com/schemas/badge/badge.pb';
import { ChatMessage, MessageContent, SenderInfo } from '@noice-com/schemas/chat/chat.pb';
import { Color } from '@noice-com/schemas/profile/profile.pb';

import { ChatMessageModel, ChatSenderInfoModel } from './types';

import { BadgeBadgeType, ProfileColor, UserBadgeFragment } from 'gen';

const badgeTypeMap: Record<
  ChatMessageModel['senderInfo']['badges'][0]['type'],
  UserBadgeFragment['type']
> = {
  [BadgeType.TYPE_UNSPECIFIED]: BadgeBadgeType.TypeUnspecified,
  [BadgeType.TYPE_STREAMER]: BadgeBadgeType.TypeStreamer,
  [BadgeType.TYPE_CLOSED_BETA_CREATOR]: BadgeBadgeType.TypeClosedBetaCreator,
  [BadgeType.TYPE_NOICE_STAFF]: BadgeBadgeType.TypeNoiceStaff,
  [BadgeType.TYPE_CHANNEL_MODERATOR]: BadgeBadgeType.TypeChannelModerator,
  [BadgeType.TYPE_SUBS_GIFTER]: BadgeBadgeType.TypeSubsGifter,
  [BadgeType.TYPE_CHANNEL_SUBSCRIBER]: BadgeBadgeType.TypeChannelSubscriber,
};

export const transformChatMessageBadgeToUserBadge = (
  badge: ChatMessageModel['senderInfo']['badges'][0],
): UserBadgeFragment => ({
  __typename: 'BadgeBadge',
  type: badgeTypeMap[badge.type],
  level: badge.level,
});

export const transformUserBadgeToChatMessageBadge = (
  badge: UserBadgeFragment,
): ChatMessageModel['senderInfo']['badges'][0] => ({
  level: badge.level,
  type: (
    Object.keys(badgeTypeMap) as ChatMessageModel['senderInfo']['badges'][0]['type'][]
  ).find((key) => badgeTypeMap[key] === badge.type)!,
});

const transformProtoSenderInfoToChatSenderInfoModel = (
  protoSenderInfo: SenderInfo,
): ChatSenderInfoModel => ({
  avatar2D: protoSenderInfo.avatar2D!,
  preferredColor: protoSenderInfo.preferredColor!,
  userId: protoSenderInfo.userId!,
  username: protoSenderInfo.username!,
  badges: protoSenderInfo.badges!.map((badge) => ({
    type: badge.type!,
    level: badge.level!,
  })),
});

const transformProtoChatMessageContentToChatMessageModelContent = (
  content: MessageContent,
): ChatMessageModel['content'] => {
  if (content.tombstone) {
    return {
      tombstone: content.tombstone,
    };
  }

  return {
    textContent: {
      text: content.textContent!.text!,
      attachments: content.textContent!.attachments!.map((attachment) => ({
        label: attachment.label!,
        source: attachment.source!,
        startIndex: attachment.startIndex!,
        endIndex: attachment.endIndex!,
        itemId: attachment.itemId!,
      })),
      links: content.textContent!.links!.map((link) => ({
        startIndex: link.startIndex!,
        endIndex: link.endIndex!,
        url: link.url!,
      })),
    },
  };
};

export const transformProtoChatMessageToChatMessageModel = (
  protoChatMessage: ChatMessage,
): ChatMessageModel => ({
  chatItemType: 'ChatMessage',
  messageId: protoChatMessage.messageId!,
  senderId: protoChatMessage.senderId!,
  moderationStatus: protoChatMessage.moderationStatus!,
  chatId: protoChatMessage.chatId!,
  createdAt: protoChatMessage.createdAt!,
  state: protoChatMessage.state!,
  senderInfo: transformProtoSenderInfoToChatSenderInfoModel(protoChatMessage.senderInfo!),
  content: transformProtoChatMessageContentToChatMessageModelContent(
    protoChatMessage.content!,
  ),
});

const colorMap: Record<ProfileColor, Color> = {
  [ProfileColor.ColorUnspecified]: Color.COLOR_UNSPECIFIED,
  [ProfileColor.Color_56F6C0]: Color.COLOR_56F6C0,
  [ProfileColor.Color_63F655]: Color.COLOR_63F655,
  [ProfileColor.Color_6Ec9F7]: Color.COLOR_6EC9F7,
  [ProfileColor.Color_8686F9]: Color.COLOR_8686F9,
  [ProfileColor.ColorB26Afb]: Color.COLOR_B26AFB,
  [ProfileColor.ColorC0F656]: Color.COLOR_C0F656,
  [ProfileColor.ColorF69856]: Color.COLOR_F69856,
  [ProfileColor.ColorF6Ce56]: Color.COLOR_F6CE56,
  [ProfileColor.ColorF6F656]: Color.COLOR_F6F656,
  [ProfileColor.ColorF76Ef7]: Color.COLOR_F76EF7,
};

export const transformGraphqlColorToProtoColor = (color: ProfileColor) => colorMap[color];

export const transformProtoColorToGraphqlColor = (color: Color) => {
  const key = (Object.keys(colorMap) as ProfileColor[]).find(
    (key) => colorMap[key] === color,
  );

  return key as ProfileColor;
};
