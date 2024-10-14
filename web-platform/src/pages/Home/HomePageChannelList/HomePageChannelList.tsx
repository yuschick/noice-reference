import { gql } from '@apollo/client';
import { CoreAssets } from '@noice-com/assets-core';
import {
  Button,
  ButtonLink,
  useAnalytics,
  useBooleanFeatureFlag,
  VisuallyHidden,
} from '@noice-com/common-ui';
import classNames from 'classnames';

import styles from './HomePageChannelList.module.css';

import { LiveChannelPreview, OfflineChannelLink } from '@common/channel';
import { useChannelListClickAnalyticsEvent } from '@common/channels';
import {
  HomePageChannelListLiveChannelFragment,
  HomePageChannelListOfflineChannelFragment,
} from '@gen';

gql`
  fragment HomePageChannelListLiveChannel on ChannelChannel {
    ...LiveChannelPreviewChannel
  }

  fragment HomePageChannelListOfflineChannel on ChannelChannel {
    ...OfflineChannelLinkChannel
  }
`;

interface LiveProps {
  status?: 'live';
  channels: HomePageChannelListLiveChannelFragment[];
}

interface OfflineProps {
  status: 'offline';
  channels: HomePageChannelListOfflineChannelFragment[];
}

interface BaseProps {
  status?: 'live' | 'offline';
  analyticsSection: string;
  titlePrefix?: string;
  title: string;
  seeAllPath?: string;
  pagination?: {
    hasNextPage: boolean;
    onLoadMore(): void;
  };
  useSmallScreenHorizontalScroll?: boolean;
}

type Props = (LiveProps | OfflineProps) & BaseProps;

export function HomePageChannelList({
  channels,
  status = 'live',
  analyticsSection,
  titlePrefix,
  title,
  seeAllPath,
  pagination,
  useSmallScreenHorizontalScroll,
}: Props) {
  const { listRef, onChannelLinkClick } = useChannelListClickAnalyticsEvent({
    section: analyticsSection,
  });

  const [tighterHomePage] = useBooleanFeatureFlag('categoriesListing');

  const { trackButtonClickEventOnMouseClick } = useAnalytics();

  return (
    <div
      className={classNames(styles.liveChannelListWrapper, {
        [styles.useSmallScreenHorizontalScroll]: useSmallScreenHorizontalScroll,
        [styles.tighterHomePage]: tighterHomePage,
      })}
    >
      <div className={styles.titleWrapper}>
        <h2 className={styles.title}>
          {!!titlePrefix && (
            <>
              <span className={styles.titlePrefix}>{titlePrefix}</span>{' '}
            </>
          )}
          {title}
        </h2>

        {!!seeAllPath && (
          <ButtonLink
            fit="content"
            level="secondary"
            size="xs"
            to={seeAllPath}
            onClick={(event) => trackButtonClickEventOnMouseClick(event, 'homepage')}
          >
            See all{' '}
            <VisuallyHidden>
              {!!titlePrefix && `${titlePrefix} `}
              {title}
            </VisuallyHidden>
          </ButtonLink>
        )}
      </div>

      <ul
        className={styles.liveChannelsList}
        ref={listRef}
      >
        {channels.map((channel, index) => (
          <li
            className={styles.liveChannelListItem}
            key={channel.id}
          >
            {status === 'live' ? (
              <LiveChannelPreview
                channel={channel as HomePageChannelListLiveChannelFragment}
                onClick={() => onChannelLinkClick(channel.id, index)}
              />
            ) : (
              <OfflineChannelLink
                channel={channel as HomePageChannelListOfflineChannelFragment}
                onClick={() => onChannelLinkClick(channel.id, index)}
              />
            )}
          </li>
        ))}
      </ul>

      {pagination?.hasNextPage && (
        <div className={styles.showMoreWrapper}>
          <Button
            fit="content"
            iconEnd={CoreAssets.Icons.ChevronDown}
            level="secondary"
            size="sm"
            onClick={pagination.onLoadMore}
          >
            Show more
          </Button>
        </div>
      )}
    </div>
  );
}

HomePageChannelList.Loading = ({
  title,
  titlePrefix,
  seeAllPath,
  status = 'live',
}: Pick<BaseProps, 'title' | 'titlePrefix' | 'seeAllPath' | 'status'>) => {
  return (
    <div className={styles.liveChannelListWrapper}>
      <div className={styles.titleWrapper}>
        <h2 className={styles.title}>
          {!!titlePrefix && (
            <>
              <span className={styles.titlePrefix}>{titlePrefix}</span>{' '}
            </>
          )}
          {title}
        </h2>

        {!!seeAllPath && (
          <ButtonLink
            fit="content"
            level="secondary"
            size="xs"
            to={seeAllPath}
          >
            See all{' '}
            <VisuallyHidden>
              {!!titlePrefix && `${titlePrefix} `}
              {title}
            </VisuallyHidden>
          </ButtonLink>
        )}
      </div>

      <ul className={styles.liveChannelsList}>
        {new Array(3).fill(null).map((_, index) => (
          <li
            className={styles.liveChannelListItem}
            key={index}
          >
            {status === 'live' ? (
              <LiveChannelPreview.Loading />
            ) : (
              <OfflineChannelLink.Loading />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
