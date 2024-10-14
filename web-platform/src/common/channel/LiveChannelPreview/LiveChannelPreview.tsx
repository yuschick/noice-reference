import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import { CoreAssets } from '@noice-com/assets-core';
import {
  Pill,
  Icon,
  LoadingSkeleton,
  Image,
  CommonUtils,
  useAuthentication,
} from '@noice-com/common-ui';
import { ActiveFriendsList, UserBadge } from '@noice-com/social';
import { sortBadges } from '@noice-com/social-react-core';
// We need to import this directly because of @livepeer related importing issue with jest
// eslint-disable-next-line no-restricted-imports
import classNames from 'classnames';
import { Link } from 'react-router-dom';

import { ChannelLogoLink } from '../ChannelLogoLink';
import { ChannelTags } from '../ChannelTags';
import { useChannelAutoJoinLinkProps } from '../hooks';
import { LiveBadge } from '../LiveBadge';
import { getChannelTitle } from '../utils';

import styles from './LiveChannelPreview.module.css';

import { AppSoundKeys, usePlaySound } from '@common/sound';
import {
  BadgeBadgeType,
  LiveChannelPreviewChannelFragment,
  useLiveChannelProfileQuery,
} from '@gen';

gql`
  query LiveChannelProfile($userId: ID!, $channelId: ID!) {
    profile(userId: $userId) {
      userId
      badges(channel_id: $channelId) {
        level
        type
      }
    }
  }

  fragment LiveChannelPreviewChannel on ChannelChannel {
    id
    name
    title
    following
    matureRatedContent
    game {
      id
      name
      activeSeason @skip(if: $skipUserFields) {
        id
        seasonBreak
        seasonBreakReason
      }
    }
    viewerCount
    thumbnail
    channelFriends @skip(if: $skipUserFields) {
      totalCount
      users {
        userId
        profile {
          userId
          ...ActiveFriendsListProfile
        }
      }
    }
    activeStream @skip(if: $skipUserFields) {
      streamId
      noicePredictionsEnabled
    }
    ...ChannelLogoChannel
    ...ChannelTagsChannel
    ...ChannelAutoJoinLinkPropsChannel
  }
`;

export interface Props {
  channel: LiveChannelPreviewChannelFragment;
  onClick?(): void;
}

export function LiveChannelPreview({ channel, onClick }: Props) {
  const { userId } = useAuthentication();

  const { data } = useLiveChannelProfileQuery({
    ...variablesOrSkip({ userId, channelId: channel.id }),
  });

  const linkProps = useChannelAutoJoinLinkProps({ channel, onClick });

  const { name, title, game, thumbnail, viewerCount, activeStream } = channel;

  const channelPageUrl = `/${name.toLowerCase()}`;
  const [playStreamLinkHoverSound] = usePlaySound(AppSoundKeys.GenericHover);

  const onMouseEnter = () => {
    playStreamLinkHoverSound();
  };

  const friends = channel.channelFriends?.users.map((user) => user.profile) ?? [];
  const seasonBreak = !!game.activeSeason?.seasonBreak;
  const streamTitle = getChannelTitle({ title, name, game });

  return (
    <div
      className={classNames(styles.liveChannelWrapper, {
        [styles.matureRatedContent]: channel.matureRatedContent,
      })}
    >
      <Link
        aria-label={`Go to ${name}'s ${game.name} stream`}
        className={styles.link}
        title={streamTitle}
        onMouseEnter={onMouseEnter}
        {...linkProps}
      >
        <div className={styles.channelPreviewWrapper}>
          <Image
            alt={`${streamTitle} preview`}
            className={styles.streamPreviewThumbnail}
            loading="eager"
            sizes={`
                (max-width: ${CommonUtils.getRem(750)}) 87vw,
                (max-width: ${CommonUtils.getRem(1250)}) 45vw,
                15vw`}
            src={thumbnail}
            width="100%"
          />

          <div className={styles.previewBadgesWrapper}>
            <LiveBadge />

            {activeStream?.noicePredictionsEnabled && !seasonBreak && (
              <Pill
                color="gradient-green-teal"
                label="Play the stream"
              />
            )}

            <Pill
              color="gray-950"
              iconEnd={CoreAssets.Icons.User}
              label={`${viewerCount}`}
            />
          </div>

          <div className={styles.activeFriendsWrapper}>
            <ActiveFriendsList
              friends={friends}
              totalAmount={friends.length}
            />
          </div>
        </div>
      </Link>

      <div className={styles.channelDetailsWrapper}>
        <ChannelLogoLink
          aria-hidden="true"
          channel={channel}
          className={classNames(styles.link, styles.channelLogo)}
          tabIndex={-1}
        />

        <div className={styles.streamDetaitlsWrapper}>
          <div className={styles.streamTitle}>
            <Link
              aria-hidden="true"
              className={styles.link}
              tabIndex={-1}
              title={streamTitle}
              to={channelPageUrl}
              onMouseEnter={onMouseEnter}
            >
              {streamTitle.trim() || `${channel.name} playing ${game.name}`}
            </Link>
          </div>
          <div className={styles.streamDetails}>
            <div className={styles.streamUserDetails}>
              <Link
                aria-hidden="true"
                className={styles.link}
                tabIndex={-1}
                to={channelPageUrl}
                onMouseEnter={onMouseEnter}
              >
                <span translate="no">{name}</span>
              </Link>
              {channel.following && (
                <Icon
                  color="green-main"
                  icon={CoreAssets.Icons.Heart}
                  size={16}
                />
              )}
              {data?.profile?.badges &&
                sortBadges(
                  data?.profile?.badges?.filter(
                    (badge) => badge.type === BadgeBadgeType.TypeChannelSubscriber,
                  ),
                ).map((badge) => (
                  <UserBadge
                    badge={badge}
                    badgeSize={16}
                    key={badge.type}
                  />
                ))}
            </div>
            <span translate="no">{game.name}</span>
          </div>
        </div>

        <div className={styles.tagsWrapper}>
          <ChannelTags
            channel={channel}
            pillColor="blue-750"
          />
        </div>
      </div>
    </div>
  );
}

LiveChannelPreview.Loading = () => <LoadingSkeleton className={styles.loadingSkeleton} />;
