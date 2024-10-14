import { gql } from '@apollo/client';
import { Pill, useAuthenticatedUser } from '@noice-com/common-ui';

import styles from './OfflineChannelIndicator.module.css';
import { OfflineChannelIndicatorButton } from './OfflineChannelIndicatorButton/OfflineChannelIndicatorButton';

import {
  OfflineChannelIndicatorChannelFragment,
  useOfflineChannelIndicatorChannelNotificationSettingsQuery,
} from '@gen';

gql`
  query OfflineChannelIndicatorChannelNotificationSettings(
    $channelId: ID!
    $userId: ID!
  ) {
    channelFollowerNotificationSettings(channelId: $channelId, userId: $userId) {
      userId
      channelId
      channelLiveNotificationEnabled
      ...OfflineChannelIndicatorFollowerNotificationSetting
    }
  }
`;

interface Props {
  channel: OfflineChannelIndicatorChannelFragment;
}

export function OfflineChannelIndicator({ channel }: Props) {
  const { userId } = useAuthenticatedUser();
  const { data } = useOfflineChannelIndicatorChannelNotificationSettingsQuery({
    variables: { channelId: channel.id, userId },
  });

  if (!data?.channelFollowerNotificationSettings) {
    return null;
  }

  const notificationsEnabled =
    channel.following &&
    data.channelFollowerNotificationSettings.channelLiveNotificationEnabled;

  const pillColor = notificationsEnabled ? 'light-main' : 'gray-750';

  return (
    <div className={styles.container}>
      <div className={styles.pill}>
        <Pill
          color={pillColor}
          label="OFFLINE"
        />
      </div>

      <div className={styles.message}>
        {notificationsEnabled ? (
          <>
            <span className={styles.channelName}>{channel.name}</span> is away for now.
          </>
        ) : (
          <>
            Turn on notifications to find out when{' '}
            <span className={styles.channelName}>{channel.name}</span> goes live.
          </>
        )}
      </div>

      <div className={styles.button}>
        <OfflineChannelIndicatorButton
          channel={channel}
          notificationSettings={data.channelFollowerNotificationSettings}
        />
      </div>
    </div>
  );
}

OfflineChannelIndicator.fragments = {
  entry: gql`
    fragment OfflineChannelIndicatorChannel on ChannelChannel {
      id
      name
      following
      ...OfflineChannelIndicatorButtonChannel
    }
  `,
};
