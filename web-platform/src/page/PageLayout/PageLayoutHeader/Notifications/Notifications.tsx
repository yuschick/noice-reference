import { gql, useApolloClient } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import { CoreAssets } from '@noice-com/assets-core';
import { useClient } from '@noice-com/common-react-core';
import {
  PlatformAnnouncementsModal,
  IconButton,
  usePopoverMenu,
  PopoverMenu,
  useAuthentication,
} from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import debounce from 'lodash.debounce';
import { useCallback, useEffect, useState } from 'react';

import { NotificationPanel } from './NotificationPanel/NotificationPanel';
import styles from './Notifications.module.css';

import { useListenAppLocalStorageValue } from '@common/localstorage';
import {
  ModerationViolation,
  NotificationProfileFragment,
  NotificationRewardFragment,
  useNotificationAnnouncementsLazyQuery,
  useNotificationPaymentFailedSubscriptionsQuery,
  useNotificationReceivedFriendRequestsQuery,
  useNotificationRewardsQuery,
} from '@gen';

gql`
  query NotificationAnnouncements($userId: ID!) {
    userAnnouncements(userId: $userId, target: ANNOUNCEMENT_TARGET_WEB) {
      announcements {
        id
        ...NotificationAnnouncement
        ...PlatformAnnouncement
      }
    }
  }

  query NotificationReceivedFriendRequests($userId: ID!) {
    receivedFriendRequests(userId: $userId) {
      users {
        userId
        ...NotificationsTabFriendRequestFriendsUser
      }
    }
  }

  query NotificationPaymentFailedSubscriptions($userId: ID!) {
    userChannelSubscriptions(userId: $userId, filters: [{ paymentFailed: true }]) {
      subscriptions {
        id
        ...NotificationsTabSubscriptionPaymentFailedSubscription
      }
    }
  }

  query NotificationRewards($userId: ID!) {
    rewards(userId: $userId) {
      rewards {
        id
        ...NotificationReward
      }
    }
  }

  fragment NotificationReward on RewardReward {
    ...NotificationsTabRewardReward
  }

  fragment NotificationProfile on ProfileProfile {
    ...NotificationsTabUsernameRejectedProfile
  }
`;

const getRelevantRewardsNotifications = (
  notifications: NotificationRewardFragment[],
): NotificationRewardFragment[] => {
  let hasLevelUpNotification = false;

  return notifications.reduce<NotificationRewardFragment[]>((prev, curr) => {
    // When not level up, just add back to array
    if (curr.reason.reason?.__typename !== 'ReasonReasonLevelUp') {
      return [...prev, curr];
    }

    // If there is not level up notification yet, add the one
    if (!hasLevelUpNotification) {
      hasLevelUpNotification = true;
      return [...prev, curr];
    }

    // If there is level up notification, do not add any more
    return prev;
  }, []);
};

interface Props {
  profile: Nullable<NotificationProfileFragment>;
  renderAsPopoverButton?: boolean;
}

export function Notifications({ profile, renderAsPopoverButton }: Props) {
  const popover = usePopoverMenu({ placement: 'bottom' });
  const { toggle } = popover.actions;

  const { userId } = useAuthentication();
  const client = useClient();
  const { cache } = useApolloClient();
  const [lastSeenTimestamp, setLastSeenTimestamp] = useListenAppLocalStorageValue(
    'notifications.timestamp',
  );

  const [activeAnnouncement, setActiveAnnouncement] = useState<Nullable<string>>(null);

  const [fetchAnnouncements, { data: announcementData }] =
    useNotificationAnnouncementsLazyQuery();

  const { data: rewardData, refetch: refetchRewards } = useNotificationRewardsQuery({
    ...variablesOrSkip({ userId }),
  });
  const rewards = rewardData?.rewards?.rewards ?? [];

  const { data: friendRequestData } = useNotificationReceivedFriendRequestsQuery({
    ...variablesOrSkip({ userId }),
  });
  const receivedFriendRequests = friendRequestData?.receivedFriendRequests?.users ?? [];

  const { data: paymentFailedSubscriptionsData } =
    useNotificationPaymentFailedSubscriptionsQuery({
      ...variablesOrSkip({ userId }),
    });
  const paymentFailedSubscriptions =
    paymentFailedSubscriptionsData?.userChannelSubscriptions?.subscriptions ?? [];

  useEffect(() => {
    if (!userId || !popover.state.popoverMenuIsOpen) {
      return;
    }

    fetchAnnouncements({ variables: { userId } });
  }, [fetchAnnouncements, popover.state.popoverMenuIsOpen, userId]);

  useEffect(() => {
    const onDebouncedLevelUpReward = debounce(refetchRewards, 300);

    return client.NotificationService.notifications({
      onReward(_ctx, ev) {
        if (ev.reason?.goalCardComplete || ev.reason?.levelUp) {
          onDebouncedLevelUpReward();
        }
      },
    });
  }, [cache, client.NotificationService, refetchRewards]);

  const modalData = activeAnnouncement
    ? announcementData?.userAnnouncements?.announcements.find(
        (announcement) => announcement.id === activeAnnouncement,
      )
    : undefined;

  const onNotificationClick = (id: string) => {
    setActiveAnnouncement(id);
    onToggleClick();
  };

  const onToggleClick = useCallback(() => {
    if (popover.state.popoverMenuIsOpen) {
      setLastSeenTimestamp(Date.now());
    }

    toggle();
  }, [popover.state.popoverMenuIsOpen, setLastSeenTimestamp, toggle]);

  const relevantRewards = getRelevantRewardsNotifications(rewards);
  const usernameChangedNotifications =
    profile?.usernameHistory?.[0].reason &&
    profile.usernameHistory?.[0].reason !== ModerationViolation.ViolationUnspecified
      ? [profile]
      : [];

  const notifications = [
    ...receivedFriendRequests,
    ...relevantRewards,
    ...paymentFailedSubscriptions,
    ...usernameChangedNotifications,
  ].sort((a, z) => {
    let aDate: Nullable<Date> = null;
    let zDate: Nullable<Date> = null;

    if (a.__typename === 'FriendsUser') {
      aDate = new Date(a.lastStatusChange);
    }

    if (a.__typename === 'RewardReward') {
      aDate = new Date(a.rewardedAt);
    }

    if (z.__typename === 'FriendsUser') {
      zDate = new Date(z.lastStatusChange);
    }

    if (z.__typename === 'RewardReward') {
      zDate = new Date(z.rewardedAt);
    }

    if (a.__typename === 'SubscriptionChannelSubscription' && a.paymentFailedAt) {
      aDate = new Date(a.paymentFailedAt);
    }

    if (z.__typename === 'SubscriptionChannelSubscription' && z.paymentFailedAt) {
      zDate = new Date(z.paymentFailedAt);
    }

    if (a.__typename === 'ProfileProfile' && a.usernameHistory?.[0].changedAt) {
      aDate = new Date(a.usernameHistory[0].changedAt);
    }

    if (z.__typename === 'ProfileProfile' && z.usernameHistory?.[0].changedAt) {
      zDate = new Date(z.usernameHistory[0].changedAt);
    }

    if (!aDate || !zDate) {
      return 0;
    }

    return zDate.getTime() - aDate.getTime();
  });

  const unseenNotificationsCount = notifications.filter((notification) => {
    if (notification.__typename === 'FriendsUser') {
      return new Date(notification.lastStatusChange).getTime() > lastSeenTimestamp;
    }

    if (notification.__typename === 'RewardReward') {
      return new Date(notification.rewardedAt).getTime() > lastSeenTimestamp;
    }

    if (
      notification.__typename === 'ProfileProfile' &&
      notification.usernameHistory?.[0].changedAt
    ) {
      return (
        new Date(notification.usernameHistory[0].changedAt).getTime() > lastSeenTimestamp
      );
    }

    return false;
  }).length;

  return (
    <div className={styles.wrapper}>
      {renderAsPopoverButton ? (
        <PopoverMenu.Button
          ref={popover.state.popoverMenuTriggerRef}
          onClick={onToggleClick}
        >
          Notifications
        </PopoverMenu.Button>
      ) : (
        <IconButton
          icon={CoreAssets.Icons.Notification}
          label="Notifications"
          ref={popover.state.popoverMenuTriggerRef}
          size="sm"
          statusMessage={
            unseenNotificationsCount
              ? `${unseenNotificationsCount} unseen notification${
                  unseenNotificationsCount === 1 ? '' : 's'
                }}`
              : undefined
          }
          variant="ghost"
          onClick={onToggleClick}
        />
      )}

      <NotificationPanel
        announcements={announcementData?.userAnnouncements?.announcements ?? []}
        notifications={notifications}
        popoverStore={popover}
        unreadNotifications={unseenNotificationsCount}
        onNotificationClick={onNotificationClick}
        onOutsideClick={onToggleClick}
      />

      <PlatformAnnouncementsModal
        announcements={modalData ? [modalData] : []}
        isOpen={!!activeAnnouncement}
        onClose={() => setActiveAnnouncement(null)}
      />
    </div>
  );
}
