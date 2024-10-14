import { gql } from '@apollo/client';
import { useBooleanFeatureFlag } from '@noice-com/common-ui';

import { HomePageChannelList } from '../../HomePageChannelList';

import { useOfflineChannelApolloCacheCleanHack } from '@common/channels';
import { Routes } from '@common/route';
import { useHomeBackupOfflineChannelsQuery } from '@gen';

gql`
  query HomeBackupOfflineChannels {
    channels(liveStatus: LIVE_STATUS_OFFLINE, cursor: { first: 12 })
      @connection(key: "homepage") {
      channels {
        id
        ...HomePageChannelListOfflineChannel
      }
    }
  }
`;

export function BackupOfflineChannels() {
  const { data, loading } = useHomeBackupOfflineChannelsQuery();
  const [useNewBrowseLink] = useBooleanFeatureFlag('categoriesListing');

  useOfflineChannelApolloCacheCleanHack(null);

  if (loading) {
    return (
      <HomePageChannelList.Loading
        seeAllPath={useNewBrowseLink ? undefined : Routes.Browse}
        status="offline"
        title="Offline channels"
      />
    );
  }

  return (
    <HomePageChannelList
      analyticsSection="offline"
      channels={data?.channels?.channels ?? []}
      seeAllPath={useNewBrowseLink ? undefined : Routes.Browse}
      status="offline"
      title="Offline channels"
    />
  );
}
