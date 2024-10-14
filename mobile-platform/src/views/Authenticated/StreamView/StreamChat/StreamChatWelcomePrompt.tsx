import { StyleSheet, View } from 'react-native';

import { Typography } from '@components/Typography';
import { colors } from '@constants/styles';

interface Props {
  channelName: string;
}

export const StreamChatWelcomePrompt = ({ channelName }: Props) => {
  return (
    <View style={s.welcomePrompt}>
      <Typography
        color="textSecondary"
        fontWeight="medium"
        lineHeight="lg"
      >
        Welcome to{' '}
        <Typography
          color="textLight"
          fontWeight="bold"
        >
          {channelName}&apos;s
        </Typography>{' '}
        stream chat. Respect each other and have fun!
      </Typography>
    </View>
  );
};

const s = StyleSheet.create({
  welcomePrompt: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray850,
  },
});
