import { Nullable } from '@noice-com/utils';

import styles from '../TopBar.module.css';

import { TopBarChannelFragment } from '@gen';

interface Props {
  channel: Nullable<TopBarChannelFragment>;
}

export function StatSubscribers({ channel }: Props) {
  return (
    <>
      <span className={styles.streamStatLabel}>Subscribers</span>
      <span className={styles.streamStatValue}>{channel?.subscriberCount || 0}</span>
    </>
  );
}
