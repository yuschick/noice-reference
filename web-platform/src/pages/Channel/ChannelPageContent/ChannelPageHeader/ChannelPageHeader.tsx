import { gql } from '@apollo/client';
import { CoreAssets } from '@noice-com/assets-core';
import {
  AuthenticatedUserProvider,
  Image,
  LoadingSkeleton,
  useAuthentication,
} from '@noice-com/common-ui';

import { OfflineChannelIndicator } from '../OfflineChannelIndicator';

import styles from './ChannelPageHeader.module.css';
import { LiveChannelHeader } from './LiveChannelHeader/LiveChannelHeader';

import {
  ChannelLiveStatus,
  ChannelPageHeaderChannelFragment,
  ChannelPageHeaderLiveChannelFragment,
  ChannelPageHeaderOfflineChannelFragment,
  useChannelPageChannelHeaderQuery,
} from '@gen';

gql`
  query ChannelPageChannelHeader($channelId: ID!, $isLive: Boolean!) {
    channel(id: $channelId) {
      id
      ...ChannelPageHeaderLiveChannel @include(if: $isLive)
      ...ChannelPageHeaderOfflineChannel @skip(if: $isLive)
    }
  }

  fragment ChannelPageHeaderOfflineChannel on ChannelChannel {
    id
    offlineBanner
    name
    streamerId
    ...OfflineChannelIndicatorChannel
  }

  fragment ChannelPageHeaderLiveChannel on ChannelChannel {
    id
    ...LiveChannelHeaderChannel
  }

  fragment ChannelPageHeaderChannel on ChannelChannel {
    id
    liveStatus
  }
`;

interface Props {
  channel: ChannelPageHeaderChannelFragment;
}

export function ChannelPageHeader({ channel }: Props) {
  const { userId } = useAuthentication();

  // show as offline for non authenticated users
  const liveChannel = !!userId && channel.liveStatus === ChannelLiveStatus.LiveStatusLive;

  const { data, loading } = useChannelPageChannelHeaderQuery({
    variables: {
      channelId: channel.id,
      isLive: liveChannel,
    },
    fetchPolicy: 'cache-and-network',
  });

  if (loading || !data) {
    return null;
  }

  if (liveChannel) {
    return (
      <AuthenticatedUserProvider userId={userId}>
        <LiveChannelHeader
          channel={data.channel as ChannelPageHeaderLiveChannelFragment}
        />
      </AuthenticatedUserProvider>
    );
  }

  const headerChannel = data.channel as ChannelPageHeaderOfflineChannelFragment;
  const { offlineBanner, name, streamerId } = headerChannel;
  const isChannelOwner = streamerId === userId;

  return (
    <div className={styles.container}>
      <div className={styles.offlineBannerWrapper}>
        <Image
          alt={`Channel banner - ${name} is currently offline.`}
          className={styles.offlineBanner}
          fit="cover"
          sizes="80vw"
          src={offlineBanner ? offlineBanner : CoreAssets.Images.BannerPlaceholder}
        />
      </div>
      {!isChannelOwner && !!userId && (
        <AuthenticatedUserProvider userId={userId}>
          <OfflineChannelIndicator channel={headerChannel} />
        </AuthenticatedUserProvider>
      )}
    </div>
  );
}

ChannelPageHeader.Loading = () => <LoadingSkeleton className={styles.offlineBanner} />;
