import { gql } from '@apollo/client';
import { CoreAssets } from '@noice-com/assets-core';
import {
  ChannelLogo,
  CommonUtils,
  Pill,
  useAnalytics,
  useMediaQuery,
} from '@noice-com/common-ui';
import { GiftSubscriptionToCommunityButton } from '@noice-com/social';
import classNames from 'classnames';
import { MouseEvent, useEffect } from 'react';

import styles from './ChannelSectionSm.module.css';
import { ChannelSectionSmTags } from './ChannelSectionSmTags';

import { ChannelActionButtons, LiveBadge } from '@common/channel';
import {
  ChannelLiveStatus,
  useChannelSectionSmChannelQuery,
  useChannelSectionViewerCountLazyQuery,
} from '@gen';

gql`
  query ChannelSectionSmChannel($channelId: ID!, $skipAuthFields: Boolean = false) {
    channel(id: $channelId) {
      id
      name
      liveStatus
      ...ChannelLogoChannel
      ...ChannelActionButtonsChannel
      ...ChannelSectionSmTagsChannel
    }
  }
  query ChannelSectionViewerCount($channelId: ID!) {
    channel(id: $channelId) {
      id
      viewerCount
    }
  }
`;

interface Props {
  channelId: string;
  isShown: boolean;
  videoPlayerElement: HTMLVideoElement;
  onChannelPageButtonClick(): void;
  onButtonClick(): void;
}

const getChannelOverlayStylesByVideoPlayer = (
  videoPlayerElement: HTMLVideoElement,
  isLandscape: boolean,
): React.CSSProperties => {
  return {
    insetBlockStart: isLandscape
      ? undefined
      : CommonUtils.getRem(videoPlayerElement.offsetHeight),
    insetBlockEnd: isLandscape ? 0 : undefined,
  };
};

export function ChannelSectionSm({
  channelId,
  onChannelPageButtonClick,
  isShown,
  videoPlayerElement,
  onButtonClick: onButtonClickProp,
}: Props) {
  const { trackButtonClickEventOnMouseClick, trackEvent } = useAnalytics();
  const { data } = useChannelSectionSmChannelQuery({
    variables: { channelId },
  });
  const [fetchViewerCountData, { data: viewerCountData }] =
    useChannelSectionViewerCountLazyQuery({
      variables: { channelId },
      fetchPolicy: 'cache-and-network',
    });
  const isLandscape = useMediaQuery('(orientation: landscape)');

  useEffect(() => {
    if (isShown) {
      trackEvent({
        clientChannelOverlayShown: {
          channelId,
        },
      });
      fetchViewerCountData();
    }
  }, [channelId, fetchViewerCountData, isShown, trackEvent]);

  const onButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
    trackButtonClickEventOnMouseClick(event, 'channel-overlay-mobile');
    onButtonClickProp();
  };

  const channel = data?.channel;
  const viewerCount = viewerCountData?.channel?.viewerCount;

  if (!channel || channel.liveStatus !== ChannelLiveStatus.LiveStatusLive) {
    return null;
  }

  const style = getChannelOverlayStylesByVideoPlayer(videoPlayerElement, isLandscape);

  return (
    <section
      className={classNames(styles.section, {
        [styles.shown]: isShown,
      })}
      style={style}
    >
      <div className={styles.overlay}>
        <LiveBadge />
        {viewerCount !== undefined && (
          <Pill
            color="gray-950"
            iconEnd={CoreAssets.Icons.User}
            label={`${viewerCount}`}
          />
        )}
      </div>
      <div className={styles.channelInfoWrapper}>
        <button
          aria-label="Go to channel page"
          className={styles.channelButton}
          title={channel.name}
          onClick={(event) => {
            onChannelPageButtonClick();
            onButtonClick(event);
          }}
        >
          <div>
            <ChannelLogo channel={channel} />
          </div>
          <div>
            <div className={styles.channelName}>{channel.name}</div>
            <div className={styles.tags}>
              <ChannelSectionSmTags channel={channel} />
            </div>
          </div>
        </button>

        <GiftSubscriptionToCommunityButton
          channelId={channelId}
          level="secondary"
          size="sm"
        />
      </div>

      <ChannelActionButtons
        buttonSize="sm"
        channel={channel}
        skipPopovers
        onButtonClick={onButtonClick}
      />
    </section>
  );
}
