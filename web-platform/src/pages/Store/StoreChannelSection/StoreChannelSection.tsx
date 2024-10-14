import { gql } from '@apollo/client';

import { StoreChannelList } from './StoreChannelList/StoreChannelList';
import styles from './StoreChannelSection.module.css';

import { StoreSectionHeader } from '@common/store-front-category';
import { StoreChannelSectionChannelFragment } from '@gen';

interface Props {
  channels: StoreChannelSectionChannelFragment[];
  loading: boolean;
}

export function StoreChannelSection({ channels, loading }: Props) {
  if (!channels.length) {
    return null;
  }

  return (
    <section className={styles.section}>
      <StoreSectionHeader
        infoText="Creator cards and bundles available in channel stores"
        title="Discover channel stores"
      />

      {!loading ? <StoreChannelList channels={channels} /> : <StoreChannelList.Loading />}
    </section>
  );
}

StoreChannelSection.fragments = {
  entry: gql`
    fragment StoreChannelSectionChannel on ChannelChannel {
      ...StoreChannelListChannel
    }
  `,
};
