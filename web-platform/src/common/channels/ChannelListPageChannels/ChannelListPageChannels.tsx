import { gql } from '@apollo/client';
import { LoadingSkeleton } from '@noice-com/common-ui';
import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';

import { useChannelListClickAnalyticsEvent } from '../hooks';

import styles from './ChannelListPageChannels.module.css';

import { LiveChannelPreview, OfflineChannelLink } from '@common/channel';
import {
  ChannelListPageChannelsChannelFragment,
  ChannelListPageChannelsOfflineChannelFragment,
} from '@gen';

gql`
  fragment ChannelListPageChannelsChannel on ChannelChannel {
    ...LiveChannelPreviewChannel
  }

  fragment ChannelListPageChannelsOfflineChannel on ChannelChannel {
    ...OfflineChannelLinkChannel
  }
`;

interface LiveProps {
  status?: 'live';
  channels: ChannelListPageChannelsChannelFragment[];
}

interface OfflineProps {
  status: 'offline';
  channels: ChannelListPageChannelsOfflineChannelFragment[];
}

interface BaseProps {
  status?: 'live' | 'offline';
  analyticsSection: string;
  titlePrefix?: string;
  title: string;
  hasNextPage?: boolean;
  onLoadMore?: () => Promise<void>;
}

type Props = (LiveProps | OfflineProps) & BaseProps;

export function ChannelListPageChannels({
  channels,
  status = 'live',
  analyticsSection,
  titlePrefix,
  title,
  hasNextPage,
  onLoadMore,
}: Props) {
  const { listRef, onChannelLinkClick } = useChannelListClickAnalyticsEvent({
    section: analyticsSection,
  });
  const loadMoreRef = useRef(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    if (!hasNextPage || !onLoadMore) {
      return;
    }

    let isLoading = false;

    const observer = new IntersectionObserver((entries) => {
      // Prevent multiple calls
      if (isLoading) {
        return;
      }

      entries.forEach(async (entry) => {
        if (entry.isIntersecting) {
          isLoading = true;
          setIsLoadingMore(true);

          await onLoadMore();

          setIsLoadingMore(false);
          isLoading = false;
        }
      });
    });

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [hasNextPage, onLoadMore]);

  return (
    <section className={styles.channelSection}>
      <h2 className={styles.channelSectionTitle}>
        {!!titlePrefix && (
          <>
            <span className={styles.channelSectionTitleHighlight}>{titlePrefix}</span>{' '}
          </>
        )}
        {title}
      </h2>

      <ul
        className={styles.channelList}
        ref={listRef}
      >
        {channels.map((channel, index) => (
          <li key={channel.id}>
            {status === 'live' ? (
              <LiveChannelPreview
                channel={channel as ChannelListPageChannelsChannelFragment}
                onClick={() => onChannelLinkClick(channel.id, index)}
              />
            ) : (
              <OfflineChannelLink
                channel={channel as ChannelListPageChannelsOfflineChannelFragment}
                onClick={() => onChannelLinkClick(channel.id, index)}
              />
            )}
          </li>
        ))}

        {isLoadingMore &&
          new Array(4)
            .fill(null)
            .map((_, index) => (
              <li key={index}>
                {status === 'live' ? (
                  <LiveChannelPreview.Loading />
                ) : (
                  <OfflineChannelLink.Loading />
                )}
              </li>
            ))}
      </ul>

      {!!hasNextPage && <div ref={loadMoreRef} />}
    </section>
  );
}

ChannelListPageChannels.Loading = ({
  title,
  titlePrefix,
}: Pick<BaseProps, 'title' | 'titlePrefix' | 'status'>) => {
  return (
    <section className={styles.channelSection}>
      <h2 className={styles.channelSectionTitle}>
        {!!titlePrefix && (
          <>
            <span className={styles.channelSectionTitleHighlight}>{titlePrefix}</span>{' '}
          </>
        )}
        {title}
      </h2>

      <LoadingSkeleton
        className={classNames(styles.channelList, styles.loadingSkeleton)}
        count={8}
      />
    </section>
  );
};
