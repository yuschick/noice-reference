import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import { useNavigation } from '@react-navigation/native';
import { Image } from 'expo-image';
import { Fragment, useMemo } from 'react';
import { Alert, StyleSheet, TouchableOpacity } from 'react-native';

import { Avatar } from '@components/Avatar';
import { Gutter } from '@components/Gutter';
import { HStack } from '@components/Stack/HStack';
import { Typography } from '@components/Typography';
import { UserBadge } from '@components/UserBadge';
import { borderRadius, colors, typography } from '@constants/styles';
import { ChatMessageWithSenderFragment, useStreamChatMessageQuery } from '@gen/graphql';
import { useParsedChatMessage } from '@hooks/chat/useParsedChatMessage';
import {
  DELETED_CHAT_MESSAGE_DEFAULT_TEXT,
  isDeletedChatMessage,
} from '@hooks/chat/utils/chat-message';
import { useAuth } from '@hooks/useAuth.hook';
import { AuthenticatedNavigationHookProps } from '@navigators/routes';
import { openURL } from '@utils/open-url';
import { getUserIdColor } from '@utils/user-id-color';

interface Props {
  message: ChatMessageWithSenderFragment;
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

export const StreamChatMessage = ({ message, ownUserTag, channelId }: Props) => {
  const { userId } = useAuth();
  const messageNodes = useParsedChatMessage({
    message,
    ownUserTag,
  });

  const { data, loading: loadingProfile } = useStreamChatMessageQuery({
    ...variablesOrSkip({ userId: message.senderId, channelId }),
  });

  const navigation = useNavigation<AuthenticatedNavigationHookProps>();

  const openUserModal = () => {
    navigation.navigate('streamProfileModal', {
      userId: message.senderId,
      channelId,
      chatId: message.chatId,
      messageId: message.messageId,
    });
  };

  const openLink = (url: string) => {
    Alert.alert('Open in browser', 'This link will open in a new browser window.', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Open',
        onPress: () => {
          openURL(`https://${url}`);
        },
      },
    ]);
  };

  const messageElements = useMemo(() => {
    return messageNodes?.map((node, i) => {
      if (node.type === 'text') {
        return (
          <Fragment key={'message-content-text-' + i + '-' + message.messageId}>
            {node.content}
          </Fragment>
        );
      }

      if (node.type === 'mention') {
        return (
          <Typography
            color="greenMain"
            fontWeight="semiBold"
            key={'message-mention-' + i + '-' + message.messageId}
            lineHeight={LINE_HEIGHT}
            style={s.flex}
          >
            {node.content}{' '}
          </Typography>
        );
      }

      if (node.type === 'link') {
        return (
          <Fragment key={'message-link-' + i + '-' + message.messageId}>
            <Typography
              accessibilityHint="Link will open in a browser"
              color="whiteMain"
              fontWeight="medium"
              lineHeight={LINE_HEIGHT}
              style={[s.flex, s.link]}
              onPress={() => openLink(node.content)}
            >
              {node.content}
            </Typography>
            {/* empty whitespace without underline */}
            <Typography> </Typography>
          </Fragment>
        );
      }

      if (node.type === 'emoji') {
        return (
          <Image
            key={'message-image-' + i + '-' + message.messageId}
            source={{ uri: node.content }}
            style={s.emojiIcon}
          />
        );
      }
    });
  }, [message.messageId, messageNodes]);

  const isDeleted = isDeletedChatMessage(message);
  const userTagColor = getUserIdColor({
    userId: message.senderId,
    preferredColor: data?.profile?.preferredColor,
  });

  if (loadingProfile || !data?.profile || (!messageNodes.length && !isDeleted)) {
    return null;
  }

  const isOwnMessage = message.senderId === userId;
  const mentionsYou = messageNodes.some((node) => node.type === 'mention');

  return (
    <HStack
      style={[
        {
          backgroundColor: mentionsYou ? colors.gray800 : colors.transparent,
        },
        s.messageContainer,
      ]}
    >
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
            <Fragment
              key={'badge-' + badge.type + '-' + badge.level + '-' + message.messageId}
            >
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
          <>{messageElements}</>
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
  link: {
    textDecorationLine: 'underline',
  },
  emojiIcon: {
    width: 20,
    height: 20,
  },
  messageContainer: {
    borderRadius: borderRadius.radiusSm,
    padding: 4,
  },
});
