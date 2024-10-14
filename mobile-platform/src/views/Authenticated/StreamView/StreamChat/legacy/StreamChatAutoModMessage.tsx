import { StyleSheet, View } from 'react-native';

import { Typography } from '@components/Typography';
import { colors } from '@constants/styles';
import {
  ModerationMessageModel,
  ModerationMessageStatus,
} from '@hooks/chat/types/moderation';

const statusTest: Record<ModerationMessageStatus, string> = {
  [ModerationMessageStatus.AutomodAccepted]: 'Mods have allowed your message.',
  [ModerationMessageStatus.AutomodPending]:
    'Your message is being checked by mods and has not been sent to chat.',
  [ModerationMessageStatus.AutomodBlocked]:
    'Noice has blocked your message because it may violate the Noice Community Guidelines.',
  [ModerationMessageStatus.AutomodDenied]: 'Mods have denied your message.',
};

const sender: Record<ModerationMessageStatus, 'Automod' | undefined> = {
  [ModerationMessageStatus.AutomodAccepted]: 'Automod',
  [ModerationMessageStatus.AutomodPending]: 'Automod',
  [ModerationMessageStatus.AutomodBlocked]: undefined,
  [ModerationMessageStatus.AutomodDenied]: 'Automod',
};

export const StreamChatAutoModMessage = ({ content }: ModerationMessageModel) => {
  return (
    <View style={s.container}>
      <Typography
        color="magentaMain"
        fontWeight="semiBold"
        lineHeight="lg"
      >
        {sender[content.status] ? `${sender[content.status]}: ` : ''}
        <Typography color="textSecondary">{statusTest[content.status]}</Typography>
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
