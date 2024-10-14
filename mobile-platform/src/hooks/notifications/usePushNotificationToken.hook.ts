import { gql } from '@apollo/client';
import { makeLoggers } from '@noice-com/utils';
import messaging from '@react-native-firebase/messaging';
import { useCallback, useEffect } from 'react';

import { useAddPushNotificationTokenMutation } from '@gen/graphql';

const { logError } = makeLoggers('Push notification');

gql`
  mutation AddPushNotificationToken($token: String!) {
    addPushNotificationToken(
      token: $token
      tokenType: PUSH_NOTIFICATION_TOKEN_TYPE_FIREBASE
    ) {
      emptyTypeWorkaround
    }
  }
`;

export const usePushNotificationToken = () => {
  const [addPushNotificationToken] = useAddPushNotificationTokenMutation({});

  const saveToken = useCallback(
    async (token: string) => {
      await addPushNotificationToken({ variables: { token } });
    },
    [addPushNotificationToken],
  );

  useEffect(() => {
    // Get the device token
    messaging()
      .getToken()
      .then((token) => {
        return saveToken(token);
      })
      .catch((err) => {
        logError('Error getting push token', err);
      });

    // Listen to whether the token changes
    return messaging().onTokenRefresh((token) => {
      saveToken(token);
    });
  }, [saveToken]);
};
