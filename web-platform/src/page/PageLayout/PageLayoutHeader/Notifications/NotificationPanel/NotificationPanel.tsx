import {
  PopoverMenu,
  Tabs,
  UsePopoverMenuResult,
  VisuallyHidden,
  useTabs,
} from '@noice-com/common-ui';

import { AnnouncementsTab } from './AnnouncementsTab/AnnouncementsTab';
import styles from './NotificationPanel.module.css';
import { NotificationsTab } from './NotificationsTab/NotificationsTab';

import {
  NotificationAnnouncementFragment,
  NotificationsTabFriendRequestFriendsUserFragment,
  NotificationsTabRewardRewardFragment,
  NotificationsTabSubscriptionPaymentFailedSubscriptionFragment,
  NotificationsTabUsernameRejectedProfileFragment,
} from '@gen';

export interface Props {
  popoverStore: UsePopoverMenuResult;
  announcements: NotificationAnnouncementFragment[];
  notifications: (
    | NotificationsTabFriendRequestFriendsUserFragment
    | NotificationsTabRewardRewardFragment
    | NotificationsTabSubscriptionPaymentFailedSubscriptionFragment
    | NotificationsTabUsernameRejectedProfileFragment
  )[];
  unreadNotifications: number;
  onNotificationClick(id: string): void;
  onOutsideClick(): void;
}

export function NotificationPanel({
  popoverStore,
  onOutsideClick,
  onNotificationClick,
  announcements,
  notifications,
  unreadNotifications,
}: Props) {
  const store = useTabs({
    loading: !popoverStore.state.popoverMenuIsOpen,
    variant: 'panel',
  });

  return (
    <PopoverMenu store={popoverStore}>
      <div className={styles.panel}>
        <Tabs
          store={store}
          title="Notifications"
        >
          <Tabs.List>
            <Tabs.TabButton>
              <div className={styles.tabLabelWrapper}>
                Notifications
                {!!unreadNotifications && (
                  <span className={styles.unreadPill}>
                    {unreadNotifications}
                    <VisuallyHidden>unread</VisuallyHidden>
                  </span>
                )}
              </div>
            </Tabs.TabButton>
            <Tabs.TabButton>Announcements</Tabs.TabButton>
          </Tabs.List>
          <Tabs.Panels>
            <Tabs.Panel lazyBehavior="keepMounted">
              <NotificationsTab
                notifications={notifications}
                unreadNotifications={unreadNotifications}
                onLinkClick={onOutsideClick}
              />
            </Tabs.Panel>
            <Tabs.Panel lazyBehavior="keepMounted">
              <AnnouncementsTab
                announcements={announcements}
                onNotificationClick={onNotificationClick}
              />
            </Tabs.Panel>
          </Tabs.Panels>
        </Tabs>
      </div>
    </PopoverMenu>
  );
}
