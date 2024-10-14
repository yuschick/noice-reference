import { gql } from '@apollo/client';
import { useScrollToTop } from '@react-navigation/native';
import { useCallback, useRef } from 'react';
import { RefreshControl, StyleSheet, useWindowDimensions } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { ChannelList } from '../../../components/ChannelList/ChannelList';

import { ActiveFriendsList } from './components/ActiveFriendsList';

import { OfflineChannelPreview, OnlineChannelPreview } from '@components/ChannelPreviews';
import { FollowedChannelsRow } from '@components/FollowedChannelsRow/FollowedChannelsRow';
import { GradientText } from '@components/GradientText';
import { Gutter } from '@components/Gutter';
import {
  LargeHeader,
  LargeHeaderGutter,
  useLargeHeaderAnimation,
  useLargeHeaderOffset,
} from '@components/PageHeaders/LargeHeader';
import { PageLayout } from '@components/PageLayout';
import { HStack } from '@components/Stack/HStack';
import { VStack } from '@components/Stack/VStack';
import { StreamCategoriesRow } from '@components/StreamCategoriesRow/StreamCategoriesRow';
import { Typography } from '@components/Typography';
import { colors } from '@constants/styles';
import {
  ChannelLiveStatus,
  OnlineChannelPreviewViewFragment,
  useLiveChannelsQuery,
} from '@gen/graphql';
import { useNotificationEvents } from '@hooks/notifications/useNotificationEvents.hook';
import { usePushNotificationToken } from '@hooks/notifications/usePushNotificationToken.hook';
import { useAuth } from '@hooks/useAuth.hook';
import { useIsConnected } from '@hooks/useIsConnected.hook';
import { useMountEffect } from '@hooks/useMountEffect.hook';
import { useRefetchOnAppStateChange } from '@hooks/useRefetchOnAppStateChange.hook';
import { useUserRefresh } from '@hooks/useUserRefresh.hook';
import { useVersionCheck } from '@hooks/useVersionCheck.hook';
import { AuthenticatedScreenProps } from '@navigators/routes';

// @todo - Eventually we should ask backend for a "count" endpoint
// Makes no sense to have to request ALL of them when we are just
// gonna show 3 previews.
gql`
  query ActiveFriendsPreview($userId: ID!) {
    friends(userId: $userId, filters: [{ isOnline: true }]) {
      users {
        ...ActiveFriendsPreviewItem
      }
    }
  }

  ${ActiveFriendsList.fragments.friend}

  query LiveChannels {
    channels(liveStatus: LIVE_STATUS_LIVE) {
      channels {
        id
        ...OnlineChannelPreviewView
      }
    }
  }

  ${OnlineChannelPreview.fragments.channel}
  ${OfflineChannelPreview.fragments.channel}
`;

export const HomeView = ({ navigation }: AuthenticatedScreenProps<'home'>) => {
  const { userId } = useAuth();
  const ref = useRef<Animated.FlatList<OnlineChannelPreviewViewFragment>>(null);
  useScrollToTop(ref);

  const offset = useLargeHeaderOffset();
  const isConnected = useIsConnected();
  const {
    data: liveChannelData,
    refetch: refetchChannels,
    loading: isChannelsLoading,
  } = useLiveChannelsQuery({
    // 2 minutes
    pollInterval: 1000 * 60 * 2,
  });
  const { refresh, isUserRefresh } = useUserRefresh([refetchChannels]);
  const { height } = useWindowDimensions();
  const { scrollY, scrollHandler } = useLargeHeaderAnimation();

  useRefetchOnAppStateChange(refetchChannels);

  // Register push notification token
  // optimally it would be better to do this higher up in the navigation tree
  // but there isn't really a good place to do it right now.
  usePushNotificationToken();
  useNotificationEvents();

  useMountEffect(() => {
    const unsub = navigation.addListener('focus', () => {
      refetchChannels();
    });

    return () => {
      unsub();
    };
  });

  useVersionCheck();

  const activeChannels = liveChannelData?.channels?.channels ?? [];

  const renderChannelItem = useCallback(
    ({ item }: { item: OnlineChannelPreviewViewFragment; index: number }) => (
      <>
        <OnlineChannelPreview
          channel={item}
          key={item.id}
        />
        <Gutter height={16} />
      </>
    ),
    [],
  );

  const showEmptyState = (!isChannelsLoading && !activeChannels.length) || !isConnected;

  const listHeader = (
    <>
      <LargeHeaderGutter />
      <FollowedChannelsRow />
      <StreamCategoriesRow />
      <Gutter height={40} />

      {!showEmptyState && (
        <Animated.View entering={FadeIn}>
          <HStack alignItems="center">
            <GradientText
              fontSize="md"
              fontWeight="bold"
              gradientEnd={colors.tealMain}
              gradientStart={colors.greenMain}
              uppercase
            >
              Live
            </GradientText>
            <Gutter width={4} />
            <Typography
              fontSize="md"
              fontWeight="bold"
              lineHeight="md"
              uppercase
            >
              Channels
            </Typography>
          </HStack>
        </Animated.View>
      )}
      <Gutter height={24} />
    </>
  );

  const listFooter = isChannelsLoading ? (
    <VStack
      spacing={16}
      style={s.loadingContainer}
    >
      <OfflineChannelPreview.Loading />
      <OfflineChannelPreview.Loading />
      <OfflineChannelPreview.Loading />
      <OfflineChannelPreview.Loading />
    </VStack>
  ) : (
    <Gutter height={124} />
  );

  return (
    <PageLayout.Simple>
      {!showEmptyState ? (
        <Animated.FlatList
          ListFooterComponent={listFooter}
          ListHeaderComponent={listHeader}
          contentContainerStyle={s.flatListContainer}
          data={activeChannels}
          ref={ref}
          refreshControl={
            <RefreshControl
              progressViewOffset={offset}
              refreshing={isUserRefresh}
              tintColor={colors.white}
              onRefresh={refresh}
            />
          }
          renderItem={renderChannelItem}
          style={{ height }}
          onScroll={scrollHandler}
        />
      ) : (
        <ChannelList
          ListFooterComponent={listFooter}
          ListHeaderComponent={listHeader}
          contentContainerStyle={s.flatListContainer}
          refreshControl={
            <RefreshControl
              progressViewOffset={offset}
              refreshing={isUserRefresh}
              tintColor={colors.white}
              onRefresh={refresh}
            />
          }
          scrollY={scrollY}
          withLiveStatus={ChannelLiveStatus.LiveStatusOffline}
          onScroll={scrollHandler}
        />
      )}
      <LargeHeader
        scrollY={scrollY}
        title="Discover"
        userId={userId}
        showCurrencies
      />
    </PageLayout.Simple>
  );
};

const s = StyleSheet.create({
  flatListContainer: {
    paddingHorizontal: 16,
  },
  loadingContainer: {
    width: '100%',
  },
});
