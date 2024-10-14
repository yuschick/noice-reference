import { ApolloQueryResult, gql } from '@apollo/client';
import { useAuthenticatedUser, WithChildren } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import { createContext, useCallback, useContext, useMemo } from 'react';

import {
  ChannelChannel,
  PrivilegedChannelListQuery,
  useChannelListQuery,
  usePrivilegedChannelListQuery,
} from '@gen';

gql`
  query ChannelList($cursor: String, $pageSize: Int) {
    channels(cursor: { first: $pageSize, after: $cursor }) {
      pageInfo {
        endCursor
        hasNextPage
      }
      channels {
        currentStreamId
        id
        liveStatus
        name
      }
    }
  }
`;

gql`
  query PrivilegedChannelList($userId: ID!) {
    userPrivilegedChannels(userId: $userId) {
      channels {
        channelId
        channel {
          currentStreamId
          id
          liveStatus
          name
        }
      }
    }
  }
`;

export type ChannelListChannel = Pick<
  ChannelChannel,
  'id' | 'name' | 'currentStreamId' | 'liveStatus'
>;

interface AvailableChannelsContextType {
  paginatedChannels: Nullable<ChannelListChannel[]>;
  loading: boolean;
  hasNextPage: boolean;
  fetchMoreChannels(): void;
  hasAccessToChannel(channelId: string): boolean;
  refetchChannels(): Promise<ApolloQueryResult<PrivilegedChannelListQuery>>;
}

const AvailableChannelsContext =
  createContext<Nullable<AvailableChannelsContextType>>(null);

export function AvailableChannelsProvider({ children }: WithChildren) {
  const { hasRole, userId } = useAuthenticatedUser();
  const isNoiceStaff = hasRole('admin') || hasRole('px_agent');

  // All the channels are loaded, if signed in as Admin
  const { data, loading, fetchMore } = useChannelListQuery({
    variables: { pageSize: 20 },
    skip: !isNoiceStaff,
  });

  // Only privileged channels are fetched, when signed in as Streamer or Moderator
  const {
    data: dataStreamer,
    loading: loadingStreamer,
    refetch,
  } = usePrivilegedChannelListQuery({
    variables: { userId },
    skip: isNoiceStaff,
  });

  const channels = useMemo(() => {
    if (data?.channels) {
      return data.channels.channels;
    }

    if (dataStreamer?.userPrivilegedChannels?.channels?.length) {
      return dataStreamer?.userPrivilegedChannels?.channels?.map(
        ({ channel }) => channel,
      );
    }

    return null;
  }, [data?.channels, dataStreamer?.userPrivilegedChannels?.channels]);

  const fetchMoreChannels = useCallback(() => {
    fetchMore({
      variables: { pageSize: 20, cursor: data?.channels?.pageInfo.endCursor },
    });
  }, [data?.channels?.pageInfo.endCursor, fetchMore]);

  const hasAccessToChannel = useCallback(
    (channelId: string) => {
      if (hasRole('admin')) {
        return true;
      }

      return channels?.map((channel) => channel.id).includes(channelId) || false;
    },
    [channels, hasRole],
  );

  if (loading) {
    return null;
  }

  return (
    <AvailableChannelsContext.Provider
      value={{
        paginatedChannels: channels,
        fetchMoreChannels,
        hasNextPage: !!data?.channels?.pageInfo.hasNextPage,
        loading: loading || loadingStreamer,
        hasAccessToChannel,
        refetchChannels: refetch,
      }}
    >
      {children}
    </AvailableChannelsContext.Provider>
  );
}

export const useAvailableChannelsContext = (): AvailableChannelsContextType => {
  const context = useContext(AvailableChannelsContext);

  if (!context) {
    throw new Error(
      'Trying to access available channels state from context without AvailableChannelsContext',
    );
  }

  return context;
};
