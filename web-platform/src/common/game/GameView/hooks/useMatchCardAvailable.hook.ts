import { CoreAssets } from '@noice-com/assets-core';
// eslint-disable-next-line no-restricted-imports
import { CardGameOnMatchCardAvailable } from '@noice-com/card-game/src/game-logic/game';
import { Nullable } from '@noice-com/utils';
import { useEffect, useRef } from 'react';

import { Notifications, useNotifications } from '@common/notification';
import {
  AddNotificationResult,
  NotificationComponentBaseProps,
} from '@common/notification/types';
import { useStreamGame } from '@common/stream';

export function useMatchCardAvailable() {
  const currentNotification =
    useRef<Nullable<AddNotificationResult<NotificationComponentBaseProps>>>(null);
  const { gameInstance } = useStreamGame();
  const {
    actions: { addNotification },
  } = useNotifications();

  useEffect(() => {
    if (!gameInstance) {
      return;
    }

    const clearNotification = () => {
      currentNotification.current?.actions.remove();
    };

    const handleMatchCardAvailable = ({ forPlayerId }: CardGameOnMatchCardAvailable) => {
      if (forPlayerId !== gameInstance.localPlayerId || currentNotification.current) {
        return;
      }

      currentNotification.current = addNotification({
        component: {
          type: Notifications.GenericNotificationContent,
          props: {
            description: 'Match cards available!',
            icon: CoreAssets.Icons.Trophy,
          },
        },
        options: {
          duration: 3500,
        },
        events: {
          onRemoved: () => {
            currentNotification.current = null;
          },
        },
      });
    };

    gameInstance?.addListener('onMatchStarted', clearNotification);
    gameInstance?.addListener('onMatchEnded', clearNotification);
    gameInstance?.addListener('onMatchCardAvailable', handleMatchCardAvailable);

    return () => {
      clearNotification();

      gameInstance?.removeListener('onMatchStarted', clearNotification);
      gameInstance?.removeListener('onMatchEnded', clearNotification);
      gameInstance?.removeListener('onMatchCardAvailable', handleMatchCardAvailable);
    };
  }, [gameInstance, addNotification]);
}
