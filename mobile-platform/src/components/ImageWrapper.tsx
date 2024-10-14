import { Image, ImageProps } from 'expo-image';
import { useState } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Animated, { useSharedValue, withDelay, withTiming } from 'react-native-reanimated';

import { LoadingView } from './LoadingView';
import { Typography } from './Typography';

import { colors } from '@constants/styles';

interface Props extends ImageProps {
  disableAnimation?: boolean;
  animationDuration?: number;
  animationDelay?: number;
  hideErrorLabel?: boolean;
  defaultBackgroundColor?: keyof typeof colors;
  imageContainerStyle?: StyleProp<ViewStyle>;
}

const DEFAULT_DURATION = 300;
const DEFAULT_DELAY = 0;

/**
 * Adds extra image functionality like smooth animations when image is
 * loaded, and a default background image.
 */
export const ImageWrapper = ({
  disableAnimation,
  animationDelay = DEFAULT_DELAY,
  animationDuration = DEFAULT_DURATION,
  defaultBackgroundColor = 'whiteTransparent05',
  hideErrorLabel,
  imageContainerStyle,
  ...imageProps
}: Props) => {
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const animation = useSharedValue(disableAnimation ? 1 : 0);

  const onImageLoaded = () => {
    animation.value = withDelay(
      animationDelay,
      withTiming(1, {
        duration: animationDuration,
      }),
    );

    setIsLoading(false);
    imageProps?.onLoadEnd?.();
  };

  const onImageLoadError = () => {
    setError(true);
  };

  return (
    <View>
      {isLoading && (
        <LoadingView
          disableAnimation={false}
          style={[
            imageProps.style,
            s.loading,
            {
              backgroundColor: colors[defaultBackgroundColor],
            },
          ]}
        />
      )}
      {error && !hideErrorLabel && (
        <View style={s.errorLabel}>
          <Typography color="textSecondary">Could not load image.</Typography>
        </View>
      )}
      <Animated.View style={[{ opacity: animation }, imageContainerStyle]}>
        <Image
          {...imageProps}
          style={[
            imageProps.style,
            {
              backgroundColor: colors[defaultBackgroundColor],
            },
          ]}
          onError={onImageLoadError}
          onLoadEnd={onImageLoaded}
        />
      </Animated.View>
    </View>
  );
};

const s = StyleSheet.create({
  loading: {
    ...StyleSheet.absoluteFillObject,
  },
  errorLabel: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
