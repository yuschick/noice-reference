import { BlurView } from '@react-native-community/blur';
import {
  ImageSourcePropType,
  StyleSheet,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  Extrapolation,
  SharedValue,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Gutter } from '@components/Gutter';
import { Typography } from '@components/Typography';
import { colors } from '@constants/styles';
import { IconAssets } from '@utils/icons';

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
  coverPhoto?: ImageSourcePropType;
  bottomRowHeight?: number;
};

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

const HEADER_TOP_ROW_HEIGHT = 56;
const HEADER_BOTTOM_ROW_HEIGHT = -24;
const MIN_HEADER_HEIGHT = 80;

const HEADER_BREAKPOINT = 60;
const TITLE_BREAKPOINT = 40;
const NEGATIVE_BREAKPOINT = -HEADER_BREAKPOINT;

export const HeaderWithImageGutter = () => {
  return <Gutter height={HEADER_TOP_ROW_HEIGHT} />;
};

export const useHeaderValues = () => {
  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  return { scrollY, scrollHandler };
};

export const HeaderWithImage = ({
  scrollY,
  title,
  headerLeft,
  headerRight,
  onHeaderLeftPress,
  headerBottomRowElement,
  goBack,
  uppercaseTitle = true,
  coverPhoto,
  bottomRowHeight = HEADER_BOTTOM_ROW_HEIGHT,
}: Props) => {
  const { width, height } = useWindowDimensions();
  const { top } = useSafeAreaInsets();
  const headerHeight = height * 0.2;

  const headerStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [0, HEADER_BREAKPOINT], [0, 1], {
      extrapolateRight: Extrapolation.CLAMP,
    });

    return {
      opacity,
    };
  });

  const coverStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollY.value,
      [NEGATIVE_BREAKPOINT, 0, HEADER_BREAKPOINT],
      [1.2, 1, 1],
      {
        extrapolateRight: Extrapolation.CLAMP,
      },
    );

    return {
      transform: [{ scale }],
    };
  });

  const titleStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [TITLE_BREAKPOINT, HEADER_BREAKPOINT],
      [0, 1],
      {
        extrapolateRight: Extrapolation.CLAMP,
      },
    );

    const y = interpolate(
      scrollY.value,
      [TITLE_BREAKPOINT, HEADER_BREAKPOINT],
      [-10, 0],
      {
        extrapolateRight: Extrapolation.CLAMP,
      },
    );

    return {
      opacity,
      transform: [{ translateY: -y }],
    };
  });

  const largeTitleStyle = useAnimatedStyle(() => {
    const scale = interpolate(scrollY.value, [0, NEGATIVE_BREAKPOINT], [1, 1.2], {
      extrapolateRight: Extrapolation.CLAMP,
      extrapolateLeft: Extrapolation.CLAMP,
    });

    return {
      transform: [{ scale }],
    };
  });

  const bottomRowStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [TITLE_BREAKPOINT, HEADER_BREAKPOINT],
      [1, 0],
      {
        extrapolateRight: Extrapolation.CLAMP,
      },
    );

    const y = interpolate(scrollY.value, [0, HEADER_BREAKPOINT], [0, -40], {
      extrapolateLeft: Extrapolation.CLAMP,
    });

    return {
      opacity,
      transform: [{ translateY: y }],
    };
  });

  const animatedHeaderHeight = useAnimatedStyle(() => {
    return {
      height: interpolate(
        scrollY.value,
        [0, HEADER_BREAKPOINT],
        [headerHeight, MIN_HEADER_HEIGHT + top],
        {
          extrapolateRight: Extrapolation.CLAMP,
        },
      ),
    };
  });

  return (
    <>
      <View style={[s.imageContainer, { height: headerHeight }]}>
        <Animated.Image
          resizeMode="cover"
          source={coverPhoto}
          style={[s.coverImage, coverStyle, { width }, animatedHeaderHeight]}
        />
      </View>
      <Animated.View
        style={[
          s.titleRow,
          bottomRowStyle,
          {
            top: headerHeight + bottomRowHeight,
          },
        ]}
      >
        <Animated.View style={[s.titleContainer, largeTitleStyle]}>
          {headerBottomRowElement ? headerBottomRowElement : null}
        </Animated.View>
      </Animated.View>

      <Animated.View style={[s.header, animatedHeaderHeight]}>
        <AnimatedBlurView
          blurAmount={10}
          style={[StyleSheet.absoluteFillObject, headerStyle]}
        />

        <Animated.View
          style={[
            {
              paddingTop: top + 12,
            },
            s.container,
          ]}
        >
          <View>
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

          <View>{headerRight}</View>
        </Animated.View>
      </Animated.View>
    </>
  );
};

const s = StyleSheet.create({
  imageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
  },
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  coverImage: {
    ...StyleSheet.absoluteFillObject,

    maxHeight: 200,
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
});
