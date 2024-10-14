import { gql } from '@apollo/client';
import { CoreAssets } from '@noice-com/assets-core';
import {
  ButtonLink,
  ChannelLogo,
  CommonUtils,
  IconButton,
  PopoverMenu,
  ReportChannelDialog,
  ReportStreamDialog,
  useAnalytics,
  useAuthentication,
  useMediaQuery,
  usePopoverMenu,
} from '@noice-com/common-ui';
import { MathUtils } from '@noice-com/utils';
import classNames from 'classnames';
import { useCallback, MouseEvent, useState } from 'react';

import styles from './ChannelPageInfoSection.module.css';
import { ChannelPageLinks } from './ChannelPageLinks';
import { useTruncatedDescription } from './hooks';

import { ChannelActionButtons } from '@common/channel';
import { ChannelLiveStatus, ChannelPageInfoSectionChannelFragment } from '@gen';

gql`
  fragment ChannelPageInfoSectionChannel on ChannelChannel {
    id
    name
    followerCount
    liveStatus
    streamerId
    currentStreamId
    description

    ...ChannelLogoChannel
    ...ChannelActionButtonsChannel
    ...ChannelPageLinksChannel
  }
`;

interface Props {
  channel: ChannelPageInfoSectionChannelFragment;
  isOwnChannel: boolean;
  isModerator: boolean;
}

export function ChannelPageInfoSection({ channel, isModerator, isOwnChannel }: Props) {
  const {
    currentStreamId,
    description,
    followerCount,
    id,
    liveStatus,
    name,
    streamerId,
  } = channel;
  const isStreamLive = liveStatus === ChannelLiveStatus.LiveStatusLive;
  const shortFollowerCount = MathUtils.transformNumberToShortString(followerCount);

  const [showStreamReportModal, setShowStreamReportModal] = useState(false);
  const [showChannelReportModal, setShowChannelReportModal] = useState(false);

  const { userId, isFullAccount } = useAuthentication();
  const useLargeLogo = useMediaQuery(`(min-width: ${CommonUtils.getRem(600)})`);
  const useMediumButtons = useMediaQuery(`(min-width: ${CommonUtils.getRem(1200)})`);
  const popover = usePopoverMenu({ placement: 'bottom-end' });
  const { trackButtonClickEventOnMouseClick } = useAnalytics();
  const { isShowingMore, isTruncated, descriptionRef, showMore, showLess } =
    useTruncatedDescription();

  const onButtonClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      trackButtonClickEventOnMouseClick(event, 'channel-page-top-buttons');
    },
    [trackButtonClickEventOnMouseClick],
  );

  return (
    <section className={styles.channelInfoSection}>
      <div className={styles.channelInfoTop}>
        <div className={styles.channelInfoWrapper}>
          <ChannelLogo
            channel={channel}
            size={useLargeLogo ? 'lg' : 'md'}
          />

          <div className={styles.channelInfoTextWrapper}>
            <h1 className={styles.channelName}>{name}</h1>

            <span>
              <span className={styles.followerCount}>{shortFollowerCount}</span> followers
            </span>
          </div>
        </div>

        {isFullAccount && (
          <>
            {userId !== streamerId && (
              <div className={styles.reportButton}>
                <IconButton
                  icon={CoreAssets.Icons.Menu}
                  label="Open menu"
                  level="secondary"
                  ref={popover.state.popoverMenuTriggerRef}
                  size={useMediumButtons ? 'md' : 'sm'}
                  onClick={(event) => {
                    popover.actions.toggle();
                    onButtonClick(event);
                  }}
                />
                <PopoverMenu store={popover}>
                  <PopoverMenu.Section>
                    {isStreamLive ? (
                      <PopoverMenu.Button onClick={() => setShowStreamReportModal(true)}>
                        Report Stream
                      </PopoverMenu.Button>
                    ) : (
                      <PopoverMenu.Button onClick={() => setShowChannelReportModal(true)}>
                        Report Channel
                      </PopoverMenu.Button>
                    )}
                  </PopoverMenu.Section>
                </PopoverMenu>
              </div>
            )}

            {showStreamReportModal && (
              <ReportStreamDialog
                channelId={id}
                reportedUserId={streamerId}
                streamId={currentStreamId}
                onDismiss={() => setShowStreamReportModal(false)}
              />
            )}

            {showChannelReportModal && (
              <ReportChannelDialog
                channelId={id}
                onDismiss={() => setShowChannelReportModal(false)}
              />
            )}
          </>
        )}

        <div className={styles.actions}>
          <ChannelActionButtons
            buttonSize={useMediumButtons ? 'md' : 'sm'}
            channel={channel}
            onButtonClick={onButtonClick}
          />
        </div>

        {(isModerator || isOwnChannel) && (
          <div className={styles.studioButton}>
            {isOwnChannel ? (
              <ButtonLink
                level="secondary"
                size={useMediumButtons ? 'md' : 'sm'}
                to={`${NOICE.STUDIO_URL}/${name.toLowerCase()}`}
              >
                Go to studio
              </ButtonLink>
            ) : (
              <ButtonLink
                level="secondary"
                size={useMediumButtons ? 'md' : 'sm'}
                to={`${NOICE.STUDIO_URL}/${name.toLowerCase()}`}
              >
                Moderate in Studio
              </ButtonLink>
            )}
          </div>
        )}
      </div>

      <div className={styles.channelDetails}>
        <div className={styles.channelDescriptionWrapper}>
          <div
            className={classNames(styles.channelDescription, {
              [styles.truncated]: !isShowingMore,
            })}
            ref={descriptionRef}
          >
            {description}
          </div>

          {isTruncated && !isShowingMore && (
            <button
              className={styles.showFullDescriptionButton}
              onClick={(event) => {
                trackButtonClickEventOnMouseClick(event, 'channel-page-info-buttons');
                showMore();
              }}
            >
              Show more
            </button>
          )}

          {isShowingMore && (
            <button
              className={styles.showFullDescriptionButton}
              onClick={(event) => {
                trackButtonClickEventOnMouseClick(event, 'channel-page-info-buttons');
                showLess();
              }}
            >
              Show less
            </button>
          )}
        </div>

        <ChannelPageLinks channel={channel} />
      </div>
    </section>
  );
}
