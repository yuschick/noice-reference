import { useClient } from '@noice-com/common-react-core';
import { useCallback } from 'react';
import { useLocation } from 'react-router-dom';

interface HookResult {
  sendAddFriendFormViewedEventCallback(): void;
  sendFriendMenuOpenedEvent(): void;
  sendViewFriendsEventCallback(friendCount: number): void;
}

export function useFriendsAnalytics(): HookResult {
  const client = useClient();
  const location = useLocation();

  const sendAddFriendFormViewedEventCallback = useCallback(() => {
    client.AnalyticsService.trackEvent({
      clientAddFriendFormViewed: {
        pathname: location.pathname,
      },
    });
  }, [client, location]);

  const sendFriendMenuOpenedEvent = () => {
    client.AnalyticsService.trackEvent({
      clientFriendMenuOpened: {
        friendCount: undefined,
      },
    });
  };

  const sendViewFriendsEventCallback = useCallback(
    (friendCount: number) => {
      client.AnalyticsService.trackEvent({
        clientViewFriends: {
          friendCount,
        },
      });
    },
    [client],
  );

  return {
    sendAddFriendFormViewedEventCallback,
    sendFriendMenuOpenedEvent,
    sendViewFriendsEventCallback,
  };
}
