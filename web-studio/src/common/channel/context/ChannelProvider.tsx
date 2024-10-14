import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import { useAuthenticatedUser, WithChildren } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router';

import { useAvailableChannelsContext } from './AvailableChannelsProvider';

import { useListenStudioLocalStorageValue } from '@common/local-storage';
// @todo move roles to own entity, so less change for circular dependency
import { ChannelRole } from '@common/profile/types';
import { Routes } from '@common/route';
import {
  AuthTermsVersion,
  ChannelChannelRole,
  ChannelMonetizationSettings,
  useChannelCurrentChatIdLazyQuery,
  useChannelProviderChannelsByNameLazyQuery,
  useChannelProviderCheckChannelLazyQuery,
  useChannelProviderDataQuery,
} from '@gen';

gql`
  query ChannelProviderData($channelId: ID!, $userId: ID!) {
    channel(id: $channelId) {
      id
      currentChatId
      monetizationSettings {
        enabled
        eligible
      }
    }

    userChannelRoles(channelId: $channelId, userId: $userId) {
      roles
    }

    profile(userId: $userId) {
      account {
        acceptedTerms {
          name
        }
      }
      userId
    }
  }

  query ChannelCurrentChatId($channelId: ID!) {
    channel(id: $channelId) {
      id
      currentChatId
    }
  }
`;

gql`
  query ChannelProviderChannelsByName($channelName: String!) {
    channelByName(name: $channelName) {
      id
    }
  }
`;

gql`
  query ChannelProviderCheckChannel($channelId: ID!) {
    channel(id: $channelId) {
      id
      name
      streamerId
    }
  }
`;

const getUserChannelRoles = (
  hasRole: (value: string) => boolean,
  roles: ChannelChannelRole[],
) => {
  const userRoles: ChannelRole[] = [];

  if (hasRole('admin')) {
    userRoles.push(ChannelRole.Admin);
  }

  if (roles.includes(ChannelChannelRole.ChannelRoleStreamer)) {
    userRoles.push(ChannelRole.Streamer);
  }

  if (roles.includes(ChannelChannelRole.ChannelRoleModerator)) {
    userRoles.push(ChannelRole.Moderator);
  }

  if (hasRole('px_agent')) {
    userRoles.push(ChannelRole.PxAgent);
  }

  return userRoles;
};

interface ChannelContextType {
  channelId: string;
  streamerId: Nullable<string>;
  recentChannelIds: string[];
  channelChatId: Nullable<string>;
  userChannelRoles: ChannelRole[];
  loadingUserChannelRoles: boolean;
  clearRecentChannels: () => void;
  reloadChannelChat: () => void;
  setChannelId: (id: string) => void;
  monetizationSettings: Nullable<
    Pick<ChannelMonetizationSettings, 'eligible' | 'enabled'>
  >;
  channelOwnerAcceptedTerms: Nullable<Pick<AuthTermsVersion, 'name'>[]>;
}

const ChannelContext = createContext<Nullable<ChannelContextType>>(null);

const RECENT_CHANNEL_MAX_AMOUNT = 3;

export function ChannelProvider({ children }: WithChildren) {
  const { channelName } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { hasAccessToChannel, paginatedChannels, loading } =
    useAvailableChannelsContext();
  const [channelId, setChannelIdState] = useState<Nullable<string>>(null);
  const [streamerId, setStreamerId] = useState<Nullable<string>>(null);
  const [recentChannelIds, setRecentChannelIds] = useListenStudioLocalStorageValue(
    'channel.recentlyVisited',
  );

  const initialized = useRef(false);

  const { userId, hasRole } = useAuthenticatedUser();

  const { data, loading: loadingUserChannelRoles } = useChannelProviderDataQuery({
    ...variablesOrSkip({ channelId, userId }),
  });

  const [fetchChannelChatId] = useChannelCurrentChatIdLazyQuery({
    fetchPolicy: 'cache-and-network',
  });

  const reloadChannelChat = useCallback(() => {
    if (!channelId) {
      return;
    }

    fetchChannelChatId({ variables: { channelId } });
  }, [channelId, fetchChannelChatId]);

  const [fetchChannelByName] = useChannelProviderChannelsByNameLazyQuery({
    onCompleted(data) {
      const id = data.channelByName?.id ?? null;

      if (!id) {
        // If channel does not exist, go to first allowed channel
        if (paginatedChannels?.length) {
          navigate(`/${paginatedChannels[0].name}`, { replace: true });
          return;
        }

        // If no channel to redirect, user has no access
        navigate(Routes.NoAccess, { replace: true });
        return;
      }

      if (hasAccessToChannel(id)) {
        setChannelIdState(id);
        initialized.current = true;
        return;
      }

      // Return to home page if nothing else works
      navigate('/', { replace: true });
    },
  });

  const [changeChannel] = useChannelProviderCheckChannelLazyQuery({
    onCompleted(data) {
      if (!data.channel) {
        return;
      }

      const { id, name, streamerId } = data.channel;

      navigate(`/${name}`);
      setChannelIdState(id);
      setStreamerId(streamerId);

      setRecentChannelIds(
        [id, ...(recentChannelIds ?? []).filter((channelId) => channelId !== id)].slice(
          0,
          RECENT_CHANNEL_MAX_AMOUNT,
        ),
      );
    },
  });

  useEffect(() => {
    if (loading || initialized.current) {
      return;
    }

    setChannelIdState((prev) => {
      // If there is channel name, do nothing here, just fetch the channel data
      if (channelName) {
        // If there is channel name, check if it is in the partial channel list
        const channel = paginatedChannels?.find(
          (channel) => channel.name === channelName,
        );

        if (channel) {
          initialized.current = true;
          return channel.id;
        }

        // If not, fetch channel by name and check in there it there is access
        fetchChannelByName({ variables: { channelName } });
        return prev;
      }

      // If there is channel where is access, do nothing
      if (prev && hasAccessToChannel(prev)) {
        initialized.current = true;
        return prev;
      }

      // If there is access to recent channel, set that as channel
      if (recentChannelIds?.length && hasAccessToChannel(recentChannelIds[0])) {
        initialized.current = true;
        return recentChannelIds[0];
      }

      // Return to home page if nothing else works
      navigate('/', { replace: true });
      return null;
    });
  }, [
    channelName,
    paginatedChannels,
    fetchChannelByName,
    hasAccessToChannel,
    loading,
    navigate,
    recentChannelIds,
  ]);

  const clearRecentChannels = () => {
    setRecentChannelIds([]);
  };

  const setChannelId = (channelId: string) => {
    // If trying to change to channel that has no access, go home
    if (!hasAccessToChannel(channelId)) {
      navigate('/', { replace: true });
      return;
    }

    changeChannel({ variables: { channelId } });
  };

  // If channels or channel roles are loading or initialized is not done, return nothing
  if (loading || !initialized.current || loadingUserChannelRoles) {
    return null;
  }

  // If there is no channel id after initializing, user does not have access
  if (!channelId) {
    return (
      <Navigate
        state={{ prevPath: location.pathname }}
        to={Routes.NoAccess}
        replace
      />
    );
  }

  return (
    <ChannelContext.Provider
      value={{
        channelId,
        streamerId,
        clearRecentChannels,
        channelChatId: data?.channel?.currentChatId ?? null,
        recentChannelIds: recentChannelIds ?? [],
        reloadChannelChat,
        setChannelId,
        userChannelRoles: getUserChannelRoles(
          hasRole,
          data?.userChannelRoles?.roles ?? [],
        ),
        loadingUserChannelRoles,
        monetizationSettings: data?.channel?.monetizationSettings ?? null,
        channelOwnerAcceptedTerms: data?.profile?.account?.acceptedTerms ?? null,
      }}
    >
      {children}
    </ChannelContext.Provider>
  );
}

interface MockProps {
  channelId?: string;
  chatId?: string;
  streamerId?: string;
}

export function MockChannelProvider({
  children,
  channelId,
  chatId,
  streamerId,
}: WithChildren<MockProps>) {
  return (
    <ChannelContext.Provider
      value={{
        channelId: channelId ?? 'channel-id',
        streamerId: streamerId ?? 'streamer-id',
        recentChannelIds: [],
        channelChatId: chatId ?? 'chat-id',
        loadingUserChannelRoles: false,
        userChannelRoles: [],
        clearRecentChannels: () => {},
        reloadChannelChat: () => {},
        setChannelId: () => {},
        monetizationSettings: null,
        channelOwnerAcceptedTerms: null,
      }}
    >
      {children}
    </ChannelContext.Provider>
  );
}

export const useChannelContext = (): ChannelContextType => {
  const context = useContext(ChannelContext);

  if (!context) {
    throw new Error('Trying to access channel state from context without ChannelContext');
  }

  return context;
};
