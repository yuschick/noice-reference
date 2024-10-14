import { Nullable } from '@noice-com/utils';
import { matchPath, matchRoutes, useLocation, useMatch } from 'react-router-dom';

import { ChannelRoutes, Routes } from '../types';
import { channelSubRoutes } from '../utils';

interface HookResult {
  isChannelRoute: boolean;
  isChannelSubRoute: boolean;
  channelPathname: Nullable<string>;
}

const channelRoutes = [
  Routes.Channel,
  ...Object.values(ChannelRoutes).map((r) => `${Routes.Channel}/${r}`),
];

export function useIsChannelRoute(): HookResult {
  const location = useLocation();

  const currentPathPattern = channelRoutes.find((route) =>
    matchPath({ path: route }, location.pathname),
  );

  const matchChannelRoute = useMatch(currentPathPattern || Routes.Channel);

  const isChannelRoute =
    (!!matchChannelRoute?.pathname &&
      !(Object.values(Routes) as string[]).includes(matchChannelRoute.pathname)) ??
    false;

  const isChannelSubRoute = !!matchRoutes(channelSubRoutes, location);

  return {
    channelPathname:
      isChannelRoute && matchChannelRoute ? matchChannelRoute.pathname : null,
    isChannelRoute,
    isChannelSubRoute,
  };
}
