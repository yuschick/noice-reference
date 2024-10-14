import { useClient } from '@noice-com/common-react-core';
import { useAuthentication } from '@noice-com/common-ui';
import { useEffect } from 'react';

import { Context } from '../NotificationProvider';

import { useChannelSubscriptionUpdate } from './useChannelSubscriptionUpdate.hook';
import { useFriendStatusUpdateNotification } from './useFriendStatusUpdateNotification.hook';
import { useGoalCardProgressNotification } from './useGoalCardProgressNotification.hook';
import { useReceivedSubscriptionGiftNotification } from './useReceivedSubscriptionGiftNotification.hook';
import { useUserDataExportCompleteNotification } from './useUserDataExportCompleteNotification.hook';
import { useUsernameChangeNotification } from './useUsernameChangeNotification.hook';
import { useWalletTransactionNotification } from './useWalletTransactionNotification.hook';

type Props = Pick<Context, 'actions'>;

export function useNotificationServiceNotifications({ actions }: Props) {
  const { userId } = useAuthentication();
  const client = useClient();

  const { addNotification } = actions;

  const { onFriendStatusUpdate } = useFriendStatusUpdateNotification(actions);
  const { onGoalCardProgress } = useGoalCardProgressNotification(actions);
  const { onWalletTransaction } = useWalletTransactionNotification(actions);
  const { onChannelSubscriptionUpdate } = useChannelSubscriptionUpdate(actions);
  const { onUserDataExportComplete } = useUserDataExportCompleteNotification({
    addNotification,
  });
  const { onGiftSubscription } = useReceivedSubscriptionGiftNotification({
    addNotification,
  });
  const { onUsernameChange } = useUsernameChangeNotification(actions);

  useEffect(() => {
    // Skip if no user id
    if (!userId) {
      return;
    }

    return client.NotificationService.notifications({
      onFriendStatusUpdate,
      onGoalCardProgress,
      onWalletTransaction,
      onChannelSubscriptionUpdate,
      onUserDataExportComplete,
      onGiftSubscription,
      onUsernameChange,
    });
  }, [
    client.NotificationService,
    onChannelSubscriptionUpdate,
    onFriendStatusUpdate,
    onGiftSubscription,
    onGoalCardProgress,
    onUserDataExportComplete,
    onUsernameChange,
    onWalletTransaction,
    userId,
  ]);
}
