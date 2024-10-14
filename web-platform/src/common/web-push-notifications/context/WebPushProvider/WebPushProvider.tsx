import { gql } from '@apollo/client';
import { useAnalytics, WithChildren } from '@noice-com/common-ui';
import { AnalyticsEventClientWebPushNotificationActionAction } from '@noice-com/schemas/analytics/analytics.pb';
import { makeLoggers, Nullable, repromise } from '@noice-com/utils';
import { createContext, useCallback, useContext, useState } from 'react';

import { registerServiceWorker } from '../../../../service-worker-registration';
import { useFirebase } from '../FirebaseProvider';

import Icon from './noice-icon.png?url';

import { useEnvironmentCheck } from '@common/environment';
import {
  useAddPushNotificationTokenMutation,
  useDeletePushNotificationTokenMutation,
  useGetPushNotificationTokenLazyQuery,
} from '@gen';

gql`
  query GetPushNotificationToken($token: String!) {
    pushNotificationToken(token: $token) {
      token
    }
  }

  mutation AddPushNotificationToken($token: String!) {
    addPushNotificationToken(
      token: $token
      tokenType: PUSH_NOTIFICATION_TOKEN_TYPE_FIREBASE
    ) {
      emptyTypeWorkaround
    }
  }

  mutation DeletePushNotificationToken($token: String!) {
    deletePushNotificationToken(token: $token) {
      emptyTypeWorkaround
    }
  }
`;

const getNotificationPermission = () =>
  'Notification' in window ? Notification.permission : undefined;
const isPushNotificationsPermissionGranted = () =>
  getNotificationPermission() === 'granted';
const isPushNotificationsPermissionDenied = () =>
  getNotificationPermission() === 'denied';

interface Context {
  verifyIfCanUsePushNotifications: () => Promise<boolean>;
  enablePushNotifications: (onEnabled?: () => void, onError?: () => void) => void;
  disablePushNotifications: () => void;
  isPushNotificationsEnabled: boolean;
  isPushAPISupported: boolean;
  isPushNotificationsBlockedByUser: boolean;
  isPushNotificationsLoading: boolean;
  sendTestPushNotification: (onClose?: () => void) => void;
}

const { logError } = makeLoggers('WebPushProvider');

const WebPushContext = createContext<Context | null>(null);
const firebaseMessagingPromise = repromise(() => import('firebase/messaging'));

export function WebPushProvider({ children }: WithChildren) {
  const { firebaseApp } = useFirebase();
  const { isMobile } = useEnvironmentCheck();
  const [token, setToken] = useState<Nullable<string>>(null);
  const [loading, setLoading] = useState(false);

  const [deletePushNotificationToken] = useDeletePushNotificationTokenMutation();
  const [addPushNotificationToken] = useAddPushNotificationTokenMutation();
  const [getPushNotificationToken] = useGetPushNotificationTokenLazyQuery();

  const isPushAPISupported = !isMobile && 'Notification' in window;
  const isPushNotificationsEnabled = isPushNotificationsPermissionGranted() && !!token;
  const isPushNotificationsBlockedByUser = isPushNotificationsPermissionDenied();
  const { trackEvent } = useAnalytics();

  const getFirebaseToken = useCallback(async () => {
    if (!firebaseApp) {
      throw new Error('Attempting to fetch Firebase token without initialized Firebase!');
    }

    const { getToken, getMessaging } = await firebaseMessagingPromise;
    const messaging = getMessaging(firebaseApp);
    const serviceWorkerRegistration = await registerServiceWorker();

    if (!serviceWorkerRegistration) {
      throw new Error('No registered service worker to use!');
    }

    return await getToken(messaging, {
      vapidKey: NOICE.FIREBASE_VAPID_KEY,
      serviceWorkerRegistration,
    });
  }, [firebaseApp]);

  const verifyIfCanUsePushNotifications = useCallback(async () => {
    if (token) {
      return true;
    }

    if (!isPushNotificationsPermissionGranted() || loading) {
      return false;
    }

    setLoading(true);

    try {
      const firebaseToken = await getFirebaseToken();
      // checking if we have firebase token stored on backend to send push notifications
      const { data } = await getPushNotificationToken({
        variables: { token: firebaseToken },
        onCompleted: (data) => {
          if (data.pushNotificationToken?.token) {
            setToken(firebaseToken);
          }

          // if token is not found on backend, then push notifications are disabled for user
          setLoading(false);
        },
      });

      return !!data?.pushNotificationToken?.token;
    } catch (e) {
      logError(e);
      return false;
    } finally {
      setLoading(false);
    }
  }, [getFirebaseToken, getPushNotificationToken, loading, token]);

  const enablePushNotifications = useCallback(
    async (onEnabled?: () => void, onError?: () => void) => {
      if (!isPushAPISupported || isPushNotificationsPermissionDenied()) {
        return;
      }

      setLoading(true);
      await Notification.requestPermission();
      if (!isPushNotificationsPermissionGranted()) {
        trackEvent({
          clientWebPushNotificationAction: {
            action: AnalyticsEventClientWebPushNotificationActionAction.ACTION_DISABLED,
          },
        });
        setLoading(false);
        return;
      }

      trackEvent({
        clientWebPushNotificationAction: {
          action: AnalyticsEventClientWebPushNotificationActionAction.ACTION_ENABLED,
        },
      });

      try {
        const firebaseToken = await getFirebaseToken();
        await addPushNotificationToken({
          variables: { token: firebaseToken },
          onCompleted: () => {
            setToken(firebaseToken);
            setLoading(false);
          },
        });
        onEnabled?.();
      } catch (e) {
        onError?.();
        logError(e);
      } finally {
        setLoading(false);
      }
    },
    [addPushNotificationToken, getFirebaseToken, isPushAPISupported, trackEvent],
  );

  const disablePushNotifications = useCallback(async () => {
    if (!token) {
      logError(
        'Push notifications token is undefined! Unexpected disablePushNotifications call',
      );
      return;
    }

    setLoading(true);
    await deletePushNotificationToken({
      variables: { token },
      onCompleted: () => {
        trackEvent({
          clientWebPushNotificationAction: {
            action: AnalyticsEventClientWebPushNotificationActionAction.ACTION_DISABLED,
          },
        });

        setToken(null);
        setLoading(false);
      },
      onError: () => {
        setLoading(false);
      },
    });
  }, [deletePushNotificationToken, token, trackEvent]);

  const sendTestPushNotification = useCallback((onClose?: () => void) => {
    if (!isPushNotificationsPermissionGranted()) {
      logError(
        'Attempted to send test push notification without granted browser permission',
      );
      return;
    }

    const notification = new Notification('Noice', {
      body: 'Yay! Notifications are up and running!',
      icon: Icon,
      requireInteraction: true,
    });

    notification.onclick = () => {
      notification.close();
    };

    notification.onclose = () => {
      onClose?.();
    };
  }, []);

  return (
    <WebPushContext.Provider
      value={{
        verifyIfCanUsePushNotifications,
        enablePushNotifications,
        disablePushNotifications,
        isPushNotificationsEnabled,
        isPushAPISupported,
        isPushNotificationsBlockedByUser,
        isPushNotificationsLoading: loading,
        sendTestPushNotification,
      }}
    >
      {children}
    </WebPushContext.Provider>
  );
}

export function useWebPushAPI(): Context {
  const context = useContext(WebPushContext);

  if (!context) {
    throw new Error('Trying to access context without WebPushContext');
  }

  return context;
}
