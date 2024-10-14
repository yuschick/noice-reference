import { ChannelLogo, Tooltip, VisuallyHidden } from '@noice-com/common-ui';
import classNames from 'classnames';
import { useRef } from 'react';
import { Link } from 'react-router-dom';

import styles from './SidebarChannel.module.css';

import { AppSoundKeys, usePlaySound } from '@common/sound';
import { ChannelLiveStatus, SidebarChannelFragment } from '@gen';

interface Props {
  channel: SidebarChannelFragment;
  disabledTooltip?: boolean;
  onClick(): void;
}

export const SidebarChannelCollapsed = ({ channel, disabledTooltip, onClick }: Props) => {
  const anchorRef = useRef<HTMLAnchorElement>(null);
  const [handleMouseEnterWithSound] = usePlaySound(AppSoundKeys.GenericHover);
  const [handleClickWithSound] = usePlaySound(AppSoundKeys.ButtonClickConfirm);

  return (
    <Tooltip
      content={
        <div className={styles.tooltipContentWrapper}>
          <div>
            <span className={styles.channelName}>{channel.name}</span>
            <span className={styles.channelStatus}>
              {channel.liveStatus === ChannelLiveStatus.LiveStatusLive
                ? channel.game.name
                : 'Offline'}
            </span>
          </div>

          {channel.liveStatus === ChannelLiveStatus.LiveStatusLive && (
            <div className={styles.tooltipViewerCount}>
              {channel.viewerCount}
              <VisuallyHidden>viewers</VisuallyHidden>
            </div>
          )}
        </div>
      }
      forceState={disabledTooltip ? 'hide' : undefined}
      placement="right"
      renderIn="portals"
    >
      <Link
        aria-label={`${channel.name} ${
          channel.liveStatus === ChannelLiveStatus.LiveStatusLive
            ? 'is playing' + channel.game.name
            : 'is offline'
        }`}
        className={classNames(styles.followedChannelLink, styles.collapsed, {
          [styles.channelIsOnline]:
            channel.liveStatus === ChannelLiveStatus.LiveStatusLive,
        })}
        ref={anchorRef}
        to={`/${channel.name.toLowerCase()}`}
        onClick={() => {
          onClick();
          handleClickWithSound();
        }}
        onMouseEnter={() => handleMouseEnterWithSound()}
      >
        <div className={styles.channelLogoWrapper}>
          <ChannelLogo
            channel={channel}
            showLiveStatus
          />
        </div>
      </Link>
    </Tooltip>
  );
};
