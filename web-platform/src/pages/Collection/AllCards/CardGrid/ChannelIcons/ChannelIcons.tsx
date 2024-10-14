import { ChannelLogo } from '@noice-com/common-ui';
import { CSSProperties } from 'react';

import styles from './ChannelIcons.module.css';

import { UnlockedCardGameCardFragment } from '@gen';

const MAX_SHOWN_CHANNELS = 3;

interface Props {
  channels: UnlockedCardGameCardFragment['activeStreamerCards'][number]['channel'][];
}

export function ChannelIcons({ channels }: Props) {
  const shownChannels =
    channels.length <= MAX_SHOWN_CHANNELS
      ? channels
      : channels.slice(0, MAX_SHOWN_CHANNELS - 1);
  const moreChannelsAmount = channels.length - shownChannels.length;

  return (
    <div
      className={styles.channelIcons}
      data-ftue-anchor="collection-card-view-streamer-icon"
    >
      {shownChannels.map((channel, index) => (
        <div
          className={styles.channelLogoBorder}
          key={`${channel.id}_${index}`}
          style={{ transform: `translateX(-${8 * index}px)` } as CSSProperties}
        >
          <ChannelLogo
            channel={channel}
            size="xs"
          />
        </div>
      ))}
      {moreChannelsAmount > 0 && (
        <div
          className={styles.channelLogoBorder}
          style={
            {
              transform: `translateX(-${8 * (MAX_SHOWN_CHANNELS - 1)}px)`,
            } as CSSProperties
          }
        >
          <div className={styles.moreChannels}>+{moreChannelsAmount}</div>
        </div>
      )}
    </div>
  );
}
