import { gql } from '@apollo/client';
import {
  useRestartingSubscription,
  variablesOrSkip,
} from '@noice-com/apollo-client-utils';
import { CoreAssets } from '@noice-com/assets-core';
import {
  useAnalytics,
  ChannelLogo,
  IconButton,
  useTimeDuration,
  ButtonLink,
} from '@noice-com/common-ui';
import { GiftSubscriptionToCommunityButton } from '@noice-com/social';
import { DeepPartial, MathUtils, Nullable } from '@noice-com/utils';
import { ButtonHTMLAttributes, MouseEvent, useCallback, useEffect } from 'react';
import { generatePath } from 'react-router';

import styles from './ChannelSection.module.css';

import { ChannelActionButtons, ChannelTags } from '@common/channel';
import { useListenAppLocalStorageValue } from '@common/localstorage';
import { Routes, getChannelStoreLink } from '@common/route';
import {
  ChannelChannel,
  ChannelSectionChannelFragment,
  ChannelSectionChannelViewerCountDocument,
  ChannelSectionChannelViewerCountSubscription,
  ChannelSectionChannelViewerCountSubscriptionVariables,
} from '@gen';

gql`
  subscription ChannelSectionChannelViewerCount($channelId: ID!) {
    channelViewerCountSubscribe(channelId: $channelId) {
      viewerCount
    }
  }

  fragment ChannelSectionChannel on ChannelChannel {
    viewerCount
    followerCount
    name
    logo
    title
    game {
      id
      name
    }
    activeStream {
      streamId
      startTime
    }
    monetizationSettings {
      enabled
    }

    ...ChannelLogoChannel
    ...ChannelActionButtonsChannel
    ...ChannelTagsChannel
  }
`;

interface Props {
  channel: Nullable<ChannelSectionChannelFragment>;
  expandButtonAttributes: Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    'children' | 'color'
  >;
  onChannelPageButtonClick(): void;
}

export function ChannelSection({
  channel,
  expandButtonAttributes,
  onChannelPageButtonClick,
}: Props) {
  const [isChannelCollapsed, setIsChannelCollapsed] = useListenAppLocalStorageValue(
    'sidebar.channel-details.collapsed',
  );

  const { trackButtonClickEventOnMouseClick } = useAnalytics();

  const { days, hours, minutes, seconds, reset, stop, isRunning } = useTimeDuration({
    autoStart: false,
  });

  useEffect(() => {
    if (!channel?.activeStream?.startTime) {
      stop();
      return;
    }

    reset(new Date(channel?.activeStream?.startTime).getTime(), true);
  }, [channel?.activeStream?.startTime, reset, stop]);

  useRestartingSubscription<
    ChannelSectionChannelViewerCountSubscription,
    ChannelSectionChannelViewerCountSubscriptionVariables
  >(ChannelSectionChannelViewerCountDocument, {
    ...variablesOrSkip({ channelId: channel?.id }),
    onData({ data, client }) {
      if (!channel?.id) {
        return;
      }

      client.cache.updateFragment<DeepPartial<ChannelChannel>>(
        {
          id: client.cache.identify({ id: channel.id, __typename: 'ChannelChannel' }),
          fragment: gql`
            fragment ChannelViewCountUpdate on ChannelChannel {
              id
              viewerCount
            }
          `,
        },
        (existing) => ({
          ...existing,
          viewerCount: data.data?.channelViewerCountSubscribe?.viewerCount,
        }),
      );
    },
  });

  const onButtonClick = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      trackButtonClickEventOnMouseClick(event, 'game-sidebar-top');
    },
    [trackButtonClickEventOnMouseClick],
  );

  const handleToggleChannelClick = useCallback(() => {
    setIsChannelCollapsed(!isChannelCollapsed);
  }, [isChannelCollapsed, setIsChannelCollapsed]);

  if (!channel) {
    return null;
  }

  const { viewerCount, name, followerCount, title, game, monetizationSettings } = channel;
  const isMonetizationEnabled = monetizationSettings?.enabled;
  const { name: gameName } = game;

  return (
    <section className={styles.section}>
      <div className={styles.top}>
        <div className={styles.topChannelWrapper}>
          <ChannelLogo channel={channel} />

          <ButtonLink
            fit="content"
            level="secondary"
            size="xs"
            to={
              isMonetizationEnabled
                ? getChannelStoreLink({ channel })
                : generatePath(Routes.Channel, {
                    channelName: channel.name.toLowerCase(),
                  })
            }
            onClick={(event) => {
              onChannelPageButtonClick();
              onButtonClick(event);
            }}
          >
            {isMonetizationEnabled ? 'Visit Store' : 'Visit Channel'}
          </ButtonLink>
          <div>
            <GiftSubscriptionToCommunityButton
              channelId={channel.id}
              level="secondary"
              size="xs"
              title="Gift"
            />
          </div>
        </div>

        <div className={styles.toggleButtonWrapper}>
          <IconButton
            {...expandButtonAttributes}
            icon={CoreAssets.Icons.CollapseRight}
            label="Collapse game sidebar"
            size="sm"
            variant="ghost"
            onClick={(event) => {
              expandButtonAttributes.onClick?.(event);
              onButtonClick(event);
            }}
          />
        </div>
      </div>

      <div className={styles.middle}>
        <div className={styles.channelDetails}>
          <div className={styles.channelName}>{name}</div>

          <div className={styles.channelDetailsRow}>
            {isChannelCollapsed ? (
              <>
                <span className={styles.channelViewers}>
                  <span className={styles.channelNumberValue}>
                    {MathUtils.transformNumberToShortString(viewerCount)}
                  </span>{' '}
                  viewers
                </span>

                {isRunning && (
                  <>
                    <div className={styles.dividerDot} />

                    <span className={styles.streamTime}>
                      {days ? days + 'd ' : ''}
                      {hours}:{minutes < 10 ? '0' : ''}
                      {minutes}:{seconds < 10 ? '0' : ''}
                      {seconds}
                    </span>
                  </>
                )}
              </>
            ) : (
              <span>
                <span className={styles.channelNumberValue}>
                  {MathUtils.transformNumberToShortString(followerCount)}
                </span>{' '}
                followers
              </span>
            )}
          </div>
        </div>

        <IconButton
          icon={
            isChannelCollapsed ? CoreAssets.Icons.ChevronDown : CoreAssets.Icons.ChevronUp
          }
          label={
            isChannelCollapsed ? 'Expand channel section' : 'Collapse channel section'
          }
          size="xs"
          variant="ghost"
          onClick={handleToggleChannelClick}
        />
      </div>

      {!isChannelCollapsed && (
        <div className={styles.bottom}>
          <span className={styles.channelTitle}>
            {title.trim() || `${name} playing ${gameName}`}
          </span>

          <div className={styles.channelDetailsRow}>
            <span className={styles.gameName}>{gameName}</span>

            <div className={styles.dividerDot} />

            <span className={styles.channelViewers}>
              <span className={styles.channelNumberValue}>
                {MathUtils.transformNumberToShortString(viewerCount)}
              </span>{' '}
              viewers
            </span>

            {isRunning && (
              <>
                <div className={styles.dividerDot} />

                <span className={styles.streamTime}>
                  {days ? days + 'd ' : ''}
                  {hours}:{minutes < 10 ? '0' : ''}
                  {minutes}:{seconds < 10 ? '0' : ''}
                  {seconds}
                </span>
              </>
            )}
          </div>

          <div className={styles.tags}>
            <ChannelTags
              channel={channel}
              pillColor="gray-750"
            />
          </div>

          <hr className={styles.bottomDivider} />

          <ChannelActionButtons
            buttonSize="xs"
            channel={channel}
            onButtonClick={onButtonClick}
          />
        </div>
      )}
    </section>
  );
}
