import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  Easing,
  SlideInDown,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withDelay,
  SlideOutRight,
} from 'react-native-reanimated';

import { useToasts } from './hooks/useToasts.hook';

import { VStack } from '@components/Stack/VStack';
import { Typography } from '@components/Typography';
import { colors } from '@constants/styles';

type ToastProps = {
  title: string;
  icon?: React.ReactNode;
  subTitle?: string;
  index: number;
};

export const Toast = ({ title, subTitle, icon, index }: ToastProps) => {
  const { toasts } = useToasts();
  const bottomOffset = useSharedValue(0);
  const padding = useSharedValue(0);
  const opacity = useSharedValue(1);
  const animateOut = useSharedValue(0);

  const offsetI = toasts.length - index;

  useEffect(() => {
    bottomOffset.value = withTiming(4 * offsetI, {
      duration: 200,
    });
    padding.value = withDelay(
      200,
      withTiming(12 * (offsetI - 1), {
        duration: 400,
      }),
    );

    const opacityEndValue = 1 - 0.25 * (offsetI - 1);
    opacity.value = withDelay(
      opacityEndValue === 1 ? 0 : 200,
      withTiming(opacityEndValue, {
        duration: opacityEndValue === 1 ? 200 : 400,
      }),
    );
  }, [bottomOffset, offsetI, opacity, padding]);

  const animatedStyle = useAnimatedStyle(() => ({
    bottom: bottomOffset.value,
    position: 'absolute',
    width: '100%',
    paddingHorizontal: padding.value,
    opacity: opacity.value,
    right: animateOut.value,
  }));

  return (
    <Animated.View
      entering={SlideInDown.duration(400).easing(Easing.out(Easing.sin))}
      exiting={SlideOutRight.duration(200)}
      style={animatedStyle}
    >
      <Animated.View style={s.container}>
        {icon}
        <VStack margin={8}>
          <Typography
            color="black"
            fontSize="md"
            fontWeight="medium"
            lineHeight="md"
            numberOfLines={1}
          >
            {title}
          </Typography>
          {!!subTitle && (
            <Typography
              color="blackMainTransparent60"
              fontSize="sm"
              numberOfLines={1}
            >
              {subTitle}
            </Typography>
          )}
        </VStack>
      </Animated.View>
    </Animated.View>
  );
};

const s = StyleSheet.create({
  container: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: colors.whiteMain,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
