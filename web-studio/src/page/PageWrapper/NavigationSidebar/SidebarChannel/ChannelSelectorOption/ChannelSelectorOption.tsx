import { gql } from '@apollo/client';
import classNames from 'classnames';

import styles from './ChannelSelectorOption.module.css';

import { ChannelLiveStatus, ChannelSelectorOptionChannelFragment } from '@gen';

interface Props {
  isSelected: boolean;
  channel: ChannelSelectorOptionChannelFragment;
  onClick(channelId: string): void;
  onMouseDown(): void;
  onMouseEnter(): void;
}

export function ChannelSelectorOption({
  isSelected,
  channel,
  onClick,
  onMouseDown,
  onMouseEnter,
}: Props) {
  const { id, liveStatus, name } = channel;

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
    <li
      aria-selected={isSelected}
      className={styles.option}
      role="option"
      onClick={() => onClick(id)}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
    >
      <span
        className={classNames(styles.liveDot, {
          [styles.live]: liveStatus === ChannelLiveStatus.LiveStatusLive,
        })}
      />
      <span>{name}</span>
    </li>
  );
}

ChannelSelectorOption.fragments = {
  entry: gql`
    fragment ChannelSelectorOptionChannel on ChannelChannel {
      id
      liveStatus
      name
    }
  `,
};
