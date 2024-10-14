import { AnalyticsEventClientMobilePushNotificationActionAction } from '@noice-com/schemas/analytics/analytics.pb';
import { makeLoggers } from '@noice-com/utils';
import notifee, { AuthorizationStatus } from '@notifee/react-native';
import { Alert, Linking, StyleSheet } from 'react-native';

import { ButtonLarge } from '@components/ButtonLarge';
import { FormSheetModalLayout } from '@components/FormSheetModalLayout';
import { Gutter } from '@components/Gutter';
import { HStack } from '@components/Stack/HStack';
import { VStack } from '@components/Stack/VStack';
import { ToggleButton } from '@components/Toggle/ToggleButton';
import { Typography } from '@components/Typography';
import { borderRadius, colors } from '@constants/styles';
import { useChannelFollowing } from '@hooks/channel/useChannelFollowing.hook';
import { useChannelNotifications } from '@hooks/notifications/useChannelNotifications.hook';
import { useShouldAskForNotificationPermission } from '@hooks/notifications/useShouldAskForNotificationPermissions.hook';
import { useMountEffect } from '@hooks/useMountEffect.hook';
import { Analytics } from '@lib/Analytics';
import { RootNavigatorScreenProps } from '@navigators/routes';

const { logError } = makeLoggers('Push notification');

export const NotificationModal = ({
  navigation,
  route: {
    params: { channelId },
  },
}: RootNavigatorScreenProps<'notificationModal'>) => {
  const { unfollow } = useChannelFollowing(channelId);
  const { shouldAsk, shouldPromptToSettings } = useShouldAskForNotificationPermission();

  const { channelNotificationsEnabled, toggleChannelNotifications, isLoading } =
    useChannelNotifications(channelId);

  useMountEffect(() => {
    Analytics.trackEvent({
      clientMobilePushNotificationAction: {
        action: AnalyticsEventClientMobilePushNotificationActionAction.ACTION_MODAL_SHOWN,
      },
    });
  });

  const promptForNotificationPermission = async () => {
    Analytics.trackEvent({
      clientButtonClick: {
        action: 'REQUEST_NOTIFICATIONS_PERMISSION',
        pathname: 'NotificationModal',
      },
    });

    try {
      const { authorizationStatus } = await notifee.requestPermission();
      if (authorizationStatus === AuthorizationStatus.AUTHORIZED) {
        await toggleChannelNotifications(true);
        Analytics.trackEvent({
          clientMobilePushNotificationAction: {
            action: AnalyticsEventClientMobilePushNotificationActionAction.ACTION_ENABLED,
          },
        });
      } else {
        Analytics.trackEvent({
          clientMobilePushNotificationAction: {
            action:
              AnalyticsEventClientMobilePushNotificationActionAction.ACTION_DISABLED,
          },
        });
      }
    } catch (error) {
      logError(error);
    } finally {
      navigation.goBack();
    }
  };

  const notNow = () => {
    Analytics.trackEvent({
      clientButtonClick: {
        action: 'DISMISS_NOTIFICATIONS_PROMPT',
        pathname: 'NotificationModal',
      },
    });
    navigation.goBack();
  };

  const toggleNotifications = async (value: boolean) => {
    if (shouldPromptToSettings) {
      // if user has not given permission to notifications, prompt them to settings
      Alert.alert(
        'Enable notifications',
        'You need to enable notifications for this app in your device settings to receive notifications.',
        [
          {
            text: 'Cancel',
            onPress: () => {
              Analytics.trackEvent({
                clientButtonClick: {
                  action: 'DISMISS_NOTIFICATIONS_SETTINGS_PROMPT',
                  pathname: 'NotificationModal',
                },
              });
            },
            style: 'cancel',
          },
          {
            text: 'Open settings',
            // open settings app
            onPress: () => {
              Analytics.trackEvent({
                clientButtonClick: {
                  action: 'OPEN_DEVICE_SETTINGS_FOR_NOTIFICATIONS',
                  pathname: 'NotificationModal',
                },
              });
              Linking.openSettings();
            },
          },
        ],
        {
          cancelable: true,
        },
      );
    } else {
      await toggleChannelNotifications(value);
    }
  };

  const handleUnfollow = async () => {
    await toggleChannelNotifications(false);
    unfollow(navigation.goBack);
  };

  return (
    <FormSheetModalLayout>
      {!shouldAsk && (
        <>
          <HStack style={s.toggle}>
            <VStack
              spacing={4}
              style={s.toggleTexts}
            >
              <Typography
                color="whiteMain"
                fontSize="md"
                fontWeight="medium"
                uppercase
              >
                Live notifications
              </Typography>
              <Typography
                color="textLightSecondary"
                fontSize="sm"
                numberOfLines={2}
              >
                {channelNotificationsEnabled
                  ? 'Receive notification when the channel goes live.'
                  : "You won't receive a notification when the channel goes live."}
              </Typography>
            </VStack>
            <ToggleButton
              enabled={channelNotificationsEnabled}
              isLoading={isLoading}
              onToggle={toggleNotifications}
            />
          </HStack>
          <Gutter height={24} />
          <ButtonLarge
            rounded={false}
            onPress={handleUnfollow}
          >
            Unfollow
          </ButtonLarge>
        </>
      )}

      {shouldAsk && (
        <>
          <Typography
            fontSize="xl"
            fontWeight="medium"
            textAlign="center"
          >
            Get notified when creators you follow go live
          </Typography>
          <Gutter height={12} />
          <Typography
            color="textLightSecondary"
            textAlign="center"
          >
            You can adjust notifications in settings.
          </Typography>
          <Gutter height={28} />

          <ButtonLarge
            backgroundColor="whiteMain"
            textColor="darkMain"
            onPress={promptForNotificationPermission}
          >
            Continue
          </ButtonLarge>
          <Gutter height={8} />
          <ButtonLarge onPress={notNow}>Not now</ButtonLarge>
        </>
      )}
    </FormSheetModalLayout>
  );
};

const s = StyleSheet.create({
  toggle: {
    backgroundColor: colors.gray800,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: borderRadius.radiusMd,
  },
  toggleTexts: {
    flex: 1,
    marginRight: 16,
  },
});
