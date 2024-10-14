import { useApolloClient } from '@apollo/client';
import { useClient } from '@noice-com/common-react-core';
import { useEffect } from 'react';

export function useListenGoalCardSlotsUpdates() {
  const client = useClient();
  const { cache } = useApolloClient();

  useEffect(() => {
    const onUpdate = () => {
      cache.evict({ fieldName: 'goalCardSlots' });
      cache.gc();
    };

    return client.NotificationService.notifications({
      onGoalCardProgress: onUpdate,
      onReward: (msg) => {
        if (!msg.content?.reward?.reason?.goalCardComplete) {
          return;
        }

        onUpdate();
      },
      onWalletTransaction(_ctx, ev) {
        if (ev.transaction?.reason?.rewardClaimed?.rewardReason?.goalCardComplete) {
          onUpdate();
        }
      },
    });
  }, [cache, client]);
}
