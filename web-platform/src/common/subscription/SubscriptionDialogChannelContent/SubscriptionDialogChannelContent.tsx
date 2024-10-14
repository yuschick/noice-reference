import { gql } from '@apollo/client';
import { ChannelLogo } from '@noice-com/common-ui';
import { MathUtils } from '@noice-com/utils';

import styles from './SubscriptionDialogChannelContent.module.css';

import { SubscriptionDialogChannelContentChannelFragment } from '@gen';

interface Props {
  channel: SubscriptionDialogChannelContentChannelFragment;
}

export function SubscriptionDialogChannelContent({ channel }: Props) {
  const { name, followerCount } = channel;

  return (
    <section className={styles.channelInfoSection}>
      <ChannelLogo
        channel={channel}
        size="lg"
      />

      <div className={styles.channelDetails}>
        <span className={styles.channelName}>{name}</span>
        <div className={styles.channelFollowers}>
          <span className={styles.channelFollowerCount}>
            {MathUtils.transformNumberToShortString(followerCount)}
          </span>{' '}
          followers
        </div>
      </div>
    </section>
  );
}

SubscriptionDialogChannelContent.fragments = {
  entry: gql`
    fragment SubscriptionDialogChannelContentChannel on ChannelChannel {
      name
      logo
      followerCount
      ...ChannelLogoChannel
    }
  `,
};
