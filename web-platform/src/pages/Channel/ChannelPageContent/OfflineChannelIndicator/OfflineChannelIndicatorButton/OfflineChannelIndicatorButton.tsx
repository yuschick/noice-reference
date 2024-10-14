import { gql } from '@apollo/client';
import { CoreAssets } from '@noice-com/assets-core';
import { Button, Icon, useAnalytics, useAuthenticatedUser } from '@noice-com/common-ui';

import styles from './OfflineChannelIndicatorButton.module.css';

import {
  useFollowChannelMutation,
  useUpdateChannelNotificationSettingsMutation,
} from '@common/channel/hooks';
import {
  UpSellingDialogSource,
  useImplicitAccountUpSellingAction,
} from '@common/implicit-account';
import {
  OfflineChannelIndicatorChannelFragment,
  OfflineChannelIndicatorFollowerNotificationSettingFragment,
} from '@gen';

interface Props {
  channel: OfflineChannelIndicatorChannelFragment;
  notificationSettings: OfflineChannelIndicatorFollowerNotificationSettingFragment;
}

export function OfflineChannelIndicatorButton({ channel, notificationSettings }: Props) {
  const { onAction } = useImplicitAccountUpSellingAction(
    UpSellingDialogSource.FollowChannel,
  );
  const { userId } = useAuthenticatedUser();
  const [updateChannelNotifications, { loading: updateChannelNotificationsLoading }] =
    useUpdateChannelNotificationSettingsMutation();
  const [followChannel, { loading: followChannelLoading }] = useFollowChannelMutation();
  const { trackButtonClickEvent } = useAnalytics();

  if (channel.following && notificationSettings.channelLiveNotificationEnabled) {
    return (
      <div className={styles.messageChannelFollowed}>
        <div className={styles.icon}>
          <Icon icon={CoreAssets.Icons.Bell} />
        </div>
        <div>You will receive a notification when the channel goes live</div>
      </div>
    );
  }

  const onClick = () => {
    const section = 'offline-channel-indicator';

    if (!channel.following) {
      trackButtonClickEvent('follow-channel', {
        section,
      });

      followChannel({
        variables: {
          channelId: channel.id,
          userId,
        },
      });
      return;
    }

    if (!notificationSettings.channelLiveNotificationEnabled) {
      trackButtonClickEvent('enable-live-notifications', {
        section,
      });
      // just enable channel live notification if channel is already followed
      updateChannelNotifications({
        variables: {
          channelId: channel.id,
          userId,
          enabled: true,
        },
      });
      return;
    }
  };

  return (
    <Button
      fit="content"
      iconStart={CoreAssets.Icons.Bell}
      isLoading={updateChannelNotificationsLoading || followChannelLoading}
      size="xs"
      onClick={() => onAction(onClick)}
    >
      Turn on notifications
    </Button>
  );
}

OfflineChannelIndicatorButton.fragments = {
  entry: gql`
    fragment OfflineChannelIndicatorFollowerNotificationSetting on ChannelFollowerNotificationSettings {
      channelId
      channelLiveNotificationEnabled
    }
    fragment OfflineChannelIndicatorButtonChannel on ChannelChannel {
      id
      following
    }
  `,
};
