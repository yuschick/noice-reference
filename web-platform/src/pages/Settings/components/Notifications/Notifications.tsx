import { gql } from '@apollo/client';
import { useAuthenticatedUser } from '@noice-com/common-ui';

import { EmailNotifications } from './EmailNotifications';

import { useNotificationsSettingsQuery } from '@gen';
import { BrowserNotifications } from '@pages/Settings/components/Notifications/BrowserNotifications';

gql`
  query NotificationsSettings($userId: ID!) {
    profile(userId: $userId) {
      userId
      ...MarketingNotificationProfile
    }

    channelNotificationSettings(userId: $userId) {
      userId
      ...ChannelNotificationChannelNotificationSettings
    }
  }
`;

export function Notifications() {
  const { userId } = useAuthenticatedUser();
  const { data } = useNotificationsSettingsQuery({
    variables: { userId },
  });

  const profile = data?.profile;
  const channelNotificationSettings = data?.channelNotificationSettings;

  if (!profile || !channelNotificationSettings) {
    return null;
  }

  return (
    <>
      <EmailNotifications
        channelNotificationSettings={channelNotificationSettings}
        profile={profile}
      />
      <BrowserNotifications />
    </>
  );
}
