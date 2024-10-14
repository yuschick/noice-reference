import { gql } from '@apollo/client';
import {
  useAuthentication,
  useBooleanFeatureFlag,
  useKeyContentLoadTracker,
} from '@noice-com/common-ui';

import { HomePageChannelList } from '../HomePageChannelList';
import { HOME_CHANNEL_POLL_INTERVAL } from '../utils';

import { BackupOfflineChannels } from './BackupOfflineChannels';

import { BROWSE_CHANNELS_PATH, Routes } from '@common/route';
import { useHomeLiveChannelsQuery } from '@gen';

gql`
  query HomeLiveChannels($cursor: String, $skipUserFields: Boolean!) {
    channels(liveStatus: LIVE_STATUS_LIVE, cursor: { first: 12, after: $cursor })
      @connection(key: "homepage") {
      pageInfo {
        hasNextPage
        endCursor
      }
      channels {
        id
        ...HomePageChannelListLiveChannel
      }
    }
  }
`;

export function HomeLiveChannels() {
  const { userId } = useAuthentication();

  const { data, loading, previousData, fetchMore } = useHomeLiveChannelsQuery({
    pollInterval: HOME_CHANNEL_POLL_INTERVAL,
    fetchPolicy: 'network-only',
    variables: {
      skipUserFields: !userId,
    },
  });
  const hasNextChannelsPage = data?.channels?.pageInfo?.hasNextPage ?? false;

  useKeyContentLoadTracker('channel_list', loading && !previousData);
  const [useNewBrowseLink] = useBooleanFeatureFlag('categoriesListing');

  const onLoadMoreChannels = async () => {
    if (!hasNextChannelsPage) {
      return;
    }

    const cursor = data?.channels?.pageInfo.endCursor;

    await fetchMore({
      variables: {
        cursor,
      },
    });
  };

  if (loading) {
    return (
      <HomePageChannelList.Loading
        seeAllPath={useNewBrowseLink ? BROWSE_CHANNELS_PATH : Routes.Browse}
        title="Channels"
        titlePrefix="Live"
      />
    );
  }

  if (!data?.channels?.channels.length) {
    return <BackupOfflineChannels />;
  }

  return (
    <HomePageChannelList
      analyticsSection="live"
      channels={data?.channels?.channels ?? []}
      pagination={{
        hasNextPage: hasNextChannelsPage,
        onLoadMore: onLoadMoreChannels,
      }}
      seeAllPath={useNewBrowseLink ? BROWSE_CHANNELS_PATH : Routes.Browse}
      title="Channels"
      titlePrefix="Live"
    />
  );
}
