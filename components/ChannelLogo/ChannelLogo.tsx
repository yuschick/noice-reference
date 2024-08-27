import { gql } from '@apollo/client';
import classNames from 'classnames';
import { ImgHTMLAttributes, useEffect, useState } from 'react';

import { Image } from '../Image';
import { LoadingSkeleton } from '../LoadingSkeleton';

import styles from './ChannelLogo.module.css';

import { ChannelLiveStatus, ChannelLogoChannelFragment } from '@common-gen';

export const channelLogoSizes = ['xs', 'sm', 'md', 'lg'] as const;

function getImageWidth(size: (typeof channelLogoSizes)[number]) {
  if (size === 'xs') {
    return '24px';
  }

  if (size === 'sm') {
    return '32px';
  }

  if (size === 'md') {
    return '40px';
  }

  if (size === 'lg') {
    return '56px';
  }
}

interface Props
  extends Omit<
    ImgHTMLAttributes<HTMLOrSVGElement>,
    'alt' | 'className' | 'onError' | 'onLoad' | 'src' | 'style'
  > {
  channel: ChannelLogoChannelFragment;
  showLiveStatus?: boolean;
  size?: (typeof channelLogoSizes)[number];
}

function getLiveStatusLabel(liveStatus: ChannelLiveStatus) {
  switch (liveStatus) {
    case ChannelLiveStatus.LiveStatusLive:
      return 'Live';
    default:
      return 'Offline';
  }
}

export function ChannelLogo({
  channel,
  showLiveStatus,
  size = 'md',
  ...htmlAttributes
}: Props) {
  const [showChannelInitials, setShowChannelInitials] = useState(false);
  const showAsOffline =
    showLiveStatus && channel.liveStatus !== ChannelLiveStatus.LiveStatusLive;
  const showAsOnline =
    showLiveStatus && channel.liveStatus === ChannelLiveStatus.LiveStatusLive;

  useEffect(() => {
    if (channel.logo) {
      setShowChannelInitials(false);
    }
  }, [channel.logo]);

  return (
    <div
      className={classNames(styles.channelLogoWrapper, styles[size], {
        [styles.showAsOffline]: showAsOffline,
        [styles.showAsOnline]: showAsOnline,
      })}
    >
      {showChannelInitials ? (
        <span
          aria-label={`${channel.name}${
            showLiveStatus ? ` (${getLiveStatusLabel(channel.liveStatus)})` : ''
          }`}
          className={styles.channelInitials}
          translate="no"
        >
          {channel.name[0]}
          {channel.name[1]}
        </span>
      ) : (
        <Image
          {...htmlAttributes}
          alt={`${channel.name}${
            showLiveStatus ? ` (${getLiveStatusLabel(channel.liveStatus)})` : ''
          }`}
          className={styles.channelLogoImage}
          fit="cover"
          src={channel.logo}
          width={getImageWidth(size)}
          onError={() => {
            setShowChannelInitials(true);
          }}
        />
      )}
    </div>
  );
}

ChannelLogo.Loading = ({ size = 'md' }: Pick<Props, 'size'>) => (
  <div className={classNames(styles.channelLogoWrapper, styles[size])}>
    <LoadingSkeleton className={styles.channelLoadingSkeleton} />
  </div>
);

ChannelLogo.fragments = {
  entry: gql`
    fragment ChannelLogoChannel on ChannelChannel {
      liveStatus
      logo
      name
    }
  `,
};
