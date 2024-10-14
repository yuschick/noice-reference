// hook used on Channel and Stream views to automatically prompt to enable notications

import { Nullable } from '@noice-com/utils';
import { useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useRef } from 'react';

import { useShouldAskForNotificationPermission } from './useShouldAskForNotificationPermissions.hook';

import { useChannelFollowing } from '@hooks/channel/useChannelFollowing.hook';
import { AuthenticatedNavigationHookProps } from '@navigators/routes';

/**
 * This hook takes care of handling a case where you've already enabled notifications for a channel on desktop
 * but haven't enabled them on mobile yet. It will prompt you to enable notifications after a delay.
 * @param channelId - the id of the channel
 */
export const useAskToEnableNotifications = (channelId?: string) => {
  const { shouldAsk } = useShouldAskForNotificationPermission();
  const navigation = useNavigation<AuthenticatedNavigationHookProps>();
  const { isFollowing } = useChannelFollowing(channelId);
  const timeoutRef = useRef<Nullable<number>>(null);

  const openNotificationOptions = useCallback(() => {
    if (channelId) {
      navigation.navigate('notificationModal', {
        channelId: channelId,
      });
    }
  }, [navigation, channelId]);

  // handles prompting for permissions in the case that user has not given permission to notifications
  useEffect(() => {
    if (isFollowing && shouldAsk) {
      timeoutRef.current = setTimeout(() => {
        openNotificationOptions();
        timeoutRef.current = null;
      }, 5000); // 5 seconds delay
    }

    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [openNotificationOptions, shouldAsk, isFollowing]);
};
