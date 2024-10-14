import {
  PopoverMenu,
  Switch,
  UsePopoverMenuResult,
  useAuthenticatedUser,
  useAnalytics,
} from '@noice-com/common-ui';
import { MouseEvent } from 'react';
import { Link, useLocation } from 'react-router-dom';

import styles from './FollowingPopoverMenu.module.css';

import { useUpdateChannelNotificationSettingsMutation } from '@common/channel/hooks';
import { Routes, SettingsRoutes } from '@common/route';

interface Props {
  channelId: string;
  popoverStore: UsePopoverMenuResult;
  isChannelNotificationsEnabled: boolean;
  isGlobalNotificationsEnabled: boolean;
  onUnfollowClick(event: MouseEvent<HTMLButtonElement>): void;
}

export function FollowingPopoverMenu({
  popoverStore,
  onUnfollowClick,
  channelId,
  isChannelNotificationsEnabled,
  isGlobalNotificationsEnabled,
}: Props) {
  const { trackButtonClickEvent } = useAnalytics();
  const { userId } = useAuthenticatedUser();
  const location = useLocation();

  const [updateChannelNotifications, { loading }] =
    useUpdateChannelNotificationSettingsMutation({
      variables: {
        channelId,
        userId,
        enabled: !isChannelNotificationsEnabled,
      },
    });

  return (
    <PopoverMenu store={popoverStore}>
      <PopoverMenu.Section className={styles.switchContainer}>
        <Switch
          checked={isChannelNotificationsEnabled}
          description={
            isChannelNotificationsEnabled
              ? 'Receive notification when the channel goes live.'
              : "You won't receive a notification when the channel goes live."
          }
          isLoading={loading}
          label="Live notifications"
          onChange={(event) => {
            updateChannelNotifications();
            trackButtonClickEvent(event.target.value ? 'enable' : 'disable', {
              section: 'channel-live-notifications',
            });
          }}
        />
      </PopoverMenu.Section>

      <p className={styles.globalSettingText}>
        {!isGlobalNotificationsEnabled && 'Notifications are disabled. '}You can adjust
        global notifications from your{' '}
        <Link
          className={styles.profileSettingLink}
          state={{ from: location }}
          to={`${Routes.Settings}/${SettingsRoutes.Notifications}`}
        >
          profile settings
        </Link>
        .
      </p>

      <PopoverMenu.Divider />

      <PopoverMenu.Button
        onClick={(event) => {
          onUnfollowClick(event);
        }}
      >
        Unfollow
      </PopoverMenu.Button>
    </PopoverMenu>
  );
}
