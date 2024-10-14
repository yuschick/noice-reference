import { color, border, spacing } from '@noice-com/design-tokens';
import { Nullable } from '@noice-com/utils';
import { useState } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, FadeOut } from 'react-native-reanimated';

import { CountdownText } from '@components/CountdownText';
import { Gutter } from '@components/Gutter';
import { VStack } from '@components/Stack/VStack';
import { Typography } from '@components/Typography';

interface Props {
  muteStartTime: Nullable<Date>;
  onMuteEnded: () => void;
}

export const StreamChatMutedPrompt = ({ muteStartTime, onMuteEnded }: Props) => {
  const [promptHeight, setPromptHeight] = useState(0);

  const handleLayout = (event: LayoutChangeEvent) => {
    setPromptHeight(event.nativeEvent.layout.height);
  };

  if (!muteStartTime) {
    return null;
  }

  return (
    <>
      <Animated.View
        entering={FadeInDown}
        exiting={FadeOut}
        style={s.container}
        onLayout={handleLayout}
      >
        <VStack
          alignItems="flex-start"
          spacing={spacing.base * 4}
        >
          <View>
            <Typography fontWeight="regular">
              You&apos;ve been muted by a moderator
            </Typography>
            <Gutter height={2} />
            <Typography
              color="textSecondary"
              fontSize="sm"
            >
              You can chat again in{' '}
              <CountdownText
                color="textSecondary"
                countdownToMs={muteStartTime.getTime()}
                fontSize="sm"
                onComplete={onMuteEnded}
              />
              .
            </Typography>
          </View>
          {/*
          @todo: Once we have the muted message as well, it should go here.
          Style are already set, just add it in a new view.
          @see: https://figma.com/design/9DUGq3Ev6cCM7Zg7ObBRpx/Noice-Design-System---Mobile?node-id=106-7188
        */}
        </VStack>
      </Animated.View>
      <View style={[s.spacer, { height: promptHeight }]} />
    </>
  );
};

const s = StyleSheet.create({
  container: {
    borderRadius: border.radiusXs,
    backgroundColor: color.gray850,
    padding: spacing.base * 2,
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  spacer: {
    width: '100%',
  },
});
