import { gql } from '@apollo/client';

import styles from './ChannelStorePremiumBundlePrefix.module.css';

import { ChannelStorePremiumBundlePrefixChannelFragment } from '@gen';

gql`
  fragment ChannelStorePremiumBundlePrefixChannel on ChannelChannel {
    name
  }
`;

interface Props {
  channel: ChannelStorePremiumBundlePrefixChannelFragment;
}

export function ChannelStorePremiumBundlePrefix({ channel }: Props) {
  const { name } = channel;

  return (
    <div className={styles.premiumBundlePrefix}>
      <div className={styles.premiumBundlePrefixContent}>
        <div className={styles.premiumBundlePrefixTitle}>
          <span>Chance of</span>
          <span className={styles.bold}>creator cards</span>
        </div>
        <div>
          Premium card bundles have a chance to contain{' '}
          <span className={styles.bold}>{name}</span> creator cards.
        </div>
      </div>
    </div>
  );
}
