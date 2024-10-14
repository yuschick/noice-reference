import {
  ModerationMessageModel,
  ModerationMessageStatus,
} from '@noice-com/chat-react-core';
import { StyleSheet, View } from 'react-native';

import { Typography } from '@components/Typography';
import { colors } from '@constants/styles';

const statusTest: Record<ModerationMessageStatus, string> = {
  [ModerationMessageStatus.AutomodAccepted]: 'Mods have allowed your message.',
  [ModerationMessageStatus.AutomodPending]:
    'Your message is being checked by mods and has not been sent to chat.',
  [ModerationMessageStatus.Blocked]:
    'Noice has blocked your message because it may violate the Noice Community Guidelines.',
  [ModerationMessageStatus.AutomodDenied]: 'Mods have denied your message.',
  [ModerationMessageStatus.TemporaryMuted]: 'You are temporary muted.',
  [ModerationMessageStatus.Spam]:
    'Noice has blocked your message because it may be repetitive.',
};

const sender: Record<ModerationMessageStatus, 'Automod' | undefined> = {
  [ModerationMessageStatus.AutomodAccepted]: 'Automod',
  [ModerationMessageStatus.AutomodPending]: 'Automod',
  [ModerationMessageStatus.Blocked]: undefined,
  [ModerationMessageStatus.AutomodDenied]: 'Automod',
  [ModerationMessageStatus.TemporaryMuted]: undefined,
  [ModerationMessageStatus.Spam]: undefined,
};

interface Props {
  message: Pick<ModerationMessageModel, 'status'> & Partial<ModerationMessageModel>;
}

export const StreamChatAutoModMessage = ({ message }: Props) => {
  const { status } = message;

  return (
    <View style={s.container}>
      <Typography
        color="magentaMain"
        fontWeight="semiBold"
        lineHeight="lg"
      >
        {sender[status] ? `${sender[status]}: ` : ''}
        <Typography color="textSecondary">{statusTest[status]}</Typography>
      </Typography>
    </View>
  );
};

const s = StyleSheet.create({
  container: {
    paddingLeft: 12,
    borderLeftColor: colors.magentaMain,
    borderLeftWidth: 2,
    marginHorizontal: 6,
  },
});
