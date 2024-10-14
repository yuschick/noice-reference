import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import {
  ChatMessageModel,
  getChatMessageText,
  isDeletedChatMessage,
} from '@noice-com/chat-react-core';
import { useNavigation } from '@react-navigation/native';
import { Fragment } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { useChatEmojisAndMentions } from './hooks/useChatEmojisAndMentions.hook';
import {
  renderEmoji,
  renderLink,
  renderMention,
  renderText,
} from './StreamChatChunkRenderers';

import { Avatar } from '@components/Avatar';
import { Gutter } from '@components/Gutter';
import { HStack } from '@components/Stack/HStack';
import { Typography } from '@components/Typography';
import { UserBadge } from '@components/UserBadge';
import { borderRadius, colors, typography } from '@constants/styles';
import { useStreamChatMessageQuery } from '@gen/graphql';
import { DELETED_CHAT_MESSAGE_DEFAULT_TEXT } from '@hooks/chat/utils/chat-message';
import { useAuth } from '@hooks/useAuth.hook';
import { AuthenticatedNavigationHookProps } from '@navigators/routes';
import { IconAssets } from '@utils/icons';
import { getUserIdColor } from '@utils/user-id-color';

interface Props {
  chatMessage: ChatMessageModel;
  ownUserTag: string;
  channelId: string;
}

gql`
  query StreamChatMessage($userId: ID!, $channelId: ID) {
    profile(userId: $userId) {
      userId
      ...AvatarView
      preferredColor
      badges(channel_id: $channelId) {
        ...UserBadge
      }
    }
  }
  ${Avatar.fragments.profile}
`;

const LINE_HEIGHT: keyof typeof typography.lineHeight = 'xl';
const FONT_SIZE: keyof typeof typography.fontSize = 'md';

export const StreamChatMessage = ({ chatMessage, ownUserTag, channelId }: Props) => {
  const { userId } = useAuth();

  const { senderId, chatId, messageId, hasFailedToSend } = chatMessage;

  const message = getChatMessageText(chatMessage);
  const attachments = chatMessage.content.textContent?.attachments;
  const links = chatMessage.content.textContent?.links;

  const { data, loading: loadingProfile } = useStreamChatMessageQuery({
    ...variablesOrSkip({ userId: chatMessage.senderId, channelId }),
  });

  const navigation = useNavigation<AuthenticatedNavigationHookProps>();

  const openUserModal = () => {
    navigation.navigate('streamProfileModal', {
      userId: senderId,
      channelId,
      chatId,
      messageId,
    });
  };

  const { messageNodes, mentionsMe } = useChatEmojisAndMentions({
    message,
    attachments,
    links,
    messageId,
    ownPlayerName: ownUserTag,
    renderEmoji,
    renderLink,
    renderMention,
    renderText,
  });

  const isDeleted = isDeletedChatMessage(chatMessage);
  const userTagColor = getUserIdColor({
    userId: senderId,
    preferredColor: data?.profile?.preferredColor,
  });

  if (loadingProfile || !data?.profile || (!messageNodes.length && !isDeleted)) {
    return null;
  }

  const isOwnMessage = senderId === userId;

  return (
    <HStack
      style={[
        {
          backgroundColor: mentionsMe ? colors.gray800 : colors.transparent,
        },
        s.messageContainer,
      ]}
    >
      {hasFailedToSend && (
        <>
          <IconAssets.Alert
            color={colors.statusErrorMain}
            height={24}
            width={24}
          />
          <Gutter width={8} />
        </>
      )}
      <TouchableOpacity
        disabled={isOwnMessage}
        onPress={openUserModal}
      >
        <Avatar
          profile={data.profile}
          size="xSmall"
        />
      </TouchableOpacity>
      <Gutter width={8} />
      <Typography
        fontSize={FONT_SIZE}
        style={s.container}
      >
        {/*
          HACK: adding some empty text here is needed for lineHeight
          to be respected, you can't add some non text element at first.
        */}
        <Typography lineHeight={LINE_HEIGHT}>{'\u0000'}</Typography>
        <TouchableOpacity
          disabled={isOwnMessage}
          style={s.row}
          onPress={openUserModal}
        >
          {data.profile.badges?.map((badge) => (
            <Fragment key={'badge-' + badge.type + '-' + badge.level + '-' + messageId}>
              <UserBadge
                badge={badge}
                size={18}
              />
              <Gutter width={6} />
            </Fragment>
          ))}
          <Typography
            fontSize={FONT_SIZE}
            fontWeight="bold"
            style={{
              color: userTagColor,
            }}
          >
            {data.profile.userTag}
            {': '}
          </Typography>
        </TouchableOpacity>
        {!isDeleted ? (
          <>{messageNodes}</>
        ) : (
          <Typography
            color="textSecondary"
            fontSize={FONT_SIZE}
            fontWeight="regular"
            lineHeight={LINE_HEIGHT}
            style={s.flex}
          >
            {DELETED_CHAT_MESSAGE_DEFAULT_TEXT}
          </Typography>
        )}
      </Typography>
    </HStack>
  );
};

const s = StyleSheet.create({
  row: { flexDirection: 'row' },
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  flex: {
    flex: 1,
  },
  messageContainer: {
    borderRadius: borderRadius.radiusSm,
    padding: 4,
  },
});
