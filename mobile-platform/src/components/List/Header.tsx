import { BlurView } from '@react-native-community/blur';
import { StyleSheet, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import Animated, {
  Extrapolation,
  SharedValue,
  interpolate,
  interpolateColor,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Gutter } from '@components/Gutter';
import { VStack } from '@components/Stack/VStack';
import { Typography } from '@components/Typography';
import { colors } from '@constants/styles';
import { IconAssets } from '@utils/icons';
import { ImageAssets } from '@utils/image';

type Props = {
  withHeader?: boolean;
  headerLeft?: React.ReactNode;
  headerRight?: React.ReactNode;
  title?: string;
  onHeaderLeftPress?: () => void;
  scrollY: SharedValue<number>;
  headerBottomRowElement?: React.ReactNode;
  subtitle?: React.ReactNode;
  goBack?: () => void;
  uppercaseTitle?: boolean;
};

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

// does not include safe area inset for top
// is aproximately the height of the chevron and title area
// 24 is the 12 point padding on the top and bottom of the title
export const HEADER_TOP_ROW_HEIGHT = 40 + 24;
// this is an estimate
export const HEADER_BOTTOM_ROW_HEIGHT = 40;

export const HeaderGutter = () => {
  const { top } = useSafeAreaInsets();

  return <Gutter height={HEADER_BOTTOM_ROW_HEIGHT + HEADER_TOP_ROW_HEIGHT + top} />;
};

export const useHeaderValues = () => {
  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  return { scrollY, scrollHandler };
};

export const Header = ({
  scrollY,
  title,
  headerLeft,
  headerRight,
  onHeaderLeftPress,
  headerBottomRowElement,
  subtitle,
  goBack,
  uppercaseTitle = true,
}: Props) => {
  const { width, height } = useWindowDimensions();
  const { top } = useSafeAreaInsets();

  const headerStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [0, 60], [0, 1], {
      extrapolateRight: Extrapolation.CLAMP,
    });

    return {
      opacity,
    };
  });

  const imageStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [40, 60], [1, 0.5], {
      extrapolateRight: Extrapolation.CLAMP,
    });

    return {
      opacity,
    };
  });

  const borderStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      scrollY.value,
      [0, 50],
      ['rgba(255, 255, 255, 0)', colors.whiteTransparent30],
    );

    return { borderBottomColor: color };
  });

  const titleStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [40, 60], [0, 1], {
      extrapolateRight: Extrapolation.CLAMP,
    });

    const y = interpolate(scrollY.value, [40, 60], [-10, 0], {
      extrapolateRight: Extrapolation.CLAMP,
    });

    return {
      opacity,
      transform: [{ translateY: -y }],
    };
  });

  const largeTitleStyle = useAnimatedStyle(() => {
    const scale = interpolate(scrollY.value, [10, -60], [1, 1.2], {
      extrapolateRight: Extrapolation.CLAMP,
      extrapolateLeft: Extrapolation.CLAMP,
    });

    return {
      transform: [{ scale }],
    };
  });

  const bottomRowStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [40, 80], [1, 0], {
      extrapolateRight: Extrapolation.CLAMP,
    });

    const y = interpolate(scrollY.value, [0, 60], [0, -40], {
      extrapolateLeft: Extrapolation.CLAMP,
    });

    return {
      opacity,
      transform: [{ translateY: y }],
    };
  });

  return (
    <>
      <Animated.View
        style={[
          s.titleRow,
          bottomRowStyle,
          {
            top: top + HEADER_TOP_ROW_HEIGHT,
          },
        ]}
      >
        <Animated.View style={[s.titleContainer, largeTitleStyle]}>
          {headerBottomRowElement ? headerBottomRowElement : null}
          <VStack>
            <Typography
              fontSize="xl"
              fontWeight="bold"
              uppercase={uppercaseTitle}
              italic
            >
              {title}
            </Typography>
            {!!subtitle && subtitle}
          </VStack>
        </Animated.View>
      </Animated.View>

      <Animated.View style={s.header}>
        <AnimatedBlurView
          blurAmount={10}
          style={[StyleSheet.absoluteFillObject, headerStyle]}
        />

        <Animated.View
          style={[
            {
              // 12 is the padding on the top of the title
              paddingTop: top + 12,
            },
            s.container,
            borderStyle,
          ]}
        >
          <Animated.Image
            resizeMode="cover"
            source={ImageAssets.background}
            style={[s.gradientImage, imageStyle, { width, height }]}
          />
          <View style={s.flex}>
            {headerLeft ? (
              headerLeft
            ) : (
              <TouchableOpacity
                accessibilityHint="Navigates to the previous screen"
                accessibilityLabel="Go back"
                hitSlop={16}
                onPress={onHeaderLeftPress ?? goBack}
              >
                <IconAssets.ChevronLeft
                  color={colors.white}
                  height={20}
                  width={20}
                />
              </TouchableOpacity>
            )}
          </View>
          <Animated.View style={titleStyle}>
            <Typography
              ellipsizeMode="clip"
              fontSize="md"
              fontWeight="medium"
              numberOfLines={1}
              textAlign="center"
              uppercase={uppercaseTitle}
            >
              {title}
            </Typography>
          </Animated.View>
          {headerRight ? headerRight : <View style={s.flex} />}
        </Animated.View>
      </Animated.View>
    </>
  );
};

const s = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
  },
  container: {
    paddingBottom: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  gradientImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  titleContainer: {
    position: 'absolute',
    left: 16,
    transformOrigin: 'left',
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 8,
  },
  titleRow: {
    position: 'absolute',
    top: HEADER_TOP_ROW_HEIGHT,
    transformOrigin: 'left',
  },
  flex: {
    flex: 1,
  },
});
