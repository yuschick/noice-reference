import { gql } from '@apollo/client';
import {
  FriendStatusUpdateEvent,
  FriendStatusUpdateEventUpdateType,
} from '@noice-com/schemas/friends/friends.pb';
import { Notification } from '@noice-com/schemas/notification/notification.pb';
import { useSocialPackageEvents } from '@noice-com/social';
import { useCallback, useEffect, useRef } from 'react';

import {
  FriendRequestAcceptedNotificationContent,
  FriendRequestNotificationContent,
} from '../../content';
import { Context } from '../NotificationProvider';

import { useNotificationFriendRequestProfileLazyQuery } from '@gen';

gql`
  query NotificationFriendRequestProfile($userId: ID!) {
    profile(userId: $userId) {
      userId
      ...FriendRequestNotificationContentProfile
    }
  }
`;

interface HookResult {
  onFriendStatusUpdate(ctx: Notification, ev: FriendStatusUpdateEvent): void;
}

type Props = Context['actions'];

export function useFriendStatusUpdateNotification({
  addNotification,
  removeNotification,
}: Props): HookResult {
  const [fetchFriendRequestProfile] = useNotificationFriendRequestProfileLazyQuery({
    // We want the profile to be up to date when notification is shown
    fetchPolicy: 'cache-and-network',
  });

  const friendRequestNotifications = useRef<Map<string, string>>(new Map());

  const events = useSocialPackageEvents();

  const onFriendStatusUpdate = useCallback(
    async (_ctx: Notification, ev: FriendStatusUpdateEvent) => {
      // Ignore events that are not friend requests or friend request acceptances
      if (
        !ev.actorUserId ||
        (ev.type !== FriendStatusUpdateEventUpdateType.UPDATE_TYPE_FRIEND_INVITATION &&
          ev.type !== FriendStatusUpdateEventUpdateType.UPDATE_TYPE_INVITATION_ACCEPTED &&
          ev.type !== FriendStatusUpdateEventUpdateType.UPDATE_TYPE_INVITATION_CANCELLED)
      ) {
        return;
      }

      // If a pending friend request is cancelled by the sender,remove the notification from the receiver
      if (
        ev.type === FriendStatusUpdateEventUpdateType.UPDATE_TYPE_INVITATION_CANCELLED
      ) {
        const existingNotificationId = friendRequestNotifications.current.get(
          ev.actorUserId,
        );

        if (existingNotificationId) {
          removeNotification(existingNotificationId);
        }
        return;
      }

      const { data } = await fetchFriendRequestProfile({
        variables: { userId: ev.actorUserId },
      });

      if (!data?.profile) {
        return;
      }

      if (ev.type === FriendStatusUpdateEventUpdateType.UPDATE_TYPE_FRIEND_INVITATION) {
        const { id } = addNotification({
          component: {
            type: FriendRequestNotificationContent,
            props: {
              senderProfile: data.profile,
              onMutationCompleted(notificationId) {
                removeNotification(notificationId);
              },
            },
          },
          options: {
            duration: 0,
          },
        });

        const existingNotificationFromUser = friendRequestNotifications.current.get(
          ev.actorUserId,
        );
        if (existingNotificationFromUser) {
          removeNotification(existingNotificationFromUser);
        }

        friendRequestNotifications.current.set(ev.actorUserId, id);

        return;
      }

      addNotification({
        component: {
          type: FriendRequestAcceptedNotificationContent,
          props: {
            senderProfile: data.profile,
          },
        },
      });
    },
    [addNotification, fetchFriendRequestProfile, removeNotification],
  );

  useEffect(() => {
    const onFriendRequestChange = (requesterUserId: string) => {
      const currentNotificationId =
        friendRequestNotifications.current.get(requesterUserId);

      if (currentNotificationId) {
        removeNotification(currentNotificationId);
      }
    };

    events.addListener('onFriendRequestAccepted', onFriendRequestChange);
    events.addListener('onFriendRequestRemoved', onFriendRequestChange);
    events.addListener('onFriendRequestSent', onFriendRequestChange);

    return () => {
      events.removeListener('onFriendRequestAccepted', onFriendRequestChange);
      events.removeListener('onFriendRequestRemoved', onFriendRequestChange);
      events.removeListener('onFriendRequestSent', onFriendRequestChange);
    };
  }, [events, removeNotification]);

  return { onFriendStatusUpdate };
}
