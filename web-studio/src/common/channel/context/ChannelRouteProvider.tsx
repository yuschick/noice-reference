import { gql } from '@apollo/client';
import { WithChildren } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import { createContext, useCallback, useContext } from 'react';
import { matchPath } from 'react-router';

import { useChannelContext } from './ChannelProvider';

import { useChannelRouteDataQuery } from '@gen';

gql`
  query ChannelRouteData($channelId: ID!) {
    channel(id: $channelId) {
      id
      name
    }
  }
`;

interface ChannelRouteContextType {
  matchChannelPath(pattern: string, pathname: string): ReturnType<typeof matchPath>;
  transformPathToChannelPath(path: string): string;
}

const ChannelRouteContext = createContext<Nullable<ChannelRouteContextType>>(null);

export function ChannelRouteProvider({ children }: WithChildren) {
  const { channelId } = useChannelContext();

  const { data } = useChannelRouteDataQuery({
    variables: {
      channelId,
    },
  });

  const transformPathToChannelPath = useCallback(
    (path: string) => {
      if (!data?.channel) {
        return '/';
      }

      return `/${data.channel?.name.toLowerCase()}${path}`;
    },
    [data?.channel],
  );

  const matchChannelPath = useCallback(
    (pattern: string, pathname: string) => {
      return matchPath(transformPathToChannelPath(pattern), pathname);
    },
    [transformPathToChannelPath],
  );

  if (!data?.channel) {
    return null;
  }

  return (
    <ChannelRouteContext.Provider
      value={{
        transformPathToChannelPath,
        matchChannelPath,
      }}
    >
      {children}
    </ChannelRouteContext.Provider>
  );
}

export function MockChannelRouteProvider({ children }: WithChildren) {
  const transformPathToChannelPath = (path: string) => {
    return `/channel${path}`;
  };

  const matchChannelPath = (pattern: string, pathname: string) => {
    return matchPath(transformPathToChannelPath(pattern), pathname);
  };

  return (
    <ChannelRouteContext.Provider
      value={{
        transformPathToChannelPath,
        matchChannelPath,
      }}
    >
      {children}
    </ChannelRouteContext.Provider>
  );
}

export const useChannelRouteContext = (): ChannelRouteContextType => {
  const context = useContext(ChannelRouteContext);

  if (!context) {
    throw new Error(
      'Trying to access channel route from context without ChannelRouteContext',
    );
  }

  return context;
};
