import { useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';
import { StyleSheet } from 'react-native';

import { ButtonLarge } from '@components/ButtonLarge';
import { useChannelFollowing } from '@hooks/channel/useChannelFollowing.hook';
import { useChannelNotifications } from '@hooks/notifications/useChannelNotifications.hook';
import { useShouldAskForNotificationPermission } from '@hooks/notifications/useShouldAskForNotificationPermissions.hook';
import { Analytics } from '@lib/Analytics';
import {
  AuthenticatedNavigationHookProps,
  MainScreenNavigatorParams,
  RootNavigatorParams,
  TabNavigatorTabParams,
} from '@navigators/routes';
import { IconAssets } from '@utils/icons';

interface Props {
  channelId?: string;
  flex?: number;
  pathname: keyof (RootNavigatorParams &
    TabNavigatorTabParams &
    MainScreenNavigatorParams);
}

export const FollowButton = ({ flex = 1, channelId, pathname }: Props) => {
  const { shouldAsk, shouldPromptToSettings } = useShouldAskForNotificationPermission();
  const navigation = useNavigation<AuthenticatedNavigationHookProps>();
  const { follow, isFollowing } = useChannelFollowing(channelId);
  const { channelNotificationsEnabled, toggleChannelNotifications } =
    useChannelNotifications(channelId);

  const openNotificationOptions = useCallback(() => {
    if (channelId) {
      navigation.navigate('notificationModal', {
        channelId: channelId,
      });
    }
  }, [navigation, channelId]);

  const handlePress = async () => {
    if (!isFollowing) {
      Analytics.trackEvent({
        clientButtonClick: {
          action: 'FOLLOW',
          pathname,
        },
      });

      await follow();

      // ask for notification permission if user has not been asked before, otherwise toggle notifications
      if (shouldAsk) {
        openNotificationOptions();
        return;
      }

      await toggleChannelNotifications(true);
    } else {
      Analytics.trackEvent({
        clientButtonClick: {
          action: 'UNFOLLOW',
          pathname,
        },
      });

      openNotificationOptions();
    }
  };

  // notificationsEnabled is true if user has given permission to and they have enabled notifications for the channel
  const notificationsEnabled =
    !shouldPromptToSettings && !shouldAsk && channelNotificationsEnabled;
  const Icon = notificationsEnabled ? IconAssets.Bell : IconAssets.BellOff;
  const label = isFollowing ? 'Following' : 'Follow';

  return (
    <ButtonLarge
      analyticsActionName={isFollowing ? 'UNFOLLOW' : 'FOLLOW'}
      backgroundColor={isFollowing ? undefined : 'white'}
      flex={flex}
      iconElement={
        isFollowing ? (
          <Icon
            color="white"
            height={20}
            width={20}
          />
        ) : undefined
      }
      iconOnRight={isFollowing}
      style={s.button}
      textColor={isFollowing ? 'white' : 'black'}
      onPress={handlePress}
    >
      {label}
    </ButtonLarge>
  );
};

const s = StyleSheet.create({
  button: {
    paddingVertical: 12,
  },
});
