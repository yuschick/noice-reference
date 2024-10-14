import {
  PushNotificationPayload,
  routePushNotificationPayloadPayloadDelegate,
} from '@noice-com/schemas/notification/notification.pb';
import { makeLoggers } from '@noice-com/utils';
import notifee, { EventType } from '@notifee/react-native';
import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';

import { AuthenticatedNavigationHookProps } from '@navigators/routes';

type Payload = {
  notification: {
    data: PushNotificationPayload;
  };
};

const { logInfo } = makeLoggers('Push notification');
export const useNotificationEvents = () => {
  const navigation = useNavigation<AuthenticatedNavigationHookProps>();

  useEffect(() => {
    return notifee.onForegroundEvent(({ type, detail }) => {
      // forced cast since Notifee has no types for this
      const payload = detail as Payload;

      logInfo('Remote notification info: ', detail.notification);

      if (!payload?.notification.data.channelLive) {
        return;
      }

      routePushNotificationPayloadPayloadDelegate(undefined, payload.notification.data, {
        onChannelLive(_, { channelName }) {
          if (type === EventType.PRESS) {
            if (channelName) {
              navigation.navigate('channel', {
                channelName,
              });
            }
          }
        },
      });
    });
  }, [navigation]);
};
