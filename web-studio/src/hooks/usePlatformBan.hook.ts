import { useClient } from '@noice-com/common-react-core';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

import { Routes } from '@common/route';

export function usePlatformBan() {
  const client = useClient();
  const navigate = useNavigate();

  useEffect(() => {
    return client.NotificationService.notifications({
      onPlatformUserBanned() {
        navigate(Routes.Suspended, {
          replace: true,
          state: { forceBan: true },
        });

        // Refresh the session to prevent a delay between a ban and the banned UI
        client.refreshAccessToken();
      },
    });
  }, [client, client.NotificationService, navigate]);
}
