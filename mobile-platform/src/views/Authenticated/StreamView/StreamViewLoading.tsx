import { StyleSheet } from 'react-native';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { colors } from '@constants/styles';
import { useMountEffect } from '@hooks/useMountEffect.hook';
import { IconAssets } from '@utils/icons';

export const StreamViewLoading = () => {
  const scale = useSharedValue(1);

  useMountEffect(() => {
    scale.value = withRepeat(withTiming(1.1, { duration: 500 }), -1, true);
  });

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={s.container}>
      <Animated.View
        entering={FadeInDown.duration(600).delay(600)}
        style={style}
      >
        <IconAssets.NoiceLogo
          height={64}
          width={64}
        />
      </Animated.View>
    </Animated.View>
  );
};

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.blue900,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
