import { gql } from '@apollo/client';
import { useAuthenticatedUser } from '@noice-com/common-ui';
import { useMemo } from 'react';

import { useRecentlyVisitedChannelIds } from './useRecentlyVisitedChannelIds.hook';

import { useUseLocalPlayerChannelIdsQuery } from '@gen';

gql`
  query UseLocalPlayerChannelIds($userId: ID) {
    followedChannels(userId: $userId) {
      channels {
        id
      }
    }
  }
`;

export function useLocalPlayerChannelIds(): { channelIds: string[]; loading: boolean } {
  const { userId } = useAuthenticatedUser();
  const [recentlyVisitedChannelIds] = useRecentlyVisitedChannelIds();
  const { data, loading } = useUseLocalPlayerChannelIdsQuery({
    variables: {
      userId,
    },
  });

  const channelIds = useMemo(() => {
    const followedChannelIds =
      data?.followedChannels?.channels.map((channel) => channel.id) ?? [];

    return [...(followedChannelIds ?? []), ...(recentlyVisitedChannelIds ?? [])].reduce(
      (prev: string[], curr) => (prev.includes(curr) ? prev : prev.concat(curr)),
      [],
    );
  }, [data?.followedChannels?.channels, recentlyVisitedChannelIds]);

  return { channelIds, loading };
}
