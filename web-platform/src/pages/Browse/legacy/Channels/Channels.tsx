import { gql } from '@apollo/client';
import { LoadingSkeleton } from '@noice-com/common-ui';
import classNames from 'classnames';
import { useSearchParams } from 'react-router-dom';

import { getCategoryNameFromSearchParam } from '../utils';

import styles from './Channels.module.css';

import { LiveChannelPreview, OfflineChannelLink } from '@common/channel';
import {
  useOfflineChannelApolloCacheCleanHack,
  useChannelListClickAnalyticsEvent,
} from '@common/channels';
import { QueryParams } from '@common/route';
import { ShowMoreButton } from '@common/search';
import {
  useBrowseHighlightedChannelsQuery,
  useBrowseLiveChannelsQuery,
  useBrowseOfflineChannelsQuery,
} from '@gen';

const INITIAL_ONLINE_PAGE_SIZE = 8;
const LOAD_MORE_ONLINE_SIZE = 4;

const INITIAL_OFFLINE_CHANNELS_PAGE_SIZE = 20;
const LOAD_MORE_OFFLINE_SIZE = 10;

gql`
  query BrowseHighlightedChannels($gameId: ID, $skipUserFields: Boolean = false) {
    highlightedChannels(limit: 3, gameId: $gameId) {
      channels {
        id
        ...LiveChannelPreviewChannel
      }
    }
  }

  query BrowseLiveChannels(
    $cursor: String
    $pageSize: Int
    $gameId: ID
    $skipUserFields: Boolean = false
  ) {
    channels(
      liveStatus: LIVE_STATUS_LIVE
      cursor: { first: $pageSize, after: $cursor }
      gameId: $gameId
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

  query BrowseOfflineChannels($cursor: String, $pageSize: Int, $gameId: ID) {
    channels(
      liveStatus: LIVE_STATUS_OFFLINE
      cursor: { first: $pageSize, after: $cursor }
      gameId: $gameId
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
`;

export function Channels() {
  const [searchParams] = useSearchParams();
  const selectedGameId =
    getCategoryNameFromSearchParam(searchParams.get(QueryParams.Category)) ?? null;

  useOfflineChannelApolloCacheCleanHack(selectedGameId);

  const { data: highlightedChannelsData } = useBrowseHighlightedChannelsQuery({
    variables: {
      gameId: selectedGameId,
    },
  });
  const highlightedChannels =
    highlightedChannelsData?.highlightedChannels?.channels ?? [];

  const {
    data: liveChannelsData,
    loading: liveChannelsLoading,
    fetchMore: fetchMoreLiveChannels,
  } = useBrowseLiveChannelsQuery({
    variables: {
      pageSize: INITIAL_ONLINE_PAGE_SIZE,
      gameId: selectedGameId,
    },
  });
  const liveChannels = liveChannelsData?.channels?.channels ?? [];
  const hasNextLiveChannelsPage =
    liveChannelsData?.channels?.pageInfo?.hasNextPage ?? false;

  const {
    data: offlineChannelsData,
    loading: offlineChannelsLoading,
    fetchMore: fetchMoreOfflineChannels,
  } = useBrowseOfflineChannelsQuery({
    variables: {
      pageSize: INITIAL_OFFLINE_CHANNELS_PAGE_SIZE,
      gameId: selectedGameId,
    },
  });
  const offlineChannels = offlineChannelsData?.channels?.channels ?? [];
  const hasNextOfflineChannelsPage =
    !!offlineChannelsData?.channels?.pageInfo?.hasNextPage;

  const onLoadMoreLiveChannels = () => {
    if (!hasNextLiveChannelsPage) {
      return;
    }

    const cursor = liveChannelsData?.channels?.pageInfo.endCursor;

    fetchMoreLiveChannels({
      variables: {
        cursor,
        pageSize: LOAD_MORE_ONLINE_SIZE,
      },
    });
  };

  const onLoadMoreOfflineChannels = () => {
    if (!hasNextOfflineChannelsPage) {
      return;
    }

    const cursor = offlineChannelsData?.channels?.pageInfo.endCursor;

    fetchMoreOfflineChannels({
      variables: {
        cursor,
        pageSize: LOAD_MORE_OFFLINE_SIZE,
      },
    });
  };

  const { listRef: highlightListRef, onChannelLinkClick: onHighlightChannelLinkClick } =
    useChannelListClickAnalyticsEvent({
      section: 'highlighted',
      listGameId: selectedGameId ?? undefined,
    });

  const { listRef: liveListRef, onChannelLinkClick: onLiveChannelLinkClick } =
    useChannelListClickAnalyticsEvent({
      section: 'live',
      listGameId: selectedGameId ?? undefined,
    });

  const { listRef: offlineListRef, onChannelLinkClick: onOfflineChannelLinkClick } =
    useChannelListClickAnalyticsEvent({
      section: 'offline',
      listGameId: selectedGameId ?? undefined,
    });

  if (liveChannelsLoading || offlineChannelsLoading) {
    return <Channels.Loading />;
  }

  return (
    <div className={styles.channels}>
      {!!highlightedChannels.length && (
        <section className={styles.channelSection}>
          <h2 className={styles.channelSectionTitle}>
            <span className={styles.channelSectionTitleHighlight}>Play</span> the stream
          </h2>

          <ul
            className={styles.channelList}
            ref={highlightListRef}
          >
            {highlightedChannels.map((channel, index) => (
              <li key={channel.id}>
                <LiveChannelPreview
                  channel={channel}
                  onClick={() => onHighlightChannelLinkClick(channel.id, index)}
                />
              </li>
            ))}
          </ul>
        </section>
      )}

      {!!highlightedChannels.length && !!liveChannels.length && (
        <hr className={styles.divider} />
      )}

      {!!liveChannels.length && (
        <section className={styles.channelSection}>
          <h2 className={styles.channelSectionTitle}>
            <span className={styles.channelSectionTitleHighlight}>Live</span> channels
          </h2>

          <ul
            className={styles.channelList}
            ref={liveListRef}
          >
            {liveChannels.map((channel, index) => (
              <li key={channel.id}>
                <LiveChannelPreview
                  channel={channel}
                  onClick={() => onLiveChannelLinkClick(channel.id, index)}
                />
              </li>
            ))}
          </ul>

          {hasNextLiveChannelsPage && <ShowMoreButton onClick={onLoadMoreLiveChannels} />}
        </section>
      )}

      {!!liveChannels.length && !!offlineChannels.length && (
        <hr className={classNames(styles.divider, styles.offlineDivider)} />
      )}

      {!!offlineChannels.length && (
        <section className={styles.channelSection}>
          <h2 className={styles.channelSectionTitle}>Offline channels</h2>

          <ul
            className={classNames(styles.channelList, styles.offlineChannelsList)}
            ref={offlineListRef}
          >
            {offlineChannels.map((channel, index) => (
              <li key={channel.id}>
                <OfflineChannelLink
                  channel={channel}
                  onClick={() => onOfflineChannelLinkClick(channel.id, index)}
                />
              </li>
            ))}
          </ul>

          {hasNextOfflineChannelsPage && (
            <ShowMoreButton onClick={onLoadMoreOfflineChannels} />
          )}
        </section>
      )}
    </div>
  );
}

Channels.Loading = () => {
  return (
    <LoadingSkeleton
      className={classNames(styles.channelList, styles.loadingSkeleton)}
      count={8}
    />
  );
};
