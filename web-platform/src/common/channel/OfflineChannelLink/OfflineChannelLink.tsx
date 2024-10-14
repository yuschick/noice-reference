import { gql } from '@apollo/client';
import {
  ChannelLogo,
  CommonUtils,
  Icon,
  Image,
  LoadingSkeleton,
  NoiceLogo,
  Pill,
} from '@noice-com/common-ui';
import { MathUtils } from '@noice-com/utils';
import classNames from 'classnames';
import { FaHeart } from 'react-icons/fa';
import { Link, To } from 'react-router-dom';

import styles from './OfflineChannelLink.module.css';

import { AppSoundKeys, usePlaySound } from '@common/sound';
import { OfflineChannelLinkChannelFragment } from '@gen';

export interface Props {
  channel: OfflineChannelLinkChannelFragment;
  showAs?: 'default' | 'offline';
  to?: To;
  onClick?(): void;
}

export function OfflineChannelLink({ channel, showAs = 'default', to, onClick }: Props) {
  const { name, following, followerCount, offlineBanner } = channel;

  const channelPageUrl = to ?? `/${name.toLowerCase()}`;
  const shortFollowerCount = MathUtils.transformNumberToShortString(followerCount);
  const [playGenericHoverSound] = usePlaySound(AppSoundKeys.GenericHover);

  const onMouseEnter = () => {
    playGenericHoverSound();
  };

  return (
    <Link
      aria-label={`Visit ${name}'s profile`}
      className={classNames(styles.offlineChannelCard, {
        [styles.showAsOffline]: showAs === 'offline',
      })}
      to={channelPageUrl}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
    >
      <div className={styles.headerWrapper}>
        {following && (
          <div className={styles.followingWrapper}>
            <Icon
              aria-label={`You are following ${name}'s channel`}
              icon={FaHeart}
            />
          </div>
        )}

        {offlineBanner ? (
          <Image
            aria-hidden="true"
            className={styles.channelOfflineBanner}
            fit="cover"
            role="presentation"
            sizes={`
              (max-width: ${CommonUtils.getRem(610)}) 90vw,
              (max-width: ${CommonUtils.getRem(1033)}) ${CommonUtils.getRem(400)},
              (max-width: ${CommonUtils.getRem(1330)}) ${CommonUtils.getRem(350)},
              (max-width: ${CommonUtils.getRem(1615)}) ${CommonUtils.getRem(325)},
              ${CommonUtils.getRem(300)}`}
            src={offlineBanner}
          />
        ) : (
          <div className={styles.channelBannerFallbackWrapper}>
            <NoiceLogo
              className={styles.channelBannerFallback}
              theme="spectrum"
              variant="mark"
            />
          </div>
        )}

        {showAs === 'offline' && (
          <div className={styles.offlineWrapper}>
            <Pill
              color="gray-950"
              label="Offline"
            />
          </div>
        )}
      </div>

      <div className={styles.channelCardDetails}>
        <ChannelLogo
          channel={channel}
          size="lg"
        />

        <div className={styles.channelDetailsWrapper}>
          <span
            className={styles.channelName}
            translate="no"
          >
            {name}
          </span>
          <div className={styles.channelFollowers}>
            <span className={styles.channelFollowersCount}>{shortFollowerCount}</span>{' '}
            {followerCount === 1 ? 'follower' : 'followers'}
          </div>
        </div>
      </div>
    </Link>
  );
}

OfflineChannelLink.Loading = () => (
  <LoadingSkeleton className={styles.channelOfflineLoading} />
);

OfflineChannelLink.fragments = {
  entry: gql`
    fragment OfflineChannelLinkChannel on ChannelChannel {
      id
      name
      viewerCount
      offlineBanner
      following
      followerCount
      ...ChannelLogoChannel
    }
  `,
};
