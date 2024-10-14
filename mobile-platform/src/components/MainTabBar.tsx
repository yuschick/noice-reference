import { BlurView } from '@react-native-community/blur';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { CommonActions } from '@react-navigation/native';
import { Image } from 'expo-image';
import { StyleSheet, View, useWindowDimensions, Insets } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Animated, {
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgProps } from 'react-native-svg';

import { HStack } from './Stack/HStack';

import { colors } from '@constants/styles';
import { TabNavigatorTabParams } from '@navigators/routes';
import { Haptic } from '@utils/haptic';
import { IconAssets } from '@utils/icons';
import { ImageAssets } from '@utils/image';

const MIN_INSET_BOTTOM_PADDING = 24;
const buttonHitSlop: Insets = { left: 32, right: 32, top: 24, bottom: 24 };

const IconMap = new Map<keyof TabNavigatorTabParams, React.FC<SvgProps>>([
  ['homeTab', IconAssets.Play],
  ['collectionTab', IconAssets.Collection],
  ['storeTab', IconAssets.Store],
  ['seasonsTab', IconAssets.Seasons],
  ['friendsTab', IconAssets.Friends],
]);

export const MainTabBar = ({ navigation, state, descriptors }: BottomTabBarProps) => {
  const insets = useSafeAreaInsets();
  const { height, width } = useWindowDimensions();

  const routes = state.routes.map((route, index) => {
    return (
      <TabMenuItem
        descriptors={descriptors}
        index={index}
        key={route.key}
        navigation={navigation}
        route={route}
        state={state}
      />
    );
  });

  return (
    <>
      <View
        style={[
          s.container,
          {
            paddingBottom: Math.max(insets.bottom, MIN_INSET_BOTTOM_PADDING),
          },
        ]}
      >
        <BlurView
          blurAmount={10}
          style={s.bgContainer}
        >
          <Image
            source={ImageAssets.background}
            style={[s.image, { height, width }]}
          />
        </BlurView>

        <HStack justifyContent="space-between">{routes}</HStack>
      </View>
    </>
  );
};

const TabMenuItem = ({
  state,
  index,
  route,
  navigation,
  descriptors,
}: Pick<BottomTabBarProps, 'state' | 'navigation' | 'descriptors'> & {
  index: number;
  route: BottomTabBarProps['state']['routes'][0];
}) => {
  const Icon = IconMap.get(route.name as keyof TabNavigatorTabParams);
  const isSelected = index === state.index;
  const scale = useSharedValue(1);

  const { tabBarBadge, tabBarAccessibilityLabel } = descriptors[route.key].options;

  scale.value = withSpring(isSelected ? 1.15 : 1, {
    mass: 1,
    damping: 4,
    stiffness: 400,
    reduceMotion: ReduceMotion.System,
  });

  const scaleAnimation = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const onLongPress = () => {
    navigation.emit({
      type: 'tabLongPress',
      target: route.key,
    });
  };

  const navigateToTab = () => {
    Haptic.impactLight();

    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });

    if (state.index !== index && !event.defaultPrevented) {
      navigation.dispatch({
        ...CommonActions.navigate({ name: route.name, merge: true }),
        target: state.key,
      });
    }
  };

  if (!Icon) {
    return <></>;
  }

  return (
    <TouchableOpacity
      accessibilityLabel={tabBarAccessibilityLabel}
      hitSlop={buttonHitSlop}
      key={route.key}
      onLongPress={onLongPress}
      onPress={navigateToTab}
    >
      <Animated.View style={scaleAnimation}>
        <Icon
          color={isSelected ? colors.greenMain : colors.textSecondary}
          height={30}
          width={30}
        />
      </Animated.View>

      {
        // Only show the dot if the tab has a badge and is not active
        !!tabBarBadge && !isSelected && <View style={s.dot} />
      }
    </TouchableOpacity>
  );
};

const s = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 32,
    paddingTop: 12,
    borderTopColor: colors.whiteTransparent30,
    borderTopWidth: 0.33,
  },
  bgContainer: {
    overflow: 'hidden',
    ...StyleSheet.absoluteFillObject,
  },
  image: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    right: 0,
    opacity: 0.8,
  },
  dot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: colors.magentaMain,
    position: 'absolute',
    right: -4,
    top: -4,
  },
});
