import { CardGameOnTeamMergeWarningReceived } from '@noice-com/card-game';
import { useEffect } from 'react';

import { Notifications, useNotifications } from '@common/notification';
import { useStreamGame } from '@common/stream';

export function useTeamMergeListener() {
  const { gameInstance, streamId, joinGame } = useStreamGame();
  const {
    actions: { addNotification },
  } = useNotifications();

  useEffect(() => {
    if (!gameInstance || !streamId) {
      return;
    }

    const handleTeamMergeWarning = async ({
      countdownMs,
    }: CardGameOnTeamMergeWarningReceived) => {
      addNotification({
        component: {
          type: Notifications.GenericNotificationContent,
          props: {
            description: 'Looking to auto-merge smaller teams',
            subtext: 'You might be merged to another team',
          },
        },
        options: {
          duration: countdownMs,
        },
      });
    };

    const handleTeamMerge = async () => {
      await joinGame(streamId, { isSolo: false, forceGroupReset: true });

      addNotification({
        component: {
          type: Notifications.GenericNotificationContent,
          props: {
            description: 'You were moved to another team!',
            subtext: 'This is due to the auto-merging of smaller teams.',
          },
        },
      });
    };

    gameInstance.addListener('onTeamMergeExecuted', handleTeamMerge);
    gameInstance.addListener('onTeamMergeWarningReceived', handleTeamMergeWarning);

    return () => {
      gameInstance.removeListener('onTeamMergeExecuted', handleTeamMerge);
      gameInstance.removeListener('onTeamMergeWarningReceived', handleTeamMergeWarning);
    };
  }, [streamId, gameInstance, joinGame, addNotification]);
}
