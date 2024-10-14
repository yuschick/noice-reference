import { StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { FadeOut, FadeIn, FadeInLeft } from 'react-native-reanimated';

import { Avatar } from '@components/Avatar';
import { ButtonIcon } from '@components/ButtonIcon';
import { Gutter } from '@components/Gutter';
import { LoadingView } from '@components/LoadingView';
import { HStack } from '@components/Stack/HStack';
import { VStack } from '@components/Stack/VStack';
import { Typography } from '@components/Typography';
import { colors } from '@constants/styles';
import { FriendsViewUserFragment, ProfilePresenceStatus } from '@gen/graphql';
import { IconAssets } from '@utils/icons';
import { getTimeSinceLabel } from '@utils/time';

export type FriendRequestType = 'sent' | 'received';

interface Props {
  userData: FriendsViewUserFragment;
  index?: number;
  animate?: boolean;
  size?: 'default' | 'large';
  type?: FriendRequestType;
  onAcceptFriendRequest?: (friendId: string) => void;
  onDeclineFriendRequest?: (friendId: string) => void;
  onCancelFriendRequest?: (friendId: string) => void;
  onViewFriend?: (data: FriendsViewUserFragment, type?: FriendRequestType) => void;
}

export const FriendsListItem = ({
  userData,
  onViewFriend,
  index = 0,
  animate = true,
  size = 'default',
  type,
  onAcceptFriendRequest,
  onDeclineFriendRequest,
  onCancelFriendRequest,
}: Props) => {
  const { activity, profile } = userData;
  const timeSinceLabel = profile?.lastSeen
    ? getTimeSinceLabel(profile?.lastSeen, Date.now())
    : null;

  const declinable = type === 'received' || type === 'sent';

  const handleAcceptFriendRequest = () => {
    onAcceptFriendRequest?.(userData.userId);
  };

  const handleDeclineFriendRequest = () => {
    onDeclineFriendRequest?.(userData.userId);
    onCancelFriendRequest?.(userData.userId);
  };

  const handleOpen = () => {
    onViewFriend?.(userData, type);
  };

  return (
    <TouchableOpacity
      disabled={!handleOpen}
      onPress={handleOpen}
    >
      <HStack alignItems="center">
        <Animated.View
          entering={animate ? FadeIn.delay(25 * index) : undefined}
          exiting={animate ? FadeOut : undefined}
        >
          <Avatar
            isOnline={
              profile?.onlineStatus === ProfilePresenceStatus.PresenceStatusOnline
            }
            profile={profile}
            size={size}
          />
        </Animated.View>
        <Gutter width={12} />
        <Animated.View
          entering={animate ? FadeInLeft.delay(50 * index) : undefined}
          exiting={animate ? FadeOut : undefined}
          style={s.animatedView}
        >
          <VStack style={s.textContainer}>
            <Typography
              fontSize="xl"
              fontWeight="medium"
              numberOfLines={1}
            >
              {profile?.userTag}
            </Typography>
            <Gutter height={1} />
            {activity?.isOnline && !!activity?.channelId && (
              <>
                <HStack>
                  <Typography
                    numberOfLines={1}
                    style={s.flex}
                  >
                    <Typography
                      fontWeight="extraBold"
                      numberOfLines={1}
                      style={s.flex}
                    >
                      {activity.channel?.name}
                    </Typography>
                    <Typography
                      color="textSecondary"
                      fontWeight="medium"
                      numberOfLines={1}
                      style={s.flex}
                    >{` - ${activity.channel?.game.name}`}</Typography>
                  </Typography>
                </HStack>
              </>
            )}
            {activity?.isOnline && !activity.channelId && (
              <Typography
                color="textSecondary"
                fontWeight="medium"
              >
                Browsing
              </Typography>
            )}
            {!activity?.isOnline && (
              <Typography
                color="textSecondary"
                fontWeight="medium"
              >
                {timeSinceLabel
                  ? `Offline for ${timeSinceLabel}`
                  : `Recently went offline`}
              </Typography>
            )}
          </VStack>
          <HStack spacing={8}>
            {!!onAcceptFriendRequest && (
              <ButtonIcon
                backgroundColor="whiteTransparent10"
                style={s.buttonIcon}
                onPress={handleAcceptFriendRequest}
              >
                <IconAssets.CheckThin
                  color={colors.white}
                  height={24}
                  width={24}
                />
              </ButtonIcon>
            )}
            {declinable && (
              <>
                <ButtonIcon
                  backgroundColor="whiteTransparent05"
                  style={s.buttonIcon}
                  onPress={handleDeclineFriendRequest}
                >
                  <IconAssets.Close
                    color={colors.white}
                    height={24}
                    width={24}
                  />
                </ButtonIcon>
                <Gutter width={4} />
              </>
            )}
          </HStack>
        </Animated.View>
      </HStack>
    </TouchableOpacity>
  );
};

FriendsListItem.Loading = () => {
  return (
    <Animated.View exiting={FadeOut.duration(150)}>
      <HStack alignItems="center">
        <LoadingView style={s.loadingIcon} />
        <Gutter width={12} />
        <LoadingView style={s.loadingContent} />
      </HStack>
    </Animated.View>
  );
};

const s = StyleSheet.create({
  buttonIcon: {
    padding: 8,
  },
  loadingIcon: {
    width: 42,
    height: 42,
    borderRadius: 42,
  },
  loadingContent: {
    height: 42,
    flex: 1,
    borderRadius: 6,
  },
  animatedView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  textContainer: {
    flex: 1,
    paddingRight: 16,
  },
  flex: {
    flex: 1,
  },
});
