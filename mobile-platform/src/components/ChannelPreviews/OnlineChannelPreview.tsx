import { gql } from '@apollo/client';
import { makeLoggers } from '@noice-com/utils';
import { useNavigation } from '@react-navigation/native';
import { PropsWithChildren } from 'react';
import { StyleSheet, TextProps, TouchableOpacity, View } from 'react-native';
import { ContextMenuView, OnPressMenuItemEvent } from 'react-native-ios-context-menu';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { ChannelDetails } from './common/ChannelDetails';

import { AvatarList } from '@components/AvatarList';
import { ImageWrapper } from '@components/ImageWrapper';
import { PillLabel } from '@components/PillLabel';
import { HStack } from '@components/Stack/HStack';
import { VStack } from '@components/Stack/VStack';
import { StreamPreviewCard } from '@components/StreamPreviewCard';
import { Typography } from '@components/Typography';
import { colors } from '@constants/styles';
import { ChannelLiveStatus, OnlineChannelPreviewViewFragment } from '@gen/graphql';
import { useChannelFollowing } from '@hooks/channel/useChannelFollowing.hook';
import { AuthenticatedNavigationHookProps } from '@navigators/routes';
import { isNonEmptyString } from '@utils/equality';
import { IconAssets } from '@utils/icons';

const { logWarn } = makeLoggers('OnlineChannelPreview');

OnlineChannelPreview.fragments = {
  channel: gql`
    fragment OnlineChannelPreviewView on ChannelChannel {
      id
      title
      following
      name
      viewerCount
      thumbnail
      currentStreamId
      liveStatus
      ...ChannelDetails
      channelFriends {
        users {
          userId
          ...ActiveFriendsPreviewItem
        }
      }
      game {
        id
        name
      }
    }
    ${AvatarList.fragments.profile}
    ${ChannelDetails.fragments.channel}
  `,
};

const StreamMetaLabel = ({ children, ...rest }: PropsWithChildren<TextProps>) => (
  <Typography
    color="gray400"
    fontSize="sm"
    fontWeight="semiBold"
    lineHeight="sm"
    {...rest}
  >
    {children}
  </Typography>
);

interface Props {
  channel: OnlineChannelPreviewViewFragment;
}

type MenuAction = 'goToStream' | 'goToChannel' | 'changeFollowingStatus';
export function OnlineChannelPreview({ channel }: Props) {
  const { follow, unfollow } = useChannelFollowing(channel.id);
  const navigation = useNavigation<AuthenticatedNavigationHookProps>();
  const {
    id,
    name,
    currentStreamId,
    thumbnail,
    title,
    liveStatus,
    game,
    following,
    matureRatedContent,
  } = channel;

  const handlePressStream = () => {
    if (!currentStreamId) {
      logWarn('Tried navigating to live stream without an ID!', channel);
      return;
    }

    // @todo we will prob need to eventually move this to some
    // external API so we can have PiP; OR we can see if we can
    // use native API's (which I'm pretty sure there is some?)
    navigation.navigate('stream', {
      streamId: currentStreamId,
      channelId: id,
      hasMatureContent: matureRatedContent,
      liveStatus: liveStatus ?? ChannelLiveStatus.LiveStatusLive,
    });
  };

  const handlePressGame = () => {
    navigation.navigate('browse', {
      gameId: game.id,
    });
  };

  const navigateToChannel = () => {
    navigation.navigate('channel', {
      channelName: name,
    });
  };

  const streamerName = isNonEmptyString(name) ? name : 'Unknown streamer';
  const gameName = isNonEmptyString(game?.name) ? game.name : 'Live stream';
  const streamTitle = isNonEmptyString(title) ? title : `${name} - ${gameName}`;

  const channelFriends = channel.channelFriends?.users ?? [];
  const channelFriendCount = channelFriends.length;
  const visibleAvatars = channelFriends.slice(0, 3).map((friend) => friend.profile);

  const onPressMenuItem: OnPressMenuItemEvent = (event) => {
    switch (event.nativeEvent.actionKey as MenuAction) {
      case 'changeFollowingStatus':
        following ? unfollow() : follow();
        break;
      case 'goToChannel':
        navigateToChannel();
        break;
      case 'goToStream':
        handlePressStream();
    }
  };

  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut}
    >
      <VStack
        alignItems="stretch"
        justifyContent="flex-start"
        spacing={12}
      >
        <ContextMenuView
          menuConfig={{
            type: 'menu',
            menuTitle: '',
            menuItems: [
              {
                actionKey: 'goToStream',
                actionTitle: 'Open stream',
              },
              {
                actionKey: 'goToChannel',
                actionTitle: 'Go to channel',
              },
              {
                actionKey: 'changeFollowingStatus',
                actionTitle: following ? 'Unfollow channel' : 'Follow channel',
              },
            ],
          }}
          previewConfig={{
            previewType: 'CUSTOM',
            previewSize: 'INHERIT',
          }}
          renderPreview={() => (
            <StreamPreviewCard
              channel={channel}
              // navigation is handled by the context menu
              onPress={() => {}}
            />
          )}
          onPressMenuItem={onPressMenuItem}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handlePressStream}
          >
            <View>
              <View style={s.parallaxContainer}>
                <ImageWrapper
                  source={{ uri: thumbnail !== '' ? thumbnail : undefined }}
                  style={s.thumbnail}
                />
              </View>
              {channelFriendCount > 0 && (
                <View style={s.activeFriends}>
                  <AvatarList
                    avatars={visibleAvatars}
                    totalCount={channelFriendCount}
                  />
                </View>
              )}
              <HStack
                alignItems="flex-start"
                justifyContent="flex-end"
                spacing={4}
                style={s.streamStats}
              >
                <PillLabel
                  color={['violetMain', 'magentaMain']}
                  label="live"
                  uppercase
                />
                <PillLabel
                  color="gray950"
                  icon={
                    <IconAssets.Person
                      color={colors.white}
                      height={12}
                      width={12}
                    />
                  }
                  label={channel.viewerCount?.toString()}
                />
              </HStack>
            </View>
          </TouchableOpacity>
        </ContextMenuView>

        <ChannelDetails
          channel={channel}
          matureRatedContent={matureRatedContent}
          title={streamTitle}
          onAvatarPress={navigateToChannel}
          onTitlePress={handlePressStream}
        >
          <StreamMetaLabel onPress={navigateToChannel}>{streamerName}</StreamMetaLabel>
          <View style={s.divider} />
          <StreamMetaLabel onPress={handlePressGame}>{gameName}</StreamMetaLabel>
        </ChannelDetails>
      </VStack>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  thumbnail: {
    position: 'relative',
    width: '120%',
    marginLeft: '-10%',
    aspectRatio: 16 / 9,
    borderRadius: 12,
  },
  divider: {
    alignSelf: 'stretch',
    width: 1,
    backgroundColor: colors.gray700,
  },
  activeFriends: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  streamStats: {
    position: 'absolute',
    top: 8,
    left: 8,
  },
  parallaxContainer: {
    overflow: 'hidden',
    aspectRatio: 16 / 9,
    borderRadius: 12,
  },
});
