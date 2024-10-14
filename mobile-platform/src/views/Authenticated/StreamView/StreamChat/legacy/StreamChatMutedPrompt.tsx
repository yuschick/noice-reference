import { Nullable } from '@noice-com/utils';
import { StyleSheet } from 'react-native';
import Animated, { FadeInDown, FadeOut } from 'react-native-reanimated';

import { CountdownText } from '@components/CountdownText';
import { Gutter } from '@components/Gutter';
import { Typography } from '@components/Typography';
import { borderRadius, colors } from '@constants/styles';
import { MuteState } from '@hooks/chat/types/moderation';

interface Props {
  muteState: Nullable<MuteState>;
  onMuteEnded: () => void;
}

export const StreamChatMutedPrompt = ({ muteState, onMuteEnded }: Props) => {
  if (!muteState || !muteState.duration) {
    return null;
  }

  const countdownTo = Date.now() + muteState.duration * 1000;

  return (
    <Animated.View
      entering={FadeInDown}
      exiting={FadeOut}
      style={s.container}
    >
      <Typography fontWeight="regular">You&apos;ve been muted by a moderator</Typography>
      <Gutter height={2} />
      <Typography
        color="textSecondary"
        fontSize="sm"
      >
        You can chat again in{' '}
        <CountdownText
          color="textSecondary"
          countdownToMs={countdownTo}
          fontSize="sm"
          onComplete={onMuteEnded}
        />
        .
      </Typography>
    </Animated.View>
  );
};

const s = StyleSheet.create({
  container: {
    borderRadius: borderRadius.radiusMd,
    padding: 16,
    marginHorizontal: 8,
    backgroundColor: colors.gray850,
    position: 'absolute',
    bottom: 0,
  },
});
