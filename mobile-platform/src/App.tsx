import { ApolloProvider } from '@apollo/client';
import Chargebee from '@chargebee/react-native-chargebee';
import { registerGlobals } from '@livekit/react-native-webrtc';
import { ClientProvider } from '@noice-com/common-react-core';
import { Client } from '@noice-com/platform-client';
import {
  AnalyticsEventClientAppStateChangedAppState,
  AnalyticsEventClientMobilePushNotificationActionAction,
} from '@noice-com/schemas/analytics/analytics.pb';
import notifee, { EventType } from '@notifee/react-native';
import {
  DefaultTheme,
  LinkingOptions,
  NavigationContainer,
} from '@react-navigation/native';
import { preventAutoHideAsync as SplashScreenPreventAutoHideAsync } from 'expo-splash-screen';
import { ErrorInfo, useCallback, useRef } from 'react';
import { AppState, Platform, Text } from 'react-native';
import Config from 'react-native-config';
import {
  getBuildNumber,
  getBundleId,
  getModel,
  getVersion,
} from 'react-native-device-info';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Orientation from 'react-native-orientation-locker';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from 'react-query';

import { MicroSurveyProvider } from './providers';

import { ErrorBoundary } from '@components/ErrorBoundary';
import { ToastContainer } from '@components/Toast/ToastContainer';
import { colors } from '@constants/styles';
import { useApolloClientStore } from '@hooks/useApolloClientStore.hook';
import { useMountEffect } from '@hooks/useMountEffect.hook';
import { useInitStreamStore } from '@hooks/useStreamStore.hook';
import { Analytics } from '@lib/Analytics';
import { InstrumentationAnalytics } from '@lib/InstrumentationAnalytics';
import { MarketingTracking } from '@lib/MarketingTracking';
import { UserConsent } from '@lib/UserConsent';
import { RootNavigator } from '@navigators/Root.navigator';
import { RootNavigatorParams } from '@navigators/routes';
import { navigationRef } from '@navigators/utils/navigation';
import { clientStorage } from '@utils/storage';
import { FatalErrorView } from '@views/FatalError';

// @note: temporary solution for broken UI on devices
// with scaled font size, remove this when we update components to accomodate for this
// @ts-ignore
Text.defaultProps = Text.defaultProps || {};
// @ts-ignore
Text.defaultProps.allowFontScaling = false;

// @note reduces flickering
const NavTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    background: colors.gray950,
  },
};

export const client = new Client(Config.SERVICES_LIB_HOST, {
  useWSMuxer: true,
  forceWSStreaming: true,
  storage: clientStorage,
});

const queryClient = new QueryClient();

// Init analytics
Analytics.init(client);
const linking: LinkingOptions<RootNavigatorParams> = {
  prefixes: [
    'com.noice.MobilePlatform://',
    'https://*.noice.com',
    'https://noice.com',
    'https://www.noice.com',
    'https://mvp.int.stg.noice.com',
    'https://www.mvp.int.stg.noice.com',
  ],
  config: {
    initialRouteName: 'authenticated',
    screens: {
      authenticated: {
        initialRouteName: 'homeTab',
        screens: {
          homeTab: {
            screens: {
              home: 'home',
              following: 'following', // does not exist on noice.com
              friends: 'friends', // does not exist on noice.com
              user: 'user', // your own user page, this one doesn't exist on noice.com
              profile: 'u/:userTag',
              channel: ':channelName',
              browse: {
                // handle gameId in URL https://noice.com/browse?gameId=fornite
                path: 'browse',
                parse: {
                  gameId: (gameId: string) => {
                    return { gameId };
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

SplashScreenPreventAutoHideAsync();

// @todo we might need to offload all of these so that all of these globals
// happen sort of inline with the rest of the app
registerGlobals();

function AppRoot(): JSX.Element {
  // Init stream store
  useInitStreamStore(client);
  const { apolloClient } = useApolloClientStore(client);
  const prevRouteNameRef = useRef<string>();

  const setNavRefToInstrumenationRouteTracking = useCallback(() => {
    InstrumentationAnalytics.routingInstrumentation.registerNavigationContainer(
      navigationRef,
    );
  }, []);

  useMountEffect(() => {
    UserConsent.configure();
    Orientation.lockToPortrait();

    Analytics.trackEvent({
      clientEnvironmentCheck: {
        mobileOsName: Platform.OS,
        mobileBuildNumber: getBuildNumber(),
        mobileVersion: getVersion(),
        mobileDeviceModel: getModel(),
      },
    });

    Analytics.trackEvent({
      clientMobileAppLaunch: {},
    });

    const appActiveStateSub = AppState.addEventListener('change', (nextAppState) => {
      let appState: AnalyticsEventClientAppStateChangedAppState =
        AnalyticsEventClientAppStateChangedAppState.APP_STATE_UNSPECIFIED;

      if (nextAppState === 'active') {
        appState = AnalyticsEventClientAppStateChangedAppState.APP_STATE_FOREGROUND;
      } else if (nextAppState === 'background') {
        appState = AnalyticsEventClientAppStateChangedAppState.APP_STATE_BACKGROUND;
      } else if (nextAppState === 'inactive') {
        appState = AnalyticsEventClientAppStateChangedAppState.APP_STATE_INACTIVE;
      }

      Analytics.trackEvent({
        clientAppStateChanged: {
          appState,
        },
      });
    });

    const notifeeEventSub = notifee.onForegroundEvent(({ type }) => {
      let action: AnalyticsEventClientMobilePushNotificationActionAction =
        AnalyticsEventClientMobilePushNotificationActionAction.ACTION_UNSPECIFIED;

      if (type === EventType.DISMISSED) {
        action =
          AnalyticsEventClientMobilePushNotificationActionAction.ACTION_USER_DISMISSED_NOTIFICATION;
      } else if (type === EventType.PRESS) {
        action =
          AnalyticsEventClientMobilePushNotificationActionAction.ACTION_USER_PRESSED_NOTIFICATION;
      } else if (type === EventType.APP_BLOCKED) {
        action =
          AnalyticsEventClientMobilePushNotificationActionAction.ACTION_USER_BLOCKED_APP_NOTIFICATIONS;
      }

      Analytics.trackEvent({
        clientMobilePushNotificationAction: {
          action,
        },
      });
    });

    // Check notification app open
    notifee
      .getInitialNotification()
      .then((notification) => {
        if (!notification) {
          return;
        }

        return Analytics.trackEvent({
          clientMobilePushNotificationAction: {
            action:
              AnalyticsEventClientMobilePushNotificationActionAction.ACTION_USER_OPENED_APP_FROM_NOTIFICATION,
          },
        });
      })
      .catch(() => {});

    return () => {
      appActiveStateSub.remove();
      notifeeEventSub();
    };
  });

  const onNavigationStateChange = useCallback(() => {
    const routeName = navigationRef.current?.getCurrentRoute()?.name;
    const bundleId = getBundleId();
    const pathname = `${bundleId}/${routeName}`;

    if (routeName && routeName !== prevRouteNameRef.current) {
      MarketingTracking.trackScreenView(routeName);
    }

    Analytics.trackEvent({
      clientNavigate: {
        pathname,
      },
    });

    prevRouteNameRef.current = routeName;
  }, []);

  const handleUncaughtError = useCallback((error: Error, errInfo: ErrorInfo) => {
    // Use the built-in dev boundaries in dev
    if (__DEV__) {
      return;
    }

    InstrumentationAnalytics.captureException(error, {
      severityLevel: 'fatal',
      extra: {
        stack: errInfo.componentStack,
      },
    });
  }, []);

  useMountEffect(() => {
    Chargebee.configure({
      site: Config.CHARGEBEE_SITE,
      publishableApiKey: Config.CHARGEBEE_PUBLISHABLE_API_KEY,
      androidSdkKey: Config.CHARGEBEE_ANDROID_KEY,
      iOsSdkKey: Config.CHARGEBEE_IOS_KEY,
    });
  });

  return (
    <GestureHandlerRootView>
      <QueryClientProvider client={queryClient}>
        <ClientProvider client={client}>
          <ApolloProvider client={apolloClient}>
            <MicroSurveyProvider>
              <SafeAreaProvider>
                <NavigationContainer
                  linking={linking}
                  ref={navigationRef}
                  theme={NavTheme}
                  onReady={setNavRefToInstrumenationRouteTracking}
                  onStateChange={onNavigationStateChange}
                >
                  <ErrorBoundary
                    fallback={FatalErrorView}
                    onError={handleUncaughtError}
                  >
                    <RootNavigator />
                    <ToastContainer />
                  </ErrorBoundary>
                </NavigationContainer>
              </SafeAreaProvider>
            </MicroSurveyProvider>
          </ApolloProvider>
        </ClientProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
export const App = InstrumentationAnalytics.wrapRoot(AppRoot);
