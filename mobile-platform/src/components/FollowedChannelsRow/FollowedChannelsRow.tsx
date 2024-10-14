import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { ChannelLogo } from '@components/ChannelLogo';
import { Gutter } from '@components/Gutter';
import { LoadingView } from '@components/LoadingView';
import { HStack } from '@components/Stack/HStack';
import { VStack } from '@components/Stack/VStack';
import { Typography } from '@components/Typography';
import {
  ChannelLiveStatus,
  FollowedChannelsRowChannelDataFragment,
  useFollowedChannelsRowQuery,
} from '@gen/graphql';
import { useAuth } from '@hooks/useAuth.hook';
import { AuthenticatedNavigationHookProps } from '@navigators/routes';

gql`
  query FollowedChannelsRow($userId: ID!) {
    followedChannels(userId: $userId) {
      channels {
        ...FollowedChannelsRowChannelData
      }
    }
  }

  fragment FollowedChannelsRowChannelData on ChannelChannel {
    id
    currentStreamId
    name
    liveStatus
    ...ChannelLogo
  }

  ${ChannelLogo.fragments.channel}
`;

const ListItemSeparator = () => <Gutter width={16} />;

export const FollowedChannelsRow = () => {
  const { userId } = useAuth();
  const { data, loading, refetch } = useFollowedChannelsRowQuery({
    ...variablesOrSkip({
      userId,
    }),
  });

  const navigation = useNavigation<AuthenticatedNavigationHookProps>();
  const channels = data?.followedChannels?.channels ?? [];

  useEffect(() => {
    if (!userId) {
      return;
    }

    const unsub = navigation.addListener('focus', () =>
      refetch({
        userId,
      }),
    );

    return unsub;
  }, [navigation, refetch, userId]);

  const navigateToChannel = ({
    channelName,
    isOnline,
    channelId,
    streamId,
    liveStatus,
  }: {
    channelName: string;
    isOnline: boolean;
    channelId: string;
    streamId: string;
    liveStatus: ChannelLiveStatus;
  }) => {
    if (isOnline) {
      navigation.navigate('stream', {
        streamId,
        channelId,
        liveStatus: liveStatus ?? ChannelLiveStatus.LiveStatusLive,
      });
    } else {
      navigation.navigate('channel', {
        channelName,
      });
    }
  };

  const keyExtractor = (item: { id: string }) => item.id;

  const renderItem = ({
    item,
    index,
  }: {
    item: FollowedChannelsRowChannelDataFragment;
    index: number;
  }) => {
    const isOnline = item.liveStatus === ChannelLiveStatus.LiveStatusLive;

    return (
      <Animated.View entering={FadeIn.delay(100 * index)}>
        <TouchableOpacity style={s.channelContainer}>
          <ChannelLogo
            isOnline={isOnline}
            key={item.id}
            size="large"
            greyScaleOffline
            {...item}
            onPress={() =>
              navigateToChannel({
                channelName: item.name,
                isOnline,
                channelId: item.id,
                streamId: item.currentStreamId ?? '',
                liveStatus: item.liveStatus ?? ChannelLiveStatus.LiveStatusLive,
              })
            }
          />
          <Gutter height={4} />
          <Typography
            fontSize="sm"
            numberOfLines={1}
            textAlign="center"
          >
            {item.name}
          </Typography>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  if (!loading && channels.length === 0) {
    return null;
  }

  return (
    <VStack
      margin={[0, 0, 40, 0]}
      spacing={16}
    >
      <Typography
        fontSize="md"
        fontWeight="bold"
        uppercase
      >
        Following
      </Typography>
      {!loading ? (
        <FlatList
          ItemSeparatorComponent={ListItemSeparator}
          data={channels}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          showsHorizontalScrollIndicator={false}
          style={s.list}
          horizontal
        />
      ) : (
        <HStack spacing={16}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Animated.View
              exiting={FadeOut}
              key={i}
            >
              <LoadingView style={s.loadingAvatar} />
            </Animated.View>
          ))}
        </HStack>
      )}
    </VStack>
  );
};

const s = StyleSheet.create({
  channelContainer: {
    width: 56,
  },
  list: {
    overflow: 'visible',
  },
  loadingAvatar: { width: 56, height: 56, borderRadius: 56 },
});
