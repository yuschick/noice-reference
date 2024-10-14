import { Navigate } from 'react-router';

import { useAvailableChannelsContext } from '@common/channel';
import { Routes } from '@common/route';

export function SettingsForwarder() {
  const { paginatedChannels, loading: loadingChannels } = useAvailableChannelsContext();

  if (loadingChannels) {
    return null;
  }

  if (!paginatedChannels?.length) {
    return (
      <Navigate
        to={Routes.NoAccess}
        replace
      />
    );
  }

  return (
    <Navigate
      to={`/${paginatedChannels[0].name}${Routes.SettingsStream}`}
      replace
    />
  );
}
