import { useEffect, useMemo } from 'react';
import { ActivityIndicatorProps, StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  withRepeat,
} from 'react-native-reanimated';

import { colors } from '@constants/styles';
import { IconAssets } from '@utils/icons';

export const loadingSpinnerSizes = ['sm', 'md', 'lg'] as const;

type Props = Omit<ActivityIndicatorProps, 'size'> & {
  size?: (typeof loadingSpinnerSizes)[number] | 'xs';
};

const LoadingSpinner = ({ size, style }: Props) => {
  const rotation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  const { height, width, borderWidth } = useMemo(() => {
    switch (size) {
      // used only in the toggle button
      case 'xs':
        return {
          height: 16,
          width: 16,
          borderWidth: 2,
        };
      default:
      case 'sm':
        return {
          height: 24,
          width: 24,
          borderWidth: 3,
        };
      case 'md':
        return {
          height: 48,
          width: 48,
          borderWidth: 7,
        };
      case 'lg':
        return {
          height: 64,
          width: 64,
          borderWidth: 9,
        };
    }
  }, [size]);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 1000,
        easing: Easing.linear,
      }),
      -1,
    );
  }, [rotation]);

  return (
    <View
      style={[
        styles.container,
        {
          height,
          width,
        },
        style,
      ]}
    >
      <View
        style={[
          styles.bg,
          {
            height,
            width,
            borderWidth,
          },
        ]}
      />

      <Animated.View style={animatedStyle}>
        <IconAssets.LoadingSpin
          color={colors.tealMain}
          height={height}
          width={width}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  bg: {
    position: 'absolute',
    borderColor: colors.teal800,
    borderRadius: 100,
  },
});

export default LoadingSpinner;
