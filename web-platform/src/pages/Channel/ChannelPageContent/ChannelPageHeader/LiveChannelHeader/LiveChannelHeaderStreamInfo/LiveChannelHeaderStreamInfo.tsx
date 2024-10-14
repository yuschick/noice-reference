import { gql } from '@apollo/client';
import { CoreAssets } from '@noice-com/assets-core';
import { ChannelLogo, Pill } from '@noice-com/common-ui';
import { MathUtils } from '@noice-com/utils';

import styles from './LiveChannelHeaderStreamInfo.module.css';

import { ChannelTags, LiveBadge } from '@common/channel';
import { LiveChannelHeaderStreamInfoChannelFragment } from '@gen';

gql`
  fragment LiveChannelHeaderStreamInfoChannel on ChannelChannel {
    title
    viewerCount
    game {
      id
      name
    }
    ...ChannelLogoChannel
    ...ChannelTagsChannel
  }
`;

interface Props {
  channel: LiveChannelHeaderStreamInfoChannelFragment;
}

export function LiveChannelHeaderStreamInfo({ channel }: Props) {
  const { title, viewerCount, game } = channel;

  return (
    <div className={styles.streamInfo}>
      <div className={styles.logoWrapper}>
        <ChannelLogo
          channel={channel}
          size="lg"
        />
      </div>

      <div className={styles.streamTitle}>{title}</div>

      <div className={styles.pills}>
        <LiveBadge />

        <Pill
          color="blue-950"
          iconEnd={CoreAssets.Icons.User}
          label={MathUtils.transformNumberToShortString(viewerCount)}
          title="Viewers"
        />

        <Pill
          color="blue-950"
          label={game.name}
        />

        <ChannelTags
          channel={channel}
          pillColor="blue-950"
        />
      </div>
    </div>
  );
}
