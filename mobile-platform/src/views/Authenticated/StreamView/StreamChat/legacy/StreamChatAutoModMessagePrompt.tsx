import { Image } from 'expo-image';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, FadeOut } from 'react-native-reanimated';

import { ButtonLarge } from '@components/ButtonLarge';
import { Gutter } from '@components/Gutter';
import { HStack } from '@components/Stack/HStack';
import { Typography } from '@components/Typography';
import { colors } from '@constants/styles';
import { ChatTextMessage } from '@gen/graphql';
import { parseChatMessage } from '@hooks/chat/utils/parse-chat';

interface Props {
  message: ChatTextMessage;
  onSend?: () => void;
  onCancel?: () => void;
}

export const StreamChatAutoModMessagePrompt = ({ message, onSend, onCancel }: Props) => {
  const nodes = useMemo(() => {
    const chunks = parseChatMessage({ __typename: 'ChatTextMessage', ...message });

    return chunks.map((chunk, index) => {
      if (chunk.type === 'text') {
        return (
          <Typography
            color="textSecondary"
            key={'chunk-message-' + index}
            lineHeight="lg"
          >
            {chunk.content}
          </Typography>
        );
      }

      if (chunk.type === 'emoji') {
        return (
          <Image
            key={'chunk-message-' + index}
            source={{ uri: chunk.content }}
            style={s.emoji}
          />
        );
      }
    });
  }, [message]);

  return (
    <Animated.View
      entering={FadeInDown}
      exiting={FadeOut}
      style={s.container}
    >
      <Typography>
        Are you sure you want to send this message? If you click Send, it will be sent to
        this channel&lsquo;s moderators for review.
      </Typography>
      <Gutter height={16} />
      <View style={s.messageContainer}>
        <Typography
          color="textSecondary"
          lineHeight="lg"
        >
          {nodes}
        </Typography>
      </View>
      <Gutter height={16} />
      <HStack>
        <ButtonLarge
          analyticsActionName="SEND_AUTO_MOD_MESSAGE"
          backgroundColor="whiteTransparent10"
          style={s.flex}
          onPress={onSend}
        >
          Send
        </ButtonLarge>
        <Gutter width={8} />
        <ButtonLarge
          analyticsActionName="CANCEL_AUTO_MOD_MESSAGE"
          backgroundColor="whiteTransparent10"
          style={s.flex}
          onPress={onCancel}
        >
          Cancel
        </ButtonLarge>
      </HStack>
    </Animated.View>
  );
};

const s = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    padding: 16,
    borderRadius: 16,
    marginHorizontal: 8,
    backgroundColor: colors.gray850,
    position: 'absolute',
    bottom: 0,
  },
  messageContainer: {
    paddingLeft: 6,
    borderLeftWidth: 2,
    borderLeftColor: colors.magentaMain,
  },
  emoji: {
    width: 20,
    height: 20,
  },
});
