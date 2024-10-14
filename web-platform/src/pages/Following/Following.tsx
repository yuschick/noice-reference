import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import { CoreAssets } from '@noice-com/assets-core';
import { Icon, useAuthentication } from '@noice-com/common-ui';
import { Helmet } from 'react-helmet-async';

import styles from './Following.module.css';

import { ChannelListPageChannels } from '@common/channels';
import { ChannelListPagesNavigation } from '@common/navigation';
import {
  useFollowingPageEmptyQuery,
  useFollowingPageLiveChannelsQuery,
  useFollowingPageOfflineChannelsQuery,
} from '@gen';

gql`
  query FollowingPageLiveChannels(
    $userId: ID!
    $cursor: String
    $skipUserFields: Boolean = false
  ) {
    followedChannels(
      userId: $userId
      cursor: { first: 16, after: $cursor }
      liveStatus: LIVE_STATUS_LIVE
    ) {
      pageInfo {
        endCursor
        hasNextPage
      }
      channels {
        id
        ...LiveChannelPreviewChannel
      }
    }
  }

  query FollowingPageOfflineChannels($userId: ID!, $cursor: String) {
    followedChannels(
      userId: $userId
      cursor: { first: 16, after: $cursor }
      liveStatus: LIVE_STATUS_OFFLINE
    ) {
      pageInfo {
        endCursor
        hasNextPage
      }
      channels {
        id
        ...OfflineChannelLinkChannel
      }
    }
  }

  query FollowingPageEmpty($skipUserFields: Boolean!) {
    channels(liveStatus: LIVE_STATUS_LIVE, cursor: { first: 8 }) {
      channels {
        id
        ...LiveChannelPreviewChannel
      }
    }
  }
`;

export function Following() {
  const { userId } = useAuthentication();

  const { data, loading, fetchMore } = useFollowingPageLiveChannelsQuery({
    ...variablesOrSkip({ userId }),
  });

  const liveChannels = data?.followedChannels?.channels;
  const hasNextLiveChannelsPage = !!data?.followedChannels?.pageInfo?.hasNextPage;

  const { data: offlineData, fetchMore: fetchMoreOfflineChannels } =
    useFollowingPageOfflineChannelsQuery({
      ...variablesOrSkip({ userId }),
    });

  const offlineChannels = offlineData?.followedChannels?.channels;
  const hasNextOfflineChannelsPage =
    !!offlineData?.followedChannels?.pageInfo?.hasNextPage;

  const noFollowedChannels =
    !loading && !liveChannels?.length && !offlineChannels?.length;

  const { data: backupData } = useFollowingPageEmptyQuery({
    variables: { skipUserFields: !userId },
    skip: !noFollowedChannels,
  });

  const onLoadMoreLiveChannels = async () => {
    if (!hasNextLiveChannelsPage) {
      return;
    }

    const cursor = data?.followedChannels?.pageInfo.endCursor;

    await fetchMore({
      variables: {
        cursor,
      },
    });
  };

  const onLoadMoreOfflineChannels = async () => {
    if (!hasNextOfflineChannelsPage) {
      return;
    }

    const cursor = offlineData?.followedChannels?.pageInfo.endCursor;

    await fetchMoreOfflineChannels({
      variables: {
        cursor,
      },
    });
  };

  return (
    <>
      <Helmet>
        <title>Following</title>
      </Helmet>

      <section className={styles.followingPage}>
        <ChannelListPagesNavigation />

        <h1 className={styles.title}>Following</h1>

        {noFollowedChannels ? (
          <>
            <div className={styles.emptyWrapper}>
              <div className={styles.emptyContent}>
                <Icon
                  icon={CoreAssets.Icons.Heart}
                  size={48}
                />

                <div className={styles.emptyText}>
                  <h2 className={styles.emptyTitle}>
                    Your followed page is a little quiet right now
                  </h2>

                  <span>
                    Hit that follow button to get live notifications and watch your
                    favorite creators
                  </span>
                </div>
              </div>
            </div>

            {!!backupData?.channels?.channels.length && (
              <ChannelListPageChannels
                analyticsSection="backup"
                channels={backupData.channels.channels}
                title="channels for you"
                titlePrefix="Live"
              />
            )}
          </>
        ) : (
          <>
            {loading && (
              <ChannelListPageChannels.Loading
                title="channels"
                titlePrefix="Live"
              />
            )}

            {!!liveChannels?.length && (
              <ChannelListPageChannels
                analyticsSection="live"
                channels={liveChannels}
                hasNextPage={hasNextLiveChannelsPage}
                title="channels"
                titlePrefix="Live"
                onLoadMore={onLoadMoreLiveChannels}
              />
            )}

            {!!offlineChannels?.length && (
              <ChannelListPageChannels
                analyticsSection="offline"
                channels={offlineChannels}
                hasNextPage={hasNextOfflineChannelsPage}
                status="offline"
                title="Offline channels"
                onLoadMore={onLoadMoreOfflineChannels}
              />
            )}
          </>
        )}
      </section>
    </>
  );
}
