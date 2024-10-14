import { gql } from '@apollo/client';
import { ChannelLogo } from '@noice-com/common-ui';
import { Link } from 'react-router-dom';

import { HighlightedText } from '../HighlightedText';

import styles from './SearchInputChannelLink.module.css';

import { LiveBadge } from '@common/channel';
import { ChannelLiveStatus, SearchInputChannelLinkChannelFragment } from '@gen';

interface Props {
  channel: SearchInputChannelLinkChannelFragment;
  query: string;
  className?: string;
  channelLink: string;
  onClick?: () => void;
}

export function SearchInputChannelLink({
  channel,
  className,
  query,
  channelLink,
  onClick,
}: Props) {
  const { name, liveStatus } = channel;

  return (
    <Link
      className={className}
      tabIndex={-1}
      to={channelLink}
      onClick={onClick}
    >
      <ChannelLogo channel={channel} />

      <div className={styles.channelDetails}>
        <HighlightedText
          query={query}
          text={name}
        />
      </div>
      {liveStatus === ChannelLiveStatus.LiveStatusLive && <LiveBadge />}
    </Link>
  );
}

SearchInputChannelLink.fragments = {
  entry: gql`
    fragment SearchInputChannelLinkChannel on ChannelChannel {
      id
      name
      liveStatus
      ...ChannelLogoChannel
    }
  `,
};
