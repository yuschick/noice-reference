import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import { CoreAssets } from '@noice-com/assets-core';
import {
  Button,
  Icon,
  IconButton,
  Tooltip,
  useAnalytics,
  useAuthentication,
} from '@noice-com/common-ui';
import classNames from 'classnames';

import { SidebarChannel } from './SidebarChannel/SidebarChannel';
import styles from './SidebarChannels.module.css';

import {
  useSidebarFollowedChannelsQuery,
  useSidebarRecommendedChannelsQuery,
} from '@gen';

gql`
  query SidebarFollowedChannels($userId: ID!, $cursor: String, $pageSize: Int = 5) {
    followedChannels(userId: $userId, cursor: { first: $pageSize, after: $cursor })
      @connection(key: "sidebar") {
      pageInfo {
        endCursor
        hasNextPage
      }
      channels {
        id
        ...SidebarChannel
      }
    }
  }

  query SidebarRecommendedChannels {
    channels(liveStatus: LIVE_STATUS_LIVE, cursor: { first: 5 })
      @connection(key: "sidebar") {
      channels {
        id
        ...SidebarChannel
      }
    }
  }
`;

interface Props {
  mode?: 'collapsed' | 'expanded';
}

const FOLLOWED_PAGE_SIZE = 5;

export function SidebarChannels({ mode = 'collapsed' }: Props) {
  const { userId } = useAuthentication();

  const { trackEvent } = useAnalytics();

  const {
    data: followedData,
    fetchMore,
    refetch,
  } = useSidebarFollowedChannelsQuery({
    ...variablesOrSkip({ userId }),
  });

  const { data: recommendedChannelsData } = useSidebarRecommendedChannelsQuery();

  const followedChannels = followedData?.followedChannels?.channels;
  const hasNextFollowedChannelsPage =
    followedData?.followedChannels?.pageInfo?.hasNextPage;
  const recommendedChannels = recommendedChannelsData?.channels?.channels;

  const doNotRender = !followedChannels?.length && !recommendedChannels?.length;

  const onClick = (section: string, channelId: string, index: number) => {
    trackEvent({
      clientSidebarChannelClick: {
        section,
        channelId,
        listIndex: index,
        sidebarMode: mode,
      },
    });
  };

  const onShowMoreClick = () => {
    if (!hasNextFollowedChannelsPage) {
      return;
    }

    const cursor = followedData?.followedChannels?.pageInfo.endCursor;

    fetchMore({
      variables: {
        cursor,
        pageSize: FOLLOWED_PAGE_SIZE,
      },
    });
  };

  const onShowLessClick = () => {
    if (!followedChannels?.length) {
      return;
    }

    const lastPageLength = followedChannels?.length % FOLLOWED_PAGE_SIZE;

    if (lastPageLength) {
      refetch({
        pageSize: followedChannels.length - lastPageLength,
      });

      return;
    }

    refetch({
      pageSize: Math.max(
        followedChannels.length - FOLLOWED_PAGE_SIZE,
        FOLLOWED_PAGE_SIZE,
      ),
    });
  };

  if (doNotRender) {
    return null;
  }

  return (
    <>
      {!!followedChannels?.length && (
        <section className={classNames(styles.wrapper, styles[mode])}>
          {mode === 'collapsed' && (
            <Tooltip
              content="Followed channels"
              placement="right"
            >
              <button className={styles.titleIconWrapper}>
                <Icon
                  color="text-light-secondary"
                  icon={CoreAssets.Icons.Heart}
                  size={16}
                />
              </button>
            </Tooltip>
          )}
          {mode === 'expanded' && <span className={styles.title}>Followed channels</span>}

          <ul
            aria-label="Followed channels"
            className={styles.list}
          >
            {followedChannels.map((channel, index) => (
              <li
                className={styles.listItem}
                key={channel.id}
              >
                <SidebarChannel
                  channel={channel}
                  mode={mode}
                  onClick={() => onClick('following', channel.id, index)}
                />
              </li>
            ))}
          </ul>

          {(hasNextFollowedChannelsPage ||
            followedChannels.length > FOLLOWED_PAGE_SIZE) && (
            <>
              {mode === 'expanded' ? (
                <div className={styles.expandedShowButtons}>
                  {hasNextFollowedChannelsPage && (
                    <Button
                      fit="content"
                      level="secondary"
                      size="xs"
                      onClick={onShowMoreClick}
                    >
                      Show more
                    </Button>
                  )}

                  {followedChannels.length > FOLLOWED_PAGE_SIZE && (
                    <Button
                      fit="content"
                      level="secondary"
                      size="xs"
                      onClick={onShowLessClick}
                    >
                      Show less
                    </Button>
                  )}
                </div>
              ) : (
                <div className={styles.collapsedShowButtons}>
                  {followedChannels.length > FOLLOWED_PAGE_SIZE && (
                    <IconButton
                      icon={CoreAssets.Icons.ChevronUp}
                      label="Show less"
                      level="secondary"
                      size="xs"
                      onClick={onShowLessClick}
                    />
                  )}

                  {hasNextFollowedChannelsPage && (
                    <IconButton
                      icon={CoreAssets.Icons.ChevronDown}
                      label="Show more"
                      level="secondary"
                      size="xs"
                      onClick={onShowMoreClick}
                    />
                  )}
                </div>
              )}
            </>
          )}
        </section>
      )}

      {!!recommendedChannels?.length && (
        <section className={classNames(styles.wrapper, styles[mode])}>
          {mode === 'collapsed' && (
            <Tooltip
              content="Recommended channels"
              placement="right"
            >
              <button className={styles.titleIconWrapper}>
                <Icon
                  color="text-light-secondary"
                  icon={CoreAssets.Icons.Star}
                  size={16}
                />
              </button>
            </Tooltip>
          )}
          {mode === 'expanded' && (
            <span className={styles.title}>Recommended channels</span>
          )}

          <ul
            aria-label="Recommended channels"
            className={styles.list}
          >
            {recommendedChannels.map((channel, index) => (
              <li
                className={styles.listItem}
                key={channel.id}
              >
                <SidebarChannel
                  channel={channel}
                  mode={mode}
                  onClick={() => onClick('recommended', channel.id, index)}
                />
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
