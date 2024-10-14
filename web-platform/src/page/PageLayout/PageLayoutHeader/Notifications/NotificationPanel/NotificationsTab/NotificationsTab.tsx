import { gql } from '@apollo/client';
import { CoreAssets } from '@noice-com/assets-core';

import styles from './NotificationsTab.module.css';

import { NotificationListItem, Notifications } from '@common/notification';
import { Routes, SettingsRoutes } from '@common/route';
import {
  NotificationsTabFriendRequestFriendsUserFragment,
  NotificationsTabRewardRewardFragment,
  NotificationsTabSubscriptionPaymentFailedSubscriptionFragment,
  NotificationsTabUsernameRejectedProfileFragment,
} from '@gen';

gql`
  fragment NotificationsTabFriendRequestFriendsUser on FriendsUser {
    userId
    lastStatusChange
    profile {
      userId
      ...FriendRequestNotificationContentProfile
    }
  }

  fragment NotificationsTabRewardReward on RewardReward {
    id
    rewardedAt
    reason {
      reason {
        ... on ReasonReasonGoalCardComplete {
          goalCardSlotId
          goalCardId
          goalCard {
            id
            ...GoalCardNotificationContentGoalCard
          }
        }
        ... on ReasonReasonLevelUp {
          seasonId
          season {
            id
            ...SeasonNotificationContentSeason
          }
        }
      }
    }
  }

  fragment NotificationsTabSubscriptionPaymentFailedSubscription on SubscriptionChannelSubscription {
    id
    paymentFailedAt
    channel {
      id
      name
    }
  }

  fragment NotificationsTabUsernameRejectedProfile on ProfileProfile {
    userId
    usernameHistory(limit: 1) {
      reason
      changedAt
    }
  }
`;

interface Props {
  notifications: (
    | NotificationsTabFriendRequestFriendsUserFragment
    | NotificationsTabRewardRewardFragment
    | NotificationsTabSubscriptionPaymentFailedSubscriptionFragment
    | NotificationsTabUsernameRejectedProfileFragment
  )[];
  unreadNotifications: number;
  onLinkClick(): void;
}

export function NotificationsTab({
  notifications,
  unreadNotifications,
  onLinkClick,
}: Props) {
  if (!notifications.length) {
    return (
      <div className={styles.emptyView}>
        <span className={styles.emptyTitle}>You’re all caught up!</span>
        <span>No active notifications</span>
      </div>
    );
  }

  return (
    <ul className={styles.list}>
      {notifications.map((notification, index) => {
        if (notification.__typename === 'FriendsUser') {
          const { userId, profile } = notification;

          return (
            <NotificationListItem
              isNew={index < unreadNotifications}
              key={userId}
              theme="dark"
            >
              <Notifications.FriendRequestNotificationContent
                notificationId={userId}
                senderProfile={profile}
                theme="dark"
              />
            </NotificationListItem>
          );
        }

        if (notification.__typename === 'RewardReward') {
          const { reason, id } = notification;

          if (reason.reason?.__typename === 'ReasonReasonGoalCardComplete') {
            const slot = {
              id: reason.reason.goalCardSlotId,
              goalCard: {
                ...reason.reason.goalCard,
                description: reason.reason.goalCard.description.replace(
                  '{targetValue}',
                  reason.reason.goalCard.target.toString(),
                ),
              },
              progress: {
                completed: true,
                percentage: 1,
                value: reason.reason.goalCard.target,
              },
            };

            return (
              <NotificationListItem
                isNew={index < unreadNotifications}
                key={id}
                theme="dark"
              >
                <Notifications.GoalCardNotificationContent
                  notificationId={id}
                  slot={slot}
                  theme="dark"
                  onLinkClick={onLinkClick}
                />
              </NotificationListItem>
            );
          }

          if (reason.reason?.__typename === 'ReasonReasonLevelUp') {
            return (
              <NotificationListItem
                isNew={index < unreadNotifications}
                key={notification.id}
                theme="dark"
              >
                <Notifications.SeasonNotificationContent
                  notificationId={notification.id}
                  season={reason.reason.season}
                  theme="dark"
                  onLinkClick={onLinkClick}
                />
              </NotificationListItem>
            );
          }

          return null;
        }

        if (notification.__typename === 'SubscriptionChannelSubscription') {
          return (
            <NotificationListItem
              isNew={index < unreadNotifications}
              key={notification.id}
              theme="dark"
            >
              <Notifications.GenericLinkButtonNotificationContent
                buttonLink={{
                  content: 'Update payment method',
                  to: `${Routes.Settings}/${SettingsRoutes.Subscriptions}`,
                  onClick: onLinkClick,
                }}
                description="Your subscription payment failed"
                icon={CoreAssets.Icons.Alert}
                notificationId={notification.id}
                subtext={`To keep your subscription active for channel ${notification.channel.name}, please update
                your payment method.`}
                theme="dark"
              />
            </NotificationListItem>
          );
        }

        if (notification.__typename === 'ProfileProfile') {
          const { userId } = notification;

          return (
            <NotificationListItem
              isNew={index < unreadNotifications}
              key={userId}
              theme="dark"
            >
              <Notifications.GenericLinkButtonNotificationContent
                buttonLink={{
                  content: 'Change your username',
                  to: `${Routes.Settings}/${SettingsRoutes.Profile}`,
                  onClick: onLinkClick,
                }}
                description="Your username has been rejected"
                icon={CoreAssets.Icons.Exclamation}
                notificationId={userId}
                subtext="A new username has been assigned to you."
                theme="dark"
              />
            </NotificationListItem>
          );
        }
      })}
    </ul>
  );
}
