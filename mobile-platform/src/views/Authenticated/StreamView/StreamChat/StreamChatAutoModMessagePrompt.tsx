import { ChatMessageTextContentModel } from '@noice-com/chat-react-core';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, FadeOut } from 'react-native-reanimated';

import { useChatEmojisAndMentions } from './hooks/useChatEmojisAndMentions.hook';
import {
  renderEmoji,
  renderLink,
  renderMention,
  renderText,
} from './StreamChatChunkRenderers';

import { ButtonLarge } from '@components/ButtonLarge';
import { Gutter } from '@components/Gutter';
import { HStack } from '@components/Stack/HStack';
import { Typography } from '@components/Typography';
import { colors } from '@constants/styles';

interface Props {
  message: ChatMessageTextContentModel;
  onSend?: () => void;
  onCancel?: () => void;
}

export const StreamChatAutoModMessagePrompt = ({ message, onSend, onCancel }: Props) => {
  const { messageNodes } = useChatEmojisAndMentions({
    message: message.text,
    attachments: message.attachments,
    links: message.links,
    messageId: 'automod-confirmation-message',
    ownPlayerName: 'none',
    renderEmoji,
    renderLink,
    renderMention,
    renderText,
  });

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
          {messageNodes?.length > 0 ? <>{messageNodes}</> : 'Could not load message'}
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
});
