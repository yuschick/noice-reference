import { Navigate, useParams } from 'react-router';

import { Routes } from '@common/route';

type RouteParams = {
  channelName: string;
};

export function BrowserSourceRoute() {
  const { channelName } = useParams<RouteParams>();

  if (!channelName) {
    return null;
  }

  const to = `${Routes.Popout}${Routes.StreamAlerts}/card-game-events`.replace(
    ':channelName',
    channelName,
  );

  return <Navigate to={to} />;
}
