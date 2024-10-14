import { useClient } from '@noice-com/common-react-core';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

import { Routes } from '@common/route';

export const useForceLogout = () => {
  const client = useClient();
  const navigate = useNavigate();

  useEffect(() => {
    return client.NotificationService.notifications({
      async onForcedSignout() {
        navigate(Routes.Logout, { replace: true });
      },
    });
  });
};
