import { useApolloClient } from '@apollo/client';
import { useClient } from '@noice-com/common-react-core';
import { useAuthenticatedUser } from '@noice-com/common-ui';
import { useEffect } from 'react';

export function useListenRewardClaimedUpdates() {
  const { userId } = useAuthenticatedUser();
  const client = useClient();
  const { cache } = useApolloClient();

  useEffect(() => {
    return client.NotificationService.notifications({
      onWalletTransaction(_ctx, ev) {
        if (!ev.transaction?.reason?.adWatched) {
          return;
        }

        cache.evict({ fieldName: 'placement' });
        cache.gc();
      },
    });
  }, [cache, client.NotificationService, userId]);
}
