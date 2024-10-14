import { gql } from '@apollo/client';
import { Helmet } from 'react-helmet-async';

import { BrowseTabNavigation } from '../BrowseTabNavigation';

import styles from './BrowseChannels.module.css';
import { BrowseChannelsEmpty } from './BrowseChannelsEmpty/BrowseChannelsEmpty';

import { ChannelListPageChannels } from '@common/channels';
import { ChannelListPagesNavigation } from '@common/navigation';
import {
  useBrowseChannelsHighlightedChannelsQuery,
  useBrowseChannelsLiveChannelsQuery,
} from '@gen';

gql`
  query BrowseChannelsHighlightedChannels($skipUserFields: Boolean = false) {
    highlightedChannels(limit: 3) {
      channels {
        id
        ...LiveChannelPreviewChannel
      }
    }
  }

  query BrowseChannelsLiveChannels($cursor: String, $skipUserFields: Boolean = false) {
    channels(liveStatus: LIVE_STATUS_LIVE, cursor: { first: 16, after: $cursor }) {
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
`;

export function BrowseChannels() {
  const { data: highlightedChannelsData } = useBrowseChannelsHighlightedChannelsQuery();
  const highlightedChannels =
    highlightedChannelsData?.highlightedChannels?.channels ?? [];

  const {
    data: liveChannelsData,
    loading: liveChannelsLoading,
    fetchMore: fetchMoreLiveChannels,
  } = useBrowseChannelsLiveChannelsQuery();

  const liveChannels = liveChannelsData?.channels?.channels ?? [];
  const hasNextLiveChannelsPage =
    liveChannelsData?.channels?.pageInfo?.hasNextPage ?? false;

  const noContent = !highlightedChannels.length && !liveChannels.length;

  const onLoadMoreLiveChannels = async () => {
    if (!hasNextLiveChannelsPage) {
      return;
    }

    const cursor = liveChannelsData?.channels?.pageInfo.endCursor;

    await fetchMoreLiveChannels({
      variables: {
        cursor,
      },
    });
  };

  return (
    <>
      <Helmet>
        <title>Browse live channels</title>
      </Helmet>

      <section className={styles.pageContent}>
        <ChannelListPagesNavigation />

        <h1 className={styles.pageTitle}>Browse</h1>

        <BrowseTabNavigation />

        {noContent &&
          (liveChannelsLoading ? (
            <ChannelListPageChannels.Loading
              title="channels"
              titlePrefix="Live"
            />
          ) : (
            <BrowseChannelsEmpty />
          ))}

        {!!highlightedChannels.length && (
          <ChannelListPageChannels
            analyticsSection="highlighted"
            channels={highlightedChannels}
            title="the stream"
            titlePrefix="Play"
          />
        )}

        {!!liveChannels.length && (
          <ChannelListPageChannels
            analyticsSection="live"
            channels={liveChannels}
            hasNextPage={hasNextLiveChannelsPage}
            title="channels"
            titlePrefix="Live"
            onLoadMore={onLoadMoreLiveChannels}
          />
        )}
      </section>
    </>
  );
}
