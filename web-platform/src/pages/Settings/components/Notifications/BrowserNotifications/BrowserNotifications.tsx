import { useMountEffect } from '@noice-com/common-react-core';
import { Anchor, ButtonLink, Callout, Switch } from '@noice-com/common-ui';

import {
  useWebPushAPI,
  PUSH_NOTIFICATIONS_HELP_PAGE_LINK,
} from '@common/web-push-notifications';
import { SettingsGroup, SettingsItem } from '@pages/Settings/components/SettingsGroup';
import { SettingsButton } from '@pages/Settings/components/SettingsGroup/SettingsButton';

export function BrowserNotifications() {
  const {
    enablePushNotifications,
    disablePushNotifications,
    isPushNotificationsLoading,
    isPushAPISupported,
    isPushNotificationsBlockedByUser,
    isPushNotificationsEnabled,
    verifyIfCanUsePushNotifications,
    sendTestPushNotification,
  } = useWebPushAPI();

  useMountEffect(() => {
    verifyIfCanUsePushNotifications();
  });

  if (!isPushAPISupported) {
    return;
  }

  const testNotificationButtonDescription = (
    <>
      {' '}
      System settings can sometimes interfere with Noice notifications delivery. If
      you&apos;re not receiving notifications, try sending a test notification to your
      browser and read this{' '}
      <Anchor href={PUSH_NOTIFICATIONS_HELP_PAGE_LINK}>guidelines</Anchor> to troubleshoot
      issues on your computer.
    </>
  );

  return (
    <SettingsGroup
      description="Receive notifications on your computer, even if you’re not on Noice"
      title="Browser notifications for this browser"
    >
      {isPushNotificationsBlockedByUser ? (
        <Callout
          message="Don't miss a thing. Allow notifications in your browser settings to know when followed channels go live."
          slots={{
            actions: {
              primary: (
                <ButtonLink
                  size="xs"
                  to={PUSH_NOTIFICATIONS_HELP_PAGE_LINK}
                >
                  Read guidelines
                </ButtonLink>
              ),
            },
          }}
          type="info"
        />
      ) : (
        <>
          <SettingsItem
            description="Receive notifications when followed channels go live."
            state={isPushNotificationsEnabled ? 'enabled' : 'disabled'}
          >
            <span>Channel notifications</span>

            <SettingsItem.Control>
              <Switch
                checked={isPushNotificationsEnabled}
                isLoading={isPushNotificationsLoading}
                label="Channel notifications"
                labelType="hidden"
                onChange={() =>
                  isPushNotificationsEnabled
                    ? disablePushNotifications()
                    : enablePushNotifications()
                }
              />
            </SettingsItem.Control>
          </SettingsItem>
          {isPushNotificationsEnabled && (
            <SettingsButton
              description={testNotificationButtonDescription}
              title="Not receiving notifications?"
              onClick={sendTestPushNotification}
            ></SettingsButton>
          )}
        </>
      )}
    </SettingsGroup>
  );
}
