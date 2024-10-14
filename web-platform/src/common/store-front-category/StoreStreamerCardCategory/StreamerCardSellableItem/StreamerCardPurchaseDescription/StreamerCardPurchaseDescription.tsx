import { gql } from '@apollo/client';
import { ChannelLogo, WithChildren } from '@noice-com/common-ui';

import styles from './StreamerCardPurchaseDescription.module.css';

import { StreamerCardPurchaseDescriptionChannelFragment } from '@gen';

gql`
  fragment StreamerCardPurchaseDescriptionChannel on ChannelChannel {
    name
    ...ChannelLogoChannel
  }
`;

interface Props {
  channel: StreamerCardPurchaseDescriptionChannelFragment;
}

export function StreamerCardPurchaseDescription({
  children,
  channel,
}: WithChildren<Props>) {
  return (
    <div>
      <div className={styles.channelInfo}>
        {channel && <ChannelLogo channel={channel} />}
        <div className={styles.description}>
          <div className={styles.channelName}>{channel.name}</div>
          <div className={styles.purchasedItemName}>Creator Card</div>
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
}
