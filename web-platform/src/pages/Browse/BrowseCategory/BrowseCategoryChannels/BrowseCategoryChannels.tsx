import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import { CoreAssets } from '@noice-com/assets-core';
import { ButtonLink, Icon } from '@noice-com/common-ui';

import styles from './BrowseCategoryChannels.module.css';

import { ChannelListPageChannels } from '@common/channels';
import { Routes } from '@common/route';
import {
  useBrowseCategoryChannelsQuery,
  useBrowseCategoryOfflineChannelsQuery,
} from '@gen';

gql`
  query BrowseCategoryChannels(
    $categoryId: ID!
    $cursor: String
    $skipUserFields: Boolean = false
  ) {
    channels(
      liveStatus: LIVE_STATUS_LIVE
      gameId: $categoryId
      cursor: { first: 16, after: $cursor }
    ) {
      pageInfo {
        endCursor
        hasNextPage
      }
      channels {
        id
        ...ChannelListPageChannelsChannel
      }
    }
  }

  query BrowseCategoryOfflineChannels($categoryId: ID!, $cursor: String) {
    channels(
      liveStatus: LIVE_STATUS_OFFLINE
      gameId: $categoryId
      cursor: { first: 16, after: $cursor }
    ) {
      pageInfo {
        endCursor
        hasNextPage
      }
      channels {
        id
        ...ChannelListPageChannelsOfflineChannel
      }
    }
  }
`;

interface Props {
  categoryId: string;
}

export function BrowseCategoryChannels({ categoryId }: Props) {
  const { data, loading, fetchMore } = useBrowseCategoryChannelsQuery({
    ...variablesOrSkip({ categoryId }),
  });
  const channels = data?.channels?.channels ?? [];
  const hasNextChannelsPage = data?.channels?.pageInfo?.hasNextPage ?? false;

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

  const queryArguments = variablesOrSkip({ categoryId });
  const {
    data: offlineData,
    loading: offlineLoading,
    fetchMore: fetchMoreOffline,
  } = useBrowseCategoryOfflineChannelsQuery({
    ...queryArguments,
    skip: !!loading || !!data?.channels?.channels.length || queryArguments.skip,
  });
  const offlineChannels = offlineData?.channels?.channels ?? [];
  const hasNextOfflineChannelsPage =
    offlineData?.channels?.pageInfo?.hasNextPage ?? false;

  const onLoadMoreOfflineChannels = async () => {
    if (!hasNextOfflineChannelsPage) {
      return;
    }

    const cursor = offlineData?.channels?.pageInfo.endCursor;

    await fetchMoreOffline({
      variables: {
        cursor,
      },
    });
  };

  if (loading) {
    return (
      <ChannelListPageChannels.Loading
        title="channels"
        titlePrefix="Live"
      />
    );
  }

  if (channels.length) {
    return (
      <ChannelListPageChannels
        analyticsSection="live"
        channels={channels}
        hasNextPage={hasNextChannelsPage}
        title="channels"
        titlePrefix="Live"
        onLoadMore={onLoadMoreChannels}
      />
    );
  }

  if (offlineLoading) {
    return (
      <ChannelListPageChannels.Loading
        title="channels"
        titlePrefix="Live"
      />
    );
  }

  if (!offlineChannels.length) {
    return (
      <div className={styles.emptyContent}>
        <Icon
          icon={CoreAssets.Icons.Play}
          size={48}
        />

        <div className={styles.emptyText}>
          <h2 className={styles.emptyTitle}>No live streams at the moment</h2>

          <ButtonLink
            fit="content"
            level="secondary"
            size="sm"
            to={Routes.Browse}
          >
            Browse other categories
          </ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <ChannelListPageChannels
      analyticsSection="offline"
      channels={offlineChannels}
      hasNextPage={hasNextOfflineChannelsPage}
      status="offline"
      title="Offline channels"
      onLoadMore={onLoadMoreOfflineChannels}
    />
  );
}
