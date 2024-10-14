import { gql } from '@apollo/client';
import { Image } from 'expo-image';
import { useMemo } from 'react';
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  Keyframe,
  ReduceMotion,
} from 'react-native-reanimated';

import { colors } from '@constants/styles';
import { AvatarViewFragment } from '@gen/graphql';
import { isNonEmptyString } from '@utils/equality';
import { IconAssets } from '@utils/icons';
import { createStylesWithVariants } from '@utils/style';

interface Props {
  profile: AvatarViewFragment | undefined | null;
  isOnline?: boolean;
  onPress?: () => void;
  size?: 'default' | 'xSmall' | 'small' | 'large' | 'xLarge';
  style?: StyleProp<ViewStyle>;
  isOwnProfile?: boolean;
}

const popIn = new Keyframe({
  0: { opacity: 0, transform: [{ scale: 0 }] },
  100: { opacity: 1, transform: [{ scale: 1 }] },
})
  .duration(150)
  .reduceMotion(ReduceMotion.System);

const popOut = new Keyframe({
  0: { opacity: 1, transform: [{ scale: 1 }] },
  100: { opacity: 0, transform: [{ scale: 0 }] },
})
  .duration(150)
  .reduceMotion(ReduceMotion.System);

export function Avatar({
  profile,
  isOnline = false,
  onPress,
  size = 'default',
  style,
  isOwnProfile,
  ...rest
}: Props & TouchableOpacityProps) {
  const { avatar2D } = profile?.avatars ?? {};
  const avatarUrl = isNonEmptyString(avatar2D) ? avatar2D : undefined;

  const s = useMemo(() => {
    return getStyleSheet(size);
  }, [size]);

  const hideOnlineStatus = !!profile?.settings?.privacy?.hideOnlineStatus;

  const content = (
    <>
      {avatar2D ? (
        <View style={s.avatarContainer}>
          <Animated.View
            entering={FadeIn}
            exiting={FadeOut}
          >
            <Image
              alt={`${profile?.userTag}'s avatar` ?? 'Some avatar'}
              source={{ uri: avatarUrl }}
              style={[
                s.avatar,
                !isOwnProfile && !hideOnlineStatus && !isOnline && s.avatarOffline,
              ]}
            />
          </Animated.View>
        </View>
      ) : (
        <IconAssets.AvatarPlaceholder
          color={colors.whiteTransparent40}
          height={16}
          width={16}
        />
      )}
      {!hideOnlineStatus && isOnline && (
        <Animated.View
          entering={popIn}
          exiting={popOut}
          style={s.liveStatus}
        />
      )}
    </>
  );

  return onPress ? (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[s.container, style]}
      onPress={onPress}
      {...rest}
    >
      {content}
    </TouchableOpacity>
  ) : (
    <View style={[s.container, style]}>{content}</View>
  );
}

Avatar.fragments = {
  profile: gql`
    fragment AvatarView on ProfileProfile {
      userId
      settings {
        privacy {
          hideOnlineStatus
        }
      }
      userTag
      avatars {
        avatar2D
        avatarFullbody
      }
    }
  `,
};

const getStyleSheet = createStylesWithVariants(
  {
    container: {
      width: 40,
      height: 40,
      position: 'relative',
      borderRadius: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatarContainer: { width: '100%', height: '100%' },
    avatar: {
      backgroundColor: colors.gray850,
      width: '100%',
      height: '100%',
      borderRadius: 999,
    },
    liveStatus: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: 9,
      height: 9,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.gray950,
      backgroundColor: colors.greenMain,
    },
    avatarOffline: {
      opacity: 0.6,
    },
    gradient: {
      ...StyleSheet.absoluteFillObject,
      borderRadius: 40,
    },
  },
  {
    xLarge: {
      container: {
        width: 64,
        height: 64,
        borderRadius: 64,
      },
      liveStatus: {
        width: 16,
        height: 16,
        borderRadius: 16,
        borderWidth: 3,
        borderColor: colors.gray950,
      },
    },
    large: {
      container: {
        width: 52,
        height: 52,
        borderRadius: 52,
      },
      liveStatus: {
        width: 12,
        height: 12,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: colors.gray950,
      },
    },
    small: {
      container: {
        width: 32,
        height: 32,
        borderRadius: 32,
      },
    },
    xSmall: {
      container: {
        width: 24,
        height: 24,
        borderRadius: 24,
      },
    },
  },
);
