import { useTopBarChannelSubscriptions } from '../hooks/useTopBarChannelSubscriptions';
import styles from '../TopBar.module.css';

import { useChannelContext } from '@common/channel';

interface Props {
  showViewers: boolean;
}

export function StatViewers({ showViewers }: Props) {
  const { channelId } = useChannelContext();

  const { viewerCount } = useTopBarChannelSubscriptions(channelId);

  return (
    <>
      <span className={styles.streamStatLabel}>Viewers</span>
      <span className={styles.streamStatValue}>
        {showViewers ? viewerCount || 0 : '-'}
      </span>
    </>
  );
}
