import { CoreAssets } from '@noice-com/assets-core';
import {
  CGPlayerOnInactivityWarning,
  useCardGameLocalPlayer,
} from '@noice-com/card-game';
import { useAnalytics } from '@noice-com/common-ui';
import { AnalyticsEventClientSoloPlayToggleSoloPlayToggleContext } from '@noice-com/schemas/analytics/analytics.pb';
import { Nullable } from '@noice-com/utils';
import { useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';

import {
  InactivityKickNotification,
  InactivityKickNotificationProps,
} from '../InactivityKickNotification/InactivityKickNotification';

import { Notifications, useNotifications } from '@common/notification';
import {
  AddNotificationResult,
  NotificationComponentBaseProps,
} from '@common/notification/types';
import { useStreamGame } from '@common/stream';

export function useInactivityKick() {
  const progressNotification =
    useRef<Nullable<AddNotificationResult<InactivityKickNotificationProps>>>(null);
  const kickedNotification =
    useRef<Nullable<AddNotificationResult<NotificationComponentBaseProps>>>(null);

  const notificationDismissedByUser = useRef<boolean>(false);
  const { streamId, gameInstance, joinGame } = useStreamGame();
  const localPlayer = useCardGameLocalPlayer();

  const { actions: notificationActions } = useNotifications();

  const navigate = useNavigate();
  const { trackEvent } = useAnalytics();

  // Common
  const forceJoinSoloPlay = useCallback(async () => {
    if (!streamId) {
      return;
    }

    await joinGame(streamId, { isSolo: true, forceGroupReset: true });

    trackEvent({
      clientSoloPlayToggle: {
        enabled: true,
        context:
          AnalyticsEventClientSoloPlayToggleSoloPlayToggleContext.SOLO_PLAY_TOGGLE_CONTEXT_AFK_KICK,
      },
    });
  }, [joinGame, trackEvent, streamId]);

  useEffect(() => {
    if (!localPlayer || !gameInstance) {
      return;
    }

    const removeExistingNotifications = () => {
      progressNotification.current?.actions.remove();
      kickedNotification.current?.actions.remove();
    };

    const handleInactivityKick = async () => {
      await forceJoinSoloPlay();

      removeExistingNotifications();
      notificationDismissedByUser.current = false;

      kickedNotification.current = notificationActions.addNotification({
        component: {
          type: Notifications.GenericNotificationContent,
          props: {
            description: 'You are now playing SOLO!',
            subtext: 'This is due to inactivity in your team.',
            icon: CoreAssets.Icons.Alert,
          },
        },
        events: {
          onRemoved: () => {
            kickedNotification.current = null;
          },
        },
      });
    };

    const handleInactivityWarning = ({
      secondsRemaining,
    }: CGPlayerOnInactivityWarning) => {
      if (notificationDismissedByUser.current) {
        return;
      }

      if (!progressNotification.current) {
        progressNotification.current = notificationActions.addNotification({
          component: {
            type: InactivityKickNotification,
            props: {
              description:
                'You are about to be removed from your team and moved into solo due to inactivity',
              icon: CoreAssets.Icons.Alert,
              secondsLeft: secondsRemaining,
            },
          },
          options: {
            duration: 0,
          },
          events: {
            onRemoved: () => {
              progressNotification.current = null;
            },
            onCloseClicked: () => {
              notificationDismissedByUser.current = true;
            },
          },
        });

        return;
      }

      progressNotification.current.actions.update({
        secondsLeft: secondsRemaining,
      });
    };

    const handleLocalGroupChanged = () => {
      removeExistingNotifications();
      notificationDismissedByUser.current = false;
    };

    const handleInactivityKickPaused = () => {
      removeExistingNotifications();
    };

    const handleInactivityKickCancelled = () => {
      removeExistingNotifications();
      notificationDismissedByUser.current = false;
    };

    localPlayer.addListener('onInactivityKick', handleInactivityKick);
    localPlayer.addListener('onInactivityWarning', handleInactivityWarning);
    localPlayer.addListener('onInactivityKickPaused', handleInactivityKickPaused);
    localPlayer.addListener('onInactivtyKickCancelled', handleInactivityKickCancelled);
    gameInstance.addListener('onLocalGroupChanged', handleLocalGroupChanged);

    return () => {
      removeExistingNotifications();

      localPlayer.removeListener('onInactivityKick', handleInactivityKick);
      localPlayer.removeListener('onInactivityWarning', handleInactivityWarning);
      localPlayer.removeListener('onInactivityKickPaused', handleInactivityKickPaused);
      localPlayer.removeListener(
        'onInactivtyKickCancelled',
        handleInactivityKickCancelled,
      );
      gameInstance.removeListener('onLocalGroupChanged', handleLocalGroupChanged);
    };
  }, [forceJoinSoloPlay, navigate, localPlayer, gameInstance, notificationActions]);
}
