import { To } from 'react-router';

import { useChannelRouteContext } from '@common/channel';
import { Routes, SubscriptionsSubRoutes } from '@common/route';

interface HookResult {
  toSubscriptionsSettings: To;
  toEmojis: To;
  toSubscribers: To;
}

export function useSubscriptionsLinks(): HookResult {
  const routeBase = Routes.MonetizationSubscriptions;
  const { transformPathToChannelPath } = useChannelRouteContext();

  const toSubscriptionsSettings = transformPathToChannelPath(routeBase);

  const toEmojis = transformPathToChannelPath(
    `${routeBase}/${SubscriptionsSubRoutes.Emojis}`,
  );

  const toSubscribers = transformPathToChannelPath(
    `${routeBase}/${SubscriptionsSubRoutes.Subscribers}`,
  );

  return {
    toSubscriptionsSettings,
    toEmojis,
    toSubscribers,
  };
}
