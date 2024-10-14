import { gql } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import { useCallback, useMemo } from 'react';
import {
  RefreshControl,
  SectionList,
  SectionListProps,
  SectionListRenderItem,
  StyleSheet,
} from 'react-native';
import Animated, { SharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { OfflineChannelPreview, OnlineChannelPreview } from '@components/ChannelPreviews';
import { Divider } from '@components/Divider';
import { GradientText } from '@components/GradientText';
import { Gutter } from '@components/Gutter';
import { HStack } from '@components/Stack/HStack';
import { VStack } from '@components/Stack/VStack';
import { Typography } from '@components/Typography';
import { colors } from '@constants/styles';
import {
  ChannelDataFragment,
  ChannelLiveStatus,
  useChannelListQuery,
} from '@gen/graphql';
import { useMountEffect } from '@hooks/useMountEffect.hook';
import { useUserRefresh } from '@hooks/useUserRefresh.hook';

gql`
  query ChannelList(
    $liveStatus: ChannelLiveStatus
    $gameId: ID
    $cursor: APICursorInput
  ) {
    channels(liveStatus: $liveStatus, gameId: $gameId, cursor: $cursor) {
      channels {
        ...ChannelData
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }

  fragment ChannelData on ChannelChannel {
    id
    following
    ...OnlineChannelPreviewView
    ...OfflineChannelThumbnail
  }

  ${OnlineChannelPreview.fragments.channel}
  ${OfflineChannelPreview.fragments.channel}
`;

const LiveHeader = () => (
  <>
    <HStack
      alignItems="center"
      justifyContent="flex-start"
      spacing={4}
    >
      <GradientText
        fontSize="lg"
        fontWeight="bold"
        gradientEnd={colors.tealMain}
        gradientStart={colors.greenMain}
        uppercase
      >
        Live
      </GradientText>
      <Typography
        color="textLight"
        fontSize="lg"
        fontWeight="bold"
        uppercase
      >
        Channels
      </Typography>
    </HStack>
    <Gutter height={16} />
  </>
);

interface OfflineHeadProps {
  includeDivider: boolean;
}

const OfflineHeader = ({ includeDivider }: OfflineHeadProps) => (
  <>
    {includeDivider && (
      <>
        <Divider />
        <Gutter height={24} />
      </>
    )}
    <Typography
      color="textSecondary"
      fontSize="lg"
      fontWeight="medium"
      uppercase
    >
      Offline channels
    </Typography>
    <Gutter height={16} />
  </>
);

const SectionFooter = () => <Gutter height={24} />;
const ItemSeparator = () => <Gutter height={16} />;

type ChannelLiveStatusTitle = 'live' | 'offline';

type SectionData = {
  title: ChannelLiveStatusTitle;
  data: ChannelDataFragment[];
};

type Props = {
  gameId?: string;
  isFollowing?: boolean;
  withLiveStatus?: ChannelLiveStatus;
  scrollY: SharedValue<number>;
} & Omit<SectionListProps<ChannelDataFragment, SectionData>, 'sections'>;

const AnimatedSectionList =
  Animated.createAnimatedComponent<SectionListProps<ChannelDataFragment, SectionData>>(
    SectionList,
  );

export function ChannelList({
  gameId,
  isFollowing,
  withLiveStatus,
  scrollY,
  ...props
}: Props) {
  const insets = useSafeAreaInsets();
  const { data, loading, refetch } = useChannelListQuery({
    variables: {
      gameId,
      liveStatus: withLiveStatus,
    },
  });
  const navigation = useNavigation();
  const { isUserRefresh, refresh } = useUserRefresh(refetch);

  useMountEffect(() => {
    const unsub = navigation.addListener('focus', () => {
      refetch();
    });

    return () => {
      unsub();
    };
  });

  const channelSections = useMemo(() => {
    const channels = data?.channels?.channels ?? [];

    const liveChannels: SectionData = {
      title: 'live',
      data: [],
    };

    const offlineChannels: SectionData = {
      title: 'offline',
      data: [],
    };

    for (const channel of channels) {
      if (isFollowing && !channel.following) {
        continue;
      }

      if (channel.liveStatus === ChannelLiveStatus.LiveStatusLive) {
        liveChannels.data.push(channel);
      }

      if (channel.liveStatus === ChannelLiveStatus.LiveStatusOffline) {
        offlineChannels.data.push(channel);
      }
    }

    const sections: SectionData[] = [];

    if (liveChannels.data.length > 0) {
      sections.push(liveChannels);
    }

    if (offlineChannels.data.length > 0) {
      sections.push(offlineChannels);
    }

    return sections;
  }, [data?.channels?.channels, isFollowing]);

  const renderSectionHeader = useCallback(
    ({ section: { title } }: { section: { title: string } }) => {
      return title === 'live' ? (
        <LiveHeader />
      ) : (
        <OfflineHeader includeDivider={channelSections.length > 1} />
      );
    },
    [channelSections.length],
  );

  const renderItem: SectionListRenderItem<ChannelDataFragment> = useCallback(
    ({ item, index }) => {
      if (item.liveStatus === ChannelLiveStatus.LiveStatusLive) {
        return (
          <OnlineChannelPreview
            channel={item}
            index={index}
            scrollY={scrollY}
          />
        );
      }

      return <OfflineChannelPreview channel={item} />;
    },
    [scrollY],
  );

  const skeletonPlaceholder = useMemo(() => {
    if (!loading) {
      return null;
    }

    return (
      <VStack
        spacing={16}
        style={s.loadingContainer}
      >
        <OfflineChannelPreview.Loading />
        <OfflineChannelPreview.Loading />
        <OfflineChannelPreview.Loading />
        <OfflineChannelPreview.Loading />
      </VStack>
    );
  }, [loading]);

  return (
    <AnimatedSectionList
      ItemSeparatorComponent={ItemSeparator}
      ListFooterComponent={skeletonPlaceholder}
      keyExtractor={(item, index) => `${item.id} - ${index}`}
      refreshControl={
        <RefreshControl
          progressViewOffset={insets.top}
          refreshing={isUserRefresh}
          tintColor="white"
          onRefresh={refresh}
        />
      }
      refreshing={loading}
      renderItem={renderItem}
      renderSectionFooter={SectionFooter}
      renderSectionHeader={renderSectionHeader}
      sections={channelSections}
      style={s.sectionList}
      onRefresh={refresh}
      {...props}
    />
  );
}

const s = StyleSheet.create({
  sectionList: {
    height: '100%',
  },
  loadingContainer: {
    width: '100%',
  },
});
