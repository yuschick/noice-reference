import { CoreAssets } from '@noice-com/assets-core';
import { ChannelLogo, Pill } from '@noice-com/common-ui';
import classNames from 'classnames';
import { useRef } from 'react';
import { Link } from 'react-router-dom';

import styles from './SidebarChannel.module.css';

import { LiveBadge } from '@common/channel';
import { AppSoundKeys, usePlaySound } from '@common/sound';
import { ChannelLiveStatus, SidebarChannelFragment } from '@gen';

interface Props {
  channel: SidebarChannelFragment;
  onClick(): void;
}

export const SidebarChannelExpanded = ({ channel, onClick }: Props) => {
  const anchorRef = useRef<HTMLAnchorElement>(null);
  const [handleMouseEnterWithSound] = usePlaySound(AppSoundKeys.GenericHover);
  const [handleClickWithSound] = usePlaySound(AppSoundKeys.ButtonClickConfirm);

  return (
    <Link
      aria-label={`${channel.name} ${
        channel.liveStatus === ChannelLiveStatus.LiveStatusLive
          ? 'is playing ' + channel.game.name
          : 'is offline'
      }`}
      className={classNames(styles.followedChannelLink, styles.expanded, {
        [styles.channelIsOnline]: channel.liveStatus === ChannelLiveStatus.LiveStatusLive,
      })}
      ref={anchorRef}
      to={`/${channel.name.toLowerCase()}`}
      onClick={() => {
        onClick();
        handleClickWithSound();
      }}
      onMouseEnter={() => handleMouseEnterWithSound()}
    >
      <ChannelLogo
        channel={channel}
        showLiveStatus
      />

      <div className={styles.channelDetailsWrapper}>
        <div>
          <span className={styles.channelName}>{channel.name}</span>
          <span className={styles.channelStatus}>
            {channel.liveStatus === ChannelLiveStatus.LiveStatusLive
              ? channel.game.name
              : 'Offline'}
          </span>
        </div>

        {channel.liveStatus === ChannelLiveStatus.LiveStatusLive && (
          <>
            <LiveBadge />
            <Pill
              color="gray-950"
              iconEnd={CoreAssets.Icons.User}
              label={`${channel.viewerCount}`}
            />
          </>
        )}
      </div>
    </Link>
  );
};
