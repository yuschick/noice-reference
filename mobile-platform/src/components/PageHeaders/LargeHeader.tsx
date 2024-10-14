import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import { Nullable } from '@noice-com/utils';
import { BlurView } from '@react-native-community/blur';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, {
  Extrapolation,
  SharedValue,
  interpolate,
  interpolateColor,
  runOnJS,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { create } from 'zustand';

import { Avatar } from '../Avatar';
import { ButtonIcon } from '../ButtonIcon';
import { Gutter } from '../Gutter';
import { HStack } from '../Stack/HStack';
import { Typography } from '../Typography';

import { HeaderCurrencies } from './HeaderCurrencies';

import { colors } from '@constants/styles';
import { useHeaderAvatarPreviewQuery } from '@gen/graphql';
import { useRefetchOnAppStateChange } from '@hooks/useRefetchOnAppStateChange.hook';
import {
  AuthenticatedNavigationHookProps,
  TabNavigatorTabParams,
} from '@navigators/routes';
import { IconAssets } from '@utils/icons';
import { ImageAssets } from '@utils/image';

type HeaderProps = {
  scrollY: SharedValue<number>;
  title?: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
  userId: Nullable<string>;
  showCurrencies?: boolean;
  extraContent?: React.ReactNode;
};

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

gql`
  query HeaderAvatarPreview($userId: ID!) {
    profile(userId: $userId) {
      ...AvatarView
      onlineStatus
    }
  }
  ${Avatar.fragments.profile}
`;

const HEADER_PADDING = 16;

type LargeHeaderHeightStore = {
  height: number;
  setHeight: (height: number) => void;
};

export const useLargeHeaderHeightStore = create<LargeHeaderHeightStore>((set) => ({
  height: 188, // Estimated value
  setHeight: (height) => set({ height: height }),
}));

/**
 *  Use this to get the offset for the large header to use with RefreshControl
 * @returns offset: number
 */
export const useLargeHeaderOffset = () => {
  const height = useLargeHeaderHeightStore((state) => state.height);
  const { top } = useSafeAreaInsets();

  // this offset takes into consideration both the currencies as well as the top padding
  return top + height;
};

/**
 * Use this to hook your scroll handler to the header
 * @returns scrollY: SharedValue<number>, scrollHandler: (event: NativeSyntheticEvent<NativeScrollEvent>) => void
 */
export const useLargeHeaderAnimation = () => {
  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  return { scrollY, scrollHandler };
};

/**
 * User this at the top of the ScrollView to push elements down so they don't go under the header
 * @returns Gutter for the large header
 */
export const LargeHeaderGutter = () => {
  const height = useLargeHeaderHeightStore((state) => state.height);

  return <Gutter height={height + HEADER_PADDING} />;
};

export const LargeHeader = ({
  scrollY,
  userId,
  title,
  showCurrencies,
  extraContent,
}: HeaderProps) => {
  const [actionsDisabled, setActionsDisabled] = useState(false);
  const { width, height } = useWindowDimensions();
  const { top } = useSafeAreaInsets();
  const navigation = useNavigation<AuthenticatedNavigationHookProps>();
  const { name } = useRoute<RouteProp<TabNavigatorTabParams>>();
  const setLargeHeaderHeight = useLargeHeaderHeightStore((state) => state.setHeight);
  const { data: userAvatarData, refetch } = useHeaderAvatarPreviewQuery({
    ...variablesOrSkip({
      userId: userId,
    }),
  });

  useRefetchOnAppStateChange(refetch);

  const navigateToUser = () => {
    navigation.navigate('user');
  };

  const headerStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [0, 100], [0, 1], {
      extrapolateRight: Extrapolation.CLAMP,
    });

    return {
      opacity,
    };
  });

  const imageStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [0, 100], [0, 0.5], {
      extrapolateRight: Extrapolation.CLAMP,
    });

    return {
      opacity,
    };
  });

  // styles for scaling the row slightly on scroll down and hiding on scroll up
  const secondRowStyle = useAnimatedStyle(() => {
    const translateY = interpolate(scrollY.value, [0, 100], [0, -20], {
      extrapolateRight: Extrapolation.CLAMP,
    });

    const opacity = interpolate(scrollY.value, [0, 20], [1, 0], {
      extrapolateRight: Extrapolation.CLAMP,
    });

    runOnJS(setActionsDisabled)(scrollY.value > 0);

    return {
      opacity,
      transform: [{ translateY }],
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

  // In case when we are showing the header for the current user, we want to hide the online status
  // if they've set their privacy settings to hide it so that the UI matches what the user would expect to see
  const isOnline = !userAvatarData?.profile?.settings?.privacy.hideOnlineStatus;

  return (
    <View
      style={s.container}
      onLayout={(e) => setLargeHeaderHeight(e.nativeEvent.layout.height)}
    >
      <Animated.View
        style={[
          s.header,
          {
            paddingTop: top,
          },
          borderStyle,
        ]}
      >
        <AnimatedBlurView
          blurAmount={10}
          style={[StyleSheet.absoluteFillObject, headerStyle]}
        />

        <Animated.Image
          resizeMode="cover"
          source={ImageAssets.background}
          style={[s.gradientImage, imageStyle, { width, height }]}
        />
        <HStack
          alignItems="center"
          justifyContent="space-between"
          padding={[16, 16, 0]}
        >
          <Typography
            fontSize="xl"
            fontWeight="bold"
            italic
            uppercase
          >
            {title}
          </Typography>
          <HStack alignItems="center">
            {__DEV__ && (
              <>
                <ButtonIcon backgroundColor="transparent">
                  <IconAssets.Search
                    color="white"
                    height={24}
                    width={24}
                  />
                </ButtonIcon>

                <ButtonIcon backgroundColor="transparent">
                  <IconAssets.Bell
                    color="white"
                    height={24}
                    width={24}
                  />
                </ButtonIcon>
              </>
            )}

            <Avatar
              accessibilityHint="Navigate to your own profile view"
              accessibilityLabel="Navigate to profile"
              hitSlop={16}
              isOnline={isOnline}
              profile={userAvatarData?.profile}
              size="small"
              style={s.avatar}
              onPress={navigateToUser}
            />
          </HStack>
        </HStack>
      </Animated.View>

      <Animated.View style={secondRowStyle}>
        {showCurrencies && (
          <HeaderCurrencies
            actionsDisabled={actionsDisabled}
            name={name}
            userId={userId}
          />
        )}
        {!!extraContent && (
          <>
            <Gutter height={8} />
            {extraContent}
          </>
        )}
      </Animated.View>
    </View>
  );
};

const s = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  header: {
    borderBottomWidth: 1,
    overflow: 'hidden',
  },
  avatar: {
    margin: 8,
  },
  gradientImage: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});
