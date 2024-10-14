import { gql, useApolloClient } from '@apollo/client';
import { CoreAssets } from '@noice-com/assets-core';
import {
  ChannelLogo,
  CommonUtils,
  IdleState,
  Image,
  Pill,
  useAnalytics,
  useBooleanFeatureFlag,
  useIdleState,
} from '@noice-com/common-ui';
import { StreamPlacement } from '@noice-com/schemas/stream/egress.pb';
import { StreamSettingsProvider } from '@noice-com/stream';
// We need to import this directly because of @livepeer related importing issue with jest
// eslint-disable-next-line no-restricted-imports
import { SimpleStreamPlayer } from '@noice-com/stream/src/components/SimpleStreamPlayer';
import classNames from 'classnames';
import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

import styles from './HighlightedChannel.module.css';

import {
  ChannelTags,
  getChannelTitle,
  LiveBadge,
  useChannelAutoJoinLinkProps,
} from '@common/channel';
import { ChannelLiveStatus, HighlightedChannelFragment } from '@gen';

gql`
  fragment HighlightedChannel on ChannelChannel {
    id
    name
    viewerCount
    thumbnail
    title
    game {
      id
      name
    }
    currentStreamId
    liveStatus
    ...ChannelTagsChannel
    ...ChannelLogoChannel
    ...ChannelAutoJoinLinkPropsChannel
  }
`;

interface Props {
  channel: HighlightedChannelFragment;
}

export function HighlightedChannel({ channel }: Props) {
  const { trackEvent } = useAnalytics();
  const { pathname } = useLocation();
  const {
    id: channelId,
    name,
    viewerCount,
    game,
    thumbnail,
    title,
    currentStreamId,
    liveStatus,
  } = channel;
  const { cache } = useApolloClient();

  const [tighterHomePage] = useBooleanFeatureFlag('categoriesListing');

  const streamTitle = getChannelTitle({ title, name, game });

  const onClick = () => {
    trackEvent({
      clientChannelListClick: {
        section: 'highlighted',
        channelId,
        rowIndex: 0,
        columnIndex: 0,
        pathname,
        listIndex: 0,
      },
    });
  };

  const linkProps = useChannelAutoJoinLinkProps({ channel, onClick });

  useEffect(() => {
    if (liveStatus !== ChannelLiveStatus.LiveStatusLive) {
      // trigger highlighted channel refetch when the home highlighted channel is not anymore live
      cache.evict({ id: 'ROOT_QUERY', fieldName: 'highlightedChannels' });
      cache.gc();
    }
  }, [cache, liveStatus]);

  const idleState = useIdleState();

  return (
    <section
      className={classNames(styles.highlightedChannelSection, {
        [styles.tighterHomePage]: tighterHomePage,
      })}
    >
      {!tighterHomePage && (
        <h2 className={styles.highlightedChannelTitle}>
          <span className={styles.highlightedChannelTitleHighlight}>Play</span> the stream
        </h2>
      )}

      <Link
        aria-label={`Go to ${name}'s ${game.name} stream`}
        className={styles.highlightedChannel}
        {...linkProps}
      >
        <div className={styles.highlightedChannelPreviewWrapper}>
          {currentStreamId && idleState === IdleState.ACTIVE ? (
            <div className={styles.streamContent}>
              <StreamSettingsProvider>
                <SimpleStreamPlayer
                  className={styles.stream}
                  placement={StreamPlacement.STREAM_PLACEMENT_HIGHLIGHT}
                  streamId={currentStreamId}
                  isMutedStream
                />
              </StreamSettingsProvider>

              <Image
                alt={`${streamTitle} preview`}
                className={styles.streamPreviewImage}
                sizes={`
                  (max-width: ${CommonUtils.getRem(1119)}) 87vw,
                  45vw`}
                src={thumbnail}
                width="100%"
              />
            </div>
          ) : (
            <Image
              alt={`${streamTitle} preview`}
              sizes={`
              (max-width: ${CommonUtils.getRem(1119)}) 87vw,
              45vw`}
              src={thumbnail}
              width="100%"
            />
          )}
        </div>

        <div className={styles.highlightedChannelContent}>
          <div className={styles.channelLogo}>
            <ChannelLogo
              channel={channel}
              size="lg"
            />
          </div>

          <span
            className={styles.channelName}
            translate="no"
          >
            {name}
          </span>

          <div className={styles.tags}>
            <LiveBadge />

            <Pill
              color="blue-950"
              iconEnd={CoreAssets.Icons.User}
              label={`${viewerCount}`}
            />

            <Pill
              color="blue-950"
              label={game.name}
            />

            <ChannelTags
              channel={channel}
              pillColor="blue-950"
            />
          </div>
        </div>
      </Link>
    </section>
  );
}
