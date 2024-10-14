import { gql } from '@apollo/client';
import {
  useRestartingSubscription,
  variablesOrSkip,
} from '@noice-com/apollo-client-utils';
import { Nullable } from '@noice-com/utils';

import styles from '../TopBar.module.css';

import { useChannelContext } from '@common/channel';
import {
  ChannelChannel,
  StudioTopBarFollowersDocument,
  StudioTopBarFollowersSubscription,
  StudioTopBarFollowersSubscriptionVariables,
  TopBarChannelFragment,
  TopBarChannelFragmentDoc,
} from '@gen';

gql`
  subscription StudioTopBarFollowers($channelId: ID) {
    channelFollowerCountSubscribe(channelId: $channelId) {
      channelId
      followerCount
    }
  }
`;

interface Props {
  channel: Nullable<TopBarChannelFragment>;
}

export function StatFollowers({ channel }: Props) {
  const { channelId } = useChannelContext();

  useRestartingSubscription<
    StudioTopBarFollowersSubscription,
    StudioTopBarFollowersSubscriptionVariables
  >(StudioTopBarFollowersDocument, {
    ...variablesOrSkip({ channelId }),
    onData: ({ client, data: { data } }) => {
      const id = client.cache.identify({ id: channelId, __typename: 'ChannelChannel' });

      client.cache.updateFragment<ChannelChannel>(
        { id, fragment: TopBarChannelFragmentDoc },
        (existing) => {
          if (!existing) {
            return existing;
          }

          if (!data?.channelFollowerCountSubscribe) {
            return existing;
          }

          return {
            ...existing,
            followerCount: data.channelFollowerCountSubscribe.followerCount,
          };
        },
      );
    },
  });

  return (
    <>
      <span className={styles.streamStatLabel}>Followers</span>
      <span className={styles.streamStatValue}>{channel?.followerCount}</span>
    </>
  );
}
