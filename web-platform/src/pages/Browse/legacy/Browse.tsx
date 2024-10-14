import styles from './Browse.module.css';
import { BrowseChannelsGameSelector } from './BrowseChannelsGameSelector';
import { Channels } from './Channels';

import { ChannelListPagesNavigation } from '@common/navigation';

export function Browse() {
  return (
    <section className={styles.browseWrapper}>
      <ChannelListPagesNavigation />

      <div>
        <h1 className={styles.browseHeading}>Browse channels</h1>
      </div>

      <BrowseChannelsGameSelector />

      <Channels />
    </section>
  );
}
